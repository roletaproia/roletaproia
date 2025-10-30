import { Router } from "express";
import { getDb } from "../db";
import { signals, recommendations, captureSessions } from "../../drizzle/schema";
import { desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Chave secreta para autenticação simples
const SECRET_KEY = process.env.SIGNALS_SECRET_KEY || "roleta-pro-ia-secret-2024";

// Middleware para verificar chave secreta
function verifySecretKey(req: any, res: any, next: any) {
  const secret = req.query.secret || req.body.secret || req.headers['x-secret-key'];
  
  if (secret !== SECRET_KEY) {
    return res.status(403).json({ error: "Chave secreta inválida" });
  }
  
  next();
}

// POST /api/signals-public/send - Enviar novo sinal (público com chave secreta)
router.post("/send", verifySecretKey, async (req, res) => {
  try {
    const { number, color, sessionId } = req.body;

    if (number === undefined || !color) {
      return res.status(400).json({ error: "number e color são obrigatórios" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    // Usar sessionId fornecido ou gerar um novo
    const finalSessionId = sessionId || `public-${uuidv4()}`;

    // Inserir sinal no banco
    const [signal] = await db
      .insert(signals)
      .values({
        number,
        color,
        source: "1win",
        sessionId: finalSessionId,
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

    console.log(`[SIGNAL] Número ${number} (${color}) capturado via endpoint público`);

    res.json({ 
      success: true, 
      signal: {
        id: signal.id,
        number: signal.number,
        color: signal.color,
        timestamp: signal.timestamp,
      },
      recommendation 
    });
  } catch (error: any) {
    console.error("Erro ao enviar sinal:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/signals-public/latest - Obter últimos sinais (público com chave secreta)
router.get("/latest", verifySecretKey, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const latestSignals = await db
      .select()
      .from(signals)
      .orderBy(desc(signals.timestamp))
      .limit(limit);

    res.json({ success: true, signals: latestSignals });
  } catch (error: any) {
    console.error("Erro ao buscar sinais:", error);
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

