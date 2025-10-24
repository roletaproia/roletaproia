import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createBet, getUserBets, getOrCreateBankroll, updateBankroll, getUserStrategies } from "../db";
import { StrategyEngine } from "../_core/strategyEngine";

export const betsRouter = router({
  /**
   * Cria uma nova aposta e atualiza o saldo da banca
   */
  create: protectedProcedure
    .input(
      z.object({
        betAmount: z.number().min(1),
        result: z.enum(["win", "loss", "pending"]),
        payout: z.number().optional(),
        strategyId: z.number().optional(),
        rouletteNumber: z.number().min(0).max(36).optional(),
        betType: z.string().optional(),
        isAutomatic: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const bankroll = await getOrCreateBankroll(ctx.user.id);

      // Validar se o usuário tem saldo suficiente
      if (bankroll.currentBalance < input.betAmount) {
        throw new Error("Saldo insuficiente para realizar esta aposta");
      }

      // Criar a aposta
      await createBet(
        ctx.user.id,
        input.betAmount,
        input.result,
        input.payout,
        input.strategyId,
        input.rouletteNumber,
        input.betType,
        input.isAutomatic
      );

      // Atualizar o saldo da banca
      const newBalance =
        input.result === "win"
          ? bankroll.currentBalance + (input.payout || 0)
          : bankroll.currentBalance - input.betAmount;

      const totalWins =
        input.result === "win"
          ? bankroll.totalWins + (input.payout || 0)
          : bankroll.totalWins;

      const totalLosses =
        input.result === "loss"
          ? bankroll.totalLosses + input.betAmount
          : bankroll.totalLosses;

      const totalBets = bankroll.totalBets + 1;
      const winRate = totalBets > 0 ? ((totalWins / totalBets) * 100).toFixed(2) : "0";

      await updateBankroll(ctx.user.id, {
        currentBalance: newBalance,
        totalWins,
        totalLosses,
        totalBets,
        winRate,
      });

      return {
        success: true,
        newBalance,
        totalBets,
        winRate,
      };
    }),

  /**
   * Obtém o histórico de apostas do usuário
   */
  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      return getUserBets(ctx.user.id, input.limit);
    }),

  /**
   * Simula uma roleta e retorna um número aleatório
   */
  spinRoulette: protectedProcedure.mutation(async () => {
    const rouletteNumber = Math.floor(Math.random() * 37); // 0-36
    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(rouletteNumber);
    const isEven = rouletteNumber % 2 === 0 && rouletteNumber !== 0;

    return {
      number: rouletteNumber,
      color: rouletteNumber === 0 ? "green" : isRed ? "red" : "black",
      isEven,
      isOdd: !isEven && rouletteNumber !== 0,
    };
  }),

  /**
   * Calcula a próxima aposta usando uma estratégia
   */
  getNextBetAmount: protectedProcedure
    .input(
      z.object({
        strategyId: z.number(),
        lastResult: z.enum(["win", "loss"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const strategies = await getUserStrategies(ctx.user.id);
      const strategy = strategies.find((s) => s.id === input.strategyId);

      if (!strategy) {
        throw new Error("Estratégia não encontrada");
      }

      const engine = new StrategyEngine(
        strategy.type as any,
        strategy.baseBetAmount,
        strategy.config
      );

      const nextBet = engine.getNextBet(input.lastResult);

      return {
        nextBetAmount: nextBet,
        strategyName: strategy.name,
        strategyType: strategy.type,
      };
    }),

  /**
   * Simula uma série de apostas com uma estratégia
   */
  simulateStrategy: protectedProcedure
    .input(
      z.object({
        strategyId: z.number(),
        results: z.array(z.enum(["win", "loss"])),
      })
    )
    .query(async ({ ctx, input }) => {
      const strategies = await getUserStrategies(ctx.user.id);
      const strategy = strategies.find((s) => s.id === input.strategyId);

      if (!strategy) {
        throw new Error("Estratégia não encontrada");
      }

      const engine = new StrategyEngine(
        strategy.type as any,
        strategy.baseBetAmount,
        strategy.config
      );

      const betSequence = [];
      for (const result of input.results) {
        const bet = engine.getNextBet(result);
        betSequence.push({
          result,
          betAmount: bet,
        });
      }

      const finalState = engine.getState();

      return {
        strategyName: strategy.name,
        strategyType: strategy.type,
        betSequence,
        finalState: {
          currentBet: finalState.currentBet,
          losses: finalState.losses,
          wins: finalState.wins,
          totalProfit: finalState.totalProfit,
        },
      };
    }),
});

