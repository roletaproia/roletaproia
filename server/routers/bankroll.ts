import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getOrCreateBankroll, updateBankroll, getUserBets } from "../db";

export const bankrollRouter = router({
  /**
   * Obtém ou cria a configuração de banca do usuário
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    return getOrCreateBankroll(ctx.user.id);
  }),

  /**
   * Atualiza a configuração de banca (saldo, limites, etc.)
   */
  update: protectedProcedure
    .input(
      z.object({
        currentBalance: z.number().optional(),
        totalWins: z.number().optional(),
        totalLosses: z.number().optional(),
        totalBets: z.number().optional(),
        winRate: z.string().optional(),
        stopLoss: z.number().optional(),
        stopWin: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return updateBankroll(ctx.user.id, input);
    }),

  /**
   * Obtém o histórico de apostas do usuário
   */
  getBetHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      return getUserBets(ctx.user.id, input.limit);
    }),

  /**
   * Simula uma aposta com base em uma estratégia
   * Retorna o resultado simulado (win/loss) e o novo saldo
   */
  simulateBet: protectedProcedure
    .input(
      z.object({
        betAmount: z.number().min(1),
        strategyType: z.enum(["fibonacci", "martingale", "custom"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const bankroll = await getOrCreateBankroll(ctx.user.id);

      // Simulação simples: 48.6% de chance de ganhar (padrão de roleta europeia)
      const result = Math.random() < 0.486 ? "win" : "loss";
      const payout = result === "win" ? input.betAmount * 2 : 0;
      const newBalance =
        result === "win"
          ? bankroll.currentBalance + payout
          : bankroll.currentBalance - input.betAmount;

      return {
        result,
        payout,
        newBalance,
        betAmount: input.betAmount,
      };
    }),
});

