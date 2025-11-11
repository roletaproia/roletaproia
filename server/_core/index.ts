import "dotenv/config";
import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { upload, processAndSaveAvatar } from "./fileUpload";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import signalsApiRouter from "../routes/signals-api";
import signalsPublicRouter from "../routes/signals-public";
import cron from 'node-cron';
import { getDb } from "../db";
import { signals, recommendations } from "./schema";
import { desc } from "drizzle-orm";
import axios from 'axios';

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Executar migrations antes de iniciar o servidor
  const { runMigrations } = await import('../utils/runMigrations');
  await runMigrations();

  const app = express();
  // Security middlewares with CSP configuration
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://i.imgur.com",
          "https://imgur.com",
          "https://i.ibb.co",
          "https://ibb.co",
          "https://i.postimg.cc",
          "https://postimg.cc",
          "https://postimages.org"
        ],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"],
        frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"]
      }
    }
  }));
  // CORS configuration
  const allowedOrigins = [
    process.env.VITE_APP_URL,
    'https://roboroleta.com.br',
    'https://www.roboroleta.com.br',
    'https://roletaproia.onrender.com'
  ];
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (process.env.NODE_ENV === "development" || !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Configure cookie parser
  app.use(cookieParser());
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Extension download endpoint - redirect to GitHub
  app.get("/api/download/extension", (req, res) => {
    // Redirect to GitHub raw file
    const githubUrl = 'https://github.com/roletaproia/roletaproia/raw/main/roletapro-extension.zip';
    console.log('[Download] Redirecting to GitHub:', githubUrl);
    res.redirect(githubUrl);
  });
  
  // File upload endpoint for avatars
  app.post("/api/upload/avatar", upload.single("avatar"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }
      
      // Authenticate user from request
      const user = await (req as any).user;
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const avatarUrl = await processAndSaveAvatar(req.file, user.id);
      res.json({ success: true, avatarUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message || "Upload failed" });
    }
  });
  
  // REST API for signals (easier for external scripts)
  app.use("/api/signals", signalsApiRouter);

  // Nova Rota para receber o sinal do seu computador local
  app.post('/api/receive-signal', async (req, res) => {
    try {
      const { number, color, source, timestamp } = req.body;

      if (number === undefined || color === undefined) {
        return res.status(400).send('Dados inválidos.');
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Inserir sinal no banco (MySQL não suporta .returning())
      await db.insert(signals).values({
        number: number,
        color: color,
        source: source || 'local-cron-sender',
        timestamp: new Date(timestamp) || new Date(),
      });

      // Buscar o sinal recém-inserido e os últimos 200 sinais para gerar recomendação V2
      const recentSignals = await db
        .select()
        .from(signals)
        .orderBy(desc(signals.timestamp))
        .limit(200); // V2 usa 200 spins para análise profunda

      if (recentSignals.length === 0) {
        console.log(`[RECEBIDO] Sinal ${number} (${color}) de ${source} - Sem sinais para análise`);
        return res.status(200).send('Sinal recebido e salvo.');
      }

      const latestSignal = recentSignals[0];

      // Gerar recomendação da I.A. V2 (5 estratégias avançadas)
      const { generateAdvancedRecommendationV2 } = await import('../utils/aiRecommendationV2');
      const recommendation = generateAdvancedRecommendationV2(recentSignals);

      // Salvar recomendação
      console.log('[SALVANDO] Dados da recomendação:', {
        suggestedNumber: recommendation.suggestedNumber,
        suggestedDozen: recommendation.suggestedDozen,
        suggestedColumn: recommendation.suggestedColumn,
        suggestedParity: recommendation.suggestedParity,
        sector: recommendation.sector,
        neighbors: JSON.stringify(recommendation.neighbors),
        analysis: JSON.stringify(recommendation.analysis),
      });
      
      await db.insert(recommendations).values({
        signalId: latestSignal.id,
        betType: recommendation.suggestedColor || "red",
        confidence: recommendation.confidence,
        suggestedAmount: 10,
        strategy: "ai_advanced_v2",
        result: "pending",
        // Dados V2
        suggestedNumber: recommendation.suggestedNumber,
        suggestedDozen: recommendation.suggestedNumber ? Math.ceil(recommendation.suggestedNumber / 12) : 1,
        suggestedColumn: recommendation.suggestedNumber ? ((recommendation.suggestedNumber - 1) % 3) + 1 : 1,
        suggestedParity: recommendation.suggestedNumber && recommendation.suggestedNumber % 2 === 0 ? "par" : "impar",
        sector: "v2_confluence",
        neighbors: JSON.stringify([]),
        analysis: JSON.stringify(recommendation.analysis),
        suggestedColor: recommendation.suggestedColor,
      });

      console.log(`[RECEBIDO] Sinal ${number} (${color}) de ${source} - Recomendação gerada!`);
      res.status(200).send('Sinal recebido e salvo.');

    } catch (error) {
      console.error('Erro ao receber sinal:', error);
      res.status(500).send('Erro interno do servidor.');
    }
  });
  
  // Public API for signals (with secret key)
  app.use("/api/signals-public", signalsPublicRouter);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  // Cron job interno desativado. A sincronização é feita pelo script local do usuário.
}

startServer().catch(console.error);
