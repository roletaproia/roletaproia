import { Router } from "express";
import { getDb } from "../db";
import { signals, recommendations, captureSessions } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { jwtVerify } from "jose";

const router = Router();

// Middleware para verificar JWT e admin
async function verifyAdmin(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );
    
    const { payload } = await jwtVerify(token, secret);
    
    console.log("[JWT] Payload recebido:", JSON.stringify(payload, null, 2));
    
    if (!payload || !payload.userId) {
      console.error("[JWT] Erro: payload.userId não encontrado", payload);
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    // Buscar usuário no banco
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const users = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, payload.userId as number),
    });

    if (!users || users.role !== "admin") {
      return res.status(403).json({ error: "Apenas administradores podem acessar" });
    }

    req.user = users;
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

// POST /api/signals/start - Iniciar sessão de captura
router.post("/start", verifyAdmin, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const sessionId = uuidv4();

    await db.insert(captureSessions).values({
      sessionId,
      startedBy: req.user.id,
      status: "active",
      totalSignals: 0,
      startedAt: new Date(),
    });

    res.json({ sessionId });
  } catch (error: any) {
    console.error("Erro ao iniciar sessão:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/signals/stop - Parar sessão de captura
router.post("/stop", verifyAdmin, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId é obrigatório" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    await db
      .update(captureSessions)
      .set({
        status: "stopped",
        stoppedAt: new Date(),
      })
      .where(eq(captureSessions.sessionId, sessionId));

    res.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao parar sessão:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/signals/send - Enviar novo sinal
router.post("/send", verifyAdmin, async (req, res) => {
  try {
    const { number, color, sessionId } = req.body;

    if (number === undefined || !color) {
      return res.status(400).json({ error: "number e color são obrigatórios" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    // Inserir sinal no banco
    const [signal] = await db
      .insert(signals)
      .values({
        number,
        color,
        source: "1win",
        sessionId: sessionId || null,
        timestamp: new Date(),
      })
      .returning();

    // Gerar recomendação baseada no histórico
    const recentSignals = await db
      .select()
      .from(signals)
      .orderBy(desc(signals.timestamp))
      .limit(10);

    const recommendation = generateRecommendation(recentSignals);

    // Salvar recomendação
    await db.insert(recommendations).values({
      signalId: signal.id,
      betType: recommendation.betType,
      confidence: recommendation.confidence,
      suggestedAmount: recommendation.suggestedAmount,
      strategy: recommendation.strategy,
      result: "pending",
    });

    res.json({ success: true, signal, recommendation });
  } catch (error: any) {
    console.error("Erro ao enviar sinal:", error);
    res.status(500).json({ error: error.message });
  }
});

// Função auxiliar para gerar recomendação
function generateRecommendation(recentSignals: any[]) {
  if (recentSignals.length === 0) {
    return {
      betType: "red",
      confidence: 50,
      suggestedAmount: 10,
      strategy: "random",
    };
  }

  // Estratégia simples: Equalização de cores
  const redCount = recentSignals.filter((s) => s.color === "red").length;
  const blackCount = recentSignals.filter((s) => s.color === "black").length;

  let betType = "red";
  let confidence = 50;

  if (redCount > blackCount + 2) {
    betType = "black";
    confidence = 60 + Math.min((redCount - blackCount) * 5, 30);
  } else if (blackCount > redCount + 2) {
    betType = "red";
    confidence = 60 + Math.min((blackCount - redCount) * 5, 30);
  }

  return {
    betType,
    confidence: Math.min(confidence, 95),
    suggestedAmount: 10,
    strategy: "equalization",
  };
}

export default router;

