import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createBet, getOrCreateBankroll, updateBankroll, getUserStrategies, getUserBets } from "../db";
import { StrategyEngine } from "../_core/strategyEngine";
import type { StrategyType } from "../../shared/strategyTypes";

/**
 * Router do Robô de Apostas Automático
 * Integrado com estratégias, gerenciamento de banca e sistema de apostas
 */

// Estado das estratégias por usuário (em memória)
const strategyStates = new Map<string, StrategyEngine>();

/**
 * Obtém ou cria engine de estratégia para um usuário
 */
function getStrategyEngine(userId: number, strategyId: number, strategyType: string, baseBet: number, config: string | null): StrategyEngine {
  const key = `${userId}-${strategyId}`;
  
  if (!strategyStates.has(key)) {
    const engine = new StrategyEngine(
      strategyType as StrategyType,
      baseBet,
      config || undefined
    );
    strategyStates.set(key, engine);
  }
  
  return strategyStates.get(key)!;
}

/**
 * Reseta engine de estratégia
 */
function resetStrategyEngine(userId: number, strategyId: number): void {
  const key = `${userId}-${strategyId}`;
  strategyStates.delete(key);
}

export const robotRouter = router({
  /**
   * Processa um novo número da roleta e executa aposta automática
   */
  processNumber: protectedProcedure
    .input(
      z.object({
        number: z.number().min(0).max(36),
        strategyId: z.number(),
        config: z.object({
          initialBet: z.number().min(1), // em centavos
          stopLoss: z.number().optional(), // em reais
          stopWin: z.number().optional(), // em reais
          betType: z.enum(["number", "color", "even_odd", "dozen", "column"]).optional().default("color"),
          betValue: z.string().optional(), // "red", "black", "even", "odd", etc
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        // 1. Buscar estratégia
        const strategies = await getUserStrategies(userId);
        const strategy = strategies.find((s) => s.id === input.strategyId);

        if (!strategy) {
          throw new Error("Estratégia não encontrada");
        }

        if (!strategy.isActive) {
          throw new Error("Estratégia está inativa");
        }

        // 2. Verificar saldo
        const bankroll = await getOrCreateBankroll(userId);
        
        if (bankroll.currentBalance < input.config.initialBet) {
          return {
            success: false,
            error: "Saldo insuficiente",
            shouldStop: true,
            reason: "insufficient_balance",
          };
        }

        // 3. Verificar Stop Loss
        const currentBalanceInReais = bankroll.currentBalance / 100;
        if (input.config.stopLoss && currentBalanceInReais <= input.config.stopLoss) {
          return {
            success: false,
            error: `Stop Loss atingido (R$ ${currentBalanceInReais.toFixed(2)})`,
            shouldStop: true,
            reason: "stop_loss",
          };
        }

        // 4. Verificar Stop Win
        if (input.config.stopWin && currentBalanceInReais >= input.config.stopWin) {
          return {
            success: false,
            error: `Stop Win atingido (R$ ${currentBalanceInReais.toFixed(2)})`,
            shouldStop: true,
            reason: "stop_win",
          };
        }

        // 5. Obter engine da estratégia
        const engine = getStrategyEngine(
          userId,
          input.strategyId,
          strategy.type,
          strategy.baseBetAmount,
          strategy.config
        );

        // 6. Calcular valor da aposta baseado na estratégia
        const betAmount = engine.getNextBet();

        // Verificar se o valor da aposta não excede o saldo
        if (betAmount > bankroll.currentBalance) {
          return {
            success: false,
            error: "Valor da aposta excede saldo disponível",
            shouldStop: true,
            reason: "bet_exceeds_balance",
          };
        }

        // 7. Determinar resultado da aposta
        const result = determineResult(input.number, input.config.betType, input.config.betValue);
        const multiplier = getMultiplier(input.config.betType, result);
        const payout = result === "win" ? betAmount * multiplier : 0;

        // 8. Registrar resultado na estratégia
        engine.recordResult(result);

        // 9. Registrar aposta no banco de dados
        await createBet(
          userId,
          betAmount,
          result,
          payout,
          input.strategyId,
          input.number,
          `${input.config.betType}:${input.config.betValue || "auto"}`,
          1 // isAutomatic
        );

        // 10. Atualizar saldo da banca
        const newBalance = bankroll.currentBalance - betAmount + payout;
        await updateBankroll(userId, {
          currentBalance: newBalance,
        });

        // 11. Calcular estatísticas
        const profit = payout - betAmount;
        const profitPercentage = (profit / betAmount) * 100;

        return {
          success: true,
          betAmount,
          result,
          payout,
          profit,
          profitPercentage,
          newBalance,
          nextBet: engine.getNextBet(), // Próxima aposta sugerida
          shouldStop: false,
          strategyState: engine.getState(),
        };

      } catch (error: any) {
        console.error("[Robot] Erro ao processar número:", error);
        return {
          success: false,
          error: error.message || "Erro desconhecido",
          shouldStop: true,
          reason: "error",
        };
      }
    }),

  /**
   * Obtém estatísticas do robô
   */
  getStats: protectedProcedure
    .input(
      z.object({
        strategyId: z.number().optional(),
        limit: z.number().optional().default(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Buscar apostas do usuário
      const bets = await getUserBets(userId, input.limit);

      // Filtrar por estratégia se especificado
      const filteredBets = input.strategyId
        ? bets.filter((b) => b.strategyId === input.strategyId && b.isAutomatic === 1)
        : bets.filter((b) => b.isAutomatic === 1);

      if (filteredBets.length === 0) {
        return {
          totalBets: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          totalProfit: 0,
          totalWagered: 0,
          averageBet: 0,
          biggestWin: 0,
          biggestLoss: 0,
        };
      }

      // Calcular estatísticas
      const wins = filteredBets.filter((b) => b.result === "win").length;
      const losses = filteredBets.filter((b) => b.result === "loss").length;
      const totalWagered = filteredBets.reduce((sum, b) => sum + b.betAmount, 0);
      const totalPayout = filteredBets.reduce((sum, b) => sum + (b.payout || 0), 0);
      const totalProfit = totalPayout - totalWagered;

      const winningBets = filteredBets.filter((b) => b.result === "win");
      const losingBets = filteredBets.filter((b) => b.result === "loss");

      const biggestWin = winningBets.length > 0
        ? Math.max(...winningBets.map((b) => (b.payout || 0) - b.betAmount))
        : 0;

      const biggestLoss = losingBets.length > 0
        ? Math.max(...losingBets.map((b) => b.betAmount))
        : 0;

      return {
        totalBets: filteredBets.length,
        wins,
        losses,
        winRate: (wins / filteredBets.length) * 100,
        totalProfit,
        totalWagered,
        averageBet: totalWagered / filteredBets.length,
        biggestWin,
        biggestLoss,
      };
    }),

  /**
   * Reseta estado da estratégia
   */
  resetStrategy: protectedProcedure
    .input(
      z.object({
        strategyId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      resetStrategyEngine(userId, input.strategyId);

      return {
        success: true,
        message: "Estratégia resetada com sucesso",
      };
    }),

  /**
   * Obtém estado atual da estratégia
   */
  getStrategyState: protectedProcedure
    .input(
      z.object({
        strategyId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const strategies = await getUserStrategies(userId);
      const strategy = strategies.find((s) => s.id === input.strategyId);

      if (!strategy) {
        throw new Error("Estratégia não encontrada");
      }

      const engine = getStrategyEngine(
        userId,
        input.strategyId,
        strategy.type,
        strategy.baseBetAmount,
        strategy.config
      );

      return {
        strategyId: input.strategyId,
        strategyName: strategy.name,
        strategyType: strategy.type,
        state: engine.getState(),
        nextBet: engine.getNextBet(),
      };
    }),
});

/**
 * Determina o resultado da aposta baseado no número e tipo de aposta
 */
function determineResult(number: number, betType: string, betValue?: string): "win" | "loss" {
  // Cores da roleta
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  switch (betType) {
    case "color":
      if (number === 0) return "loss"; // Zero não é vermelho nem preto
      if (betValue === "red") return redNumbers.includes(number) ? "win" : "loss";
      if (betValue === "black") return blackNumbers.includes(number) ? "win" : "loss";
      return "loss";

    case "even_odd":
      if (number === 0) return "loss";
      if (betValue === "even") return number % 2 === 0 ? "win" : "loss";
      if (betValue === "odd") return number % 2 !== 0 ? "win" : "loss";
      return "loss";

    case "dozen":
      if (betValue === "1st") return number >= 1 && number <= 12 ? "win" : "loss";
      if (betValue === "2nd") return number >= 13 && number <= 24 ? "win" : "loss";
      if (betValue === "3rd") return number >= 25 && number <= 36 ? "win" : "loss";
      return "loss";

    case "number":
      return number.toString() === betValue ? "win" : "loss";

    default:
      return "loss";
  }
}

/**
 * Retorna o multiplicador baseado no tipo de aposta
 */
function getMultiplier(betType: string, result: "win" | "loss"): number {
  if (result === "loss") return 0;

  switch (betType) {
    case "number":
      return 36; // Aposta em número paga 35:1 (retorna 36x)
    case "color":
    case "even_odd":
      return 2; // Apostas simples pagam 1:1 (retorna 2x)
    case "dozen":
    case "column":
      return 3; // Dúzias e colunas pagam 2:1 (retorna 3x)
    default:
      return 2;
  }
}

