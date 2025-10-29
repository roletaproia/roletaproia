import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc, and, gte } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { signals, recommendations, captureSessions, users } from "../../drizzle/schema";
import { v4 as uuidv4 } from "uuid";

/**
 * Router para gerenciar sinais da roleta em tempo real
 * Endpoints para captura, transmissão e recomendações de apostas
 */
export const signalsRouter = router({
  /**
   * Endpoint para enviar um novo sinal (apenas admin)
   * Usado pelo script Puppeteer para enviar números capturados
   */
  sendSignal: protectedProcedure
    .input(
      z.object({
        number: z.number().min(0).max(36),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verificar se é admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem enviar sinais",
        });
      }

      // Determinar cor do número
      const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
      const color = input.number === 0 ? "green" : redNumbers.includes(input.number) ? "red" : "black";

      // Inserir sinal no banco
      const [signal] = await db.insert(signals).values({
        number: input.number,
        color,
        sessionId: input.sessionId || null,
        source: "1win",
        timestamp: new Date(),
      });

      // Atualizar sessão de captura se existir
      if (input.sessionId) {
        await db
          .update(captureSessions)
          .set({
            totalSignals: db.raw("totalSignals + 1"),
            lastSignalAt: new Date(),
          })
          .where(eq(captureSessions.sessionId, input.sessionId));
      }

      // Gerar recomendação baseada no histórico
      const recommendation = await generateRecommendation(signal.insertId);

      return {
        success: true,
        signal: {
          id: signal.insertId,
          number: input.number,
          color,
          timestamp: new Date(),
        },
        recommendation,
      };
    }),

  /**
   * Obter últimos sinais (público - todos podem ver)
   */
  getLatestSignals: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const latestSignals = await db
        .select()
        .from(signals)
        .orderBy(desc(signals.timestamp))
        .limit(input.limit);

      return latestSignals;
    }),

  /**
   * Obter sinal atual e recomendação (público)
   */
  getCurrentSignal: publicProcedure.query(async () => {
    // Buscar último sinal
    const [currentSignal] = await db
      .select()
      .from(signals)
      .orderBy(desc(signals.timestamp))
      .limit(1);

    if (!currentSignal) {
      return null;
    }

    // Buscar recomendação associada
    const [recommendation] = await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.signalId, currentSignal.id))
      .orderBy(desc(recommendations.createdAt))
      .limit(1);

    return {
      signal: currentSignal,
      recommendation: recommendation || null,
    };
  }),

  /**
   * Obter estatísticas da sessão atual
   */
  getSessionStats: publicProcedure.query(async () => {
    // Buscar sinais das últimas 24 horas
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentSignals = await db
      .select()
      .from(signals)
      .where(gte(signals.timestamp, twentyFourHoursAgo))
      .orderBy(desc(signals.timestamp));

    // Buscar recomendações com resultado
    const recentRecommendations = await db
      .select()
      .from(recommendations)
      .where(gte(recommendations.createdAt, twentyFourHoursAgo));

    const wins = recentRecommendations.filter((r) => r.result === "win").length;
    const losses = recentRecommendations.filter((r) => r.result === "loss").length;
    const total = wins + losses;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    // Calcular lucro estimado (simplificado)
    const estimatedProfit = wins * 1000 - losses * 1000; // R$ 10 por aposta

    return {
      totalSignals: recentSignals.length,
      totalRecommendations: total,
      wins,
      losses,
      winRate,
      estimatedProfit,
      currentStreak: calculateStreak(recentRecommendations),
    };
  }),

  /**
   * Iniciar sessão de captura (apenas admin)
   */
  startCaptureSession: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem iniciar sessões de captura",
      });
    }

    const sessionId = uuidv4();

    await db.insert(captureSessions).values({
      sessionId,
      startedBy: ctx.user.id,
      status: "active",
      totalSignals: 0,
      startedAt: new Date(),
    });

    return {
      success: true,
      sessionId,
    };
  }),

  /**
   * Parar sessão de captura (apenas admin)
   */
  stopCaptureSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem parar sessões de captura",
        });
      }

      await db
        .update(captureSessions)
        .set({
          status: "stopped",
          stoppedAt: new Date(),
        })
        .where(eq(captureSessions.sessionId, input.sessionId));

      return {
        success: true,
      };
    }),

  /**
   * Obter sessões de captura ativas (admin)
   */
  getActiveSessions: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem ver sessões de captura",
      });
    }

    const activeSessions = await db
      .select()
      .from(captureSessions)
      .where(eq(captureSessions.status, "active"))
      .orderBy(desc(captureSessions.startedAt));

    return activeSessions;
  }),
});

/**
 * Função auxiliar para gerar recomendação baseada no histórico
 */
async function generateRecommendation(signalId: number) {
  // Buscar últimos 10 números
  const recentSignals = await db
    .select()
    .from(signals)
    .orderBy(desc(signals.timestamp))
    .limit(10);

  if (recentSignals.length === 0) {
    return null;
  }

  // Análise simples: contar cores
  const redCount = recentSignals.filter((s) => s.color === "red").length;
  const blackCount = recentSignals.filter((s) => s.color === "black").length;

  // Estratégia: apostar na cor que saiu menos (tendência de equalização)
  const betType = redCount > blackCount ? "black" : "red";
  const confidence = Math.min(Math.abs(redCount - blackCount) * 10 + 50, 95);

  // Valor sugerido: R$ 10,00 (1000 centavos)
  const suggestedAmount = 1000;

  // Inserir recomendação
  const [recommendation] = await db.insert(recommendations).values({
    signalId,
    betType,
    confidence,
    suggestedAmount,
    strategy: "color_balance",
    result: "pending",
  });

  return {
    id: recommendation.insertId,
    betType,
    confidence,
    suggestedAmount,
    strategy: "color_balance",
  };
}

/**
 * Função auxiliar para calcular sequência atual de vitórias/derrotas
 */
function calculateStreak(recommendations: any[]) {
  if (recommendations.length === 0) return 0;

  const sorted = recommendations.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let streak = 0;
  const firstResult = sorted[0]?.result;

  if (!firstResult || firstResult === "pending") return 0;

  for (const rec of sorted) {
    if (rec.result === firstResult) {
      streak++;
    } else {
      break;
    }
  }

  return firstResult === "win" ? streak : -streak;
}

