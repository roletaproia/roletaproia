import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { signals, recommendations, captureSessions } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { generateAdvancedRecommendation } from "../utils/aiRecommendation";
import { generateAdvancedRecommendationV2 } from "../utils/aiRecommendationV2";

export const signalsRouter = router({
  // Admin envia um novo sinal capturado
  sendSignal: protectedProcedure
    .input(
      z.object({
        number: z.number().min(0).max(36),
        color: z.enum(["red", "black", "green"]),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Apenas admin pode enviar sinais
      if (ctx.user.role !== "admin") {
        throw new Error("Apenas administradores podem enviar sinais");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Inserir sinal no banco
      const [signal] = await db
        .insert(signals)
        .values({
          number: input.number,
          color: input.color,
          source: "1win",
          sessionId: input.sessionId || null,
          timestamp: new Date(),
        })
        .returning();

      // Gerar recomendação baseada no histórico (V2 - análise profunda)
      const recentSignals = await db
        .select()
        .from(signals)
        .orderBy(desc(signals.timestamp))
        .limit(200); // Análise profunda com 200 sinais

      const recommendation = generateAdvancedRecommendationV2(recentSignals);

      // Salvar recomendação (adaptado para V2)
      await db.insert(recommendations).values({
        signalId: signal.id,
        betType: recommendation.suggestedColor || "red",
        confidence: recommendation.confidence,
        suggestedAmount: 10,
        strategy: "ai_advanced_v2",
        result: "pending",
        // Dados adicionais da I.A. avançada V2
        suggestedNumber: recommendation.suggestedNumber,
        suggestedDozen: recommendation.suggestedNumber ? Math.ceil(recommendation.suggestedNumber / 12) : 1,
        suggestedColumn: recommendation.suggestedNumber ? ((recommendation.suggestedNumber - 1) % 3) + 1 : 1,
        suggestedParity: recommendation.suggestedNumber && recommendation.suggestedNumber % 2 === 0 ? "par" : "impar",
        sector: "v2_confluence",
        neighbors: JSON.stringify([]),
        analysis: JSON.stringify(recommendation.analysis),
        suggestedColor: recommendation.suggestedColor,
      });

      return { success: true, signal, recommendation };
    }),

  // Buscar últimos N sinais
  getLatestSignals: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const latestSignals = await db
        .select()
        .from(signals)
        .orderBy(desc(signals.timestamp))
        .limit(input.limit);

      return latestSignals;
    }),

  // Buscar sinal atual + recomendação
  getCurrentSignal: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const [latestSignal] = await db
      .select()
      .from(signals)
      .orderBy(desc(signals.timestamp))
      .limit(1);

    if (!latestSignal) {
      return null;
    }

    // Buscar a última recomendação criada (para a PRÓXIMA rodada)
    const [recommendation] = await db
      .select()
      .from(recommendations)
      .orderBy(desc(recommendations.createdAt))
      .limit(1);

    return {
      signal: latestSignal,
      recommendation: recommendation || null,
    };
  }),

  // Estatísticas da sessão
  getSessionStats: publicProcedure
    .input(z.object({ sessionId: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return {
        totalSignals: 0,
        redCount: 0,
        blackCount: 0,
        greenCount: 0,
        redPercentage: 0,
        blackPercentage: 0,
        greenPercentage: 0,
      };

      // Buscar todos os sinais (ou filtrar por sessão)
      const allSignals = input.sessionId
        ? await db
            .select()
            .from(signals)
            .where(eq(signals.sessionId, input.sessionId))
            .orderBy(desc(signals.timestamp))
        : await db
            .select()
            .from(signals)
            .orderBy(desc(signals.timestamp))
            .limit(100);

      // Calcular estatísticas
      const totalSignals = allSignals.length;
      const redCount = allSignals.filter((s) => s.color === "red").length;
      const blackCount = allSignals.filter((s) => s.color === "black").length;
      const greenCount = allSignals.filter((s) => s.color === "green").length;

      return {
        totalSignals,
        redCount,
        blackCount,
        greenCount,
        redPercentage: totalSignals > 0 ? (redCount / totalSignals) * 100 : 0,
        blackPercentage: totalSignals > 0 ? (blackCount / totalSignals) * 100 : 0,
        greenPercentage: totalSignals > 0 ? (greenCount / totalSignals) * 100 : 0,
      };
    }),

  // Iniciar sessão de captura
  startCaptureSession: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Apenas administradores podem iniciar sessões");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const sessionId = uuidv4();

    await db.insert(captureSessions).values({
      sessionId,
      startedBy: ctx.user.id,
      status: "active",
      totalSignals: 0,
      startedAt: new Date(),
    });

    return { sessionId };
  }),

  // Parar sessão de captura
  stopCaptureSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Apenas administradores podem parar sessões");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(captureSessions)
        .set({
          status: "stopped",
          stoppedAt: new Date(),
        })
        .where(eq(captureSessions.sessionId, input.sessionId));

      return { success: true };
    }),
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

