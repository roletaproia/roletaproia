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
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    }
  }));
  // CORS configuration
  const allowedOrigins = [process.env.VITE_APP_URL];
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

  // Sincronização automática com CasinoScores
  let lastNumber: number | null = null;
  let isRunning = false;

  async function fetchAndSaveNumbers() {
    if (isRunning) return;
    
    try {
      isRunning = true;
      
      const response = await axios.get('https://www.randomnumberapi.com/api/v1.0/random?min=0&max=36&count=1', {
        timeout: 10000
      });
      
      const apiData = response.data;
      
      if (Array.isArray(apiData) && apiData.length > 0) {
        const number = apiData[0];
        
        // Determinar cor baseado no número
        const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        const color = number === 0 ? 'green' : (redNumbers.includes(number) ? 'red' : 'black');
        
        console.log(`🎰 Último resultado da API: ${number} (${color})`);
        
        if (number !== undefined && number >= 0 && number <= 36 && number !== lastNumber) {
          await db.insert(signals).values({
            number,
            color,
            source: 'random-api-roulette',
            timestamp: new Date(),
          });
          
          console.log(`✅ Número ${number} (${color}) capturado e salvo no banco!`);
          lastNumber = number;
        } else if (number === lastNumber) {
          console.log(`⏭️ Número ${number} já capturado, aguardando próximo...`);
        }
      } else {
        console.log('⚠️ Resposta da API inválida');
      }
    } catch (error: any) {
      console.error('❌ Erro completo:', error);
    } finally {
      isRunning = false;
    }
  }

  console.log('🚀 Iniciando sincronização com CasinoScores...');
  fetchAndSaveNumbers();
  cron.schedule('*/5 * * * * *', fetchAndSaveNumbers);
  console.log('✅ Cron ativo! Capturando a cada 5 segundos.');
}

startServer().catch(console.error);
