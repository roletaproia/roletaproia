import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createStrategy, deleteStrategy, getUserStrategies, updateStrategy } from "../db";
import { StrategyTypeSchema } from "../../shared/strategyTypes";

export const strategiesRouter = router({
  /**
   * Lista todas as estratégias do usuário autenticado
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    return getUserStrategies(ctx.user.id);
  }),

  /**
   * Cria uma nova estratégia
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        type: StrategyTypeSchema,
        baseBetAmount: z.number().min(1, "Valor mínimo de 1 centavo"),
        config: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createStrategy(
        ctx.user.id,
        input.name,
        input.type,
        input.baseBetAmount,
        input.config
      );
    }),

  /**
   * Atualiza uma estratégia existente
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        type: StrategyTypeSchema.optional(),
        baseBetAmount: z.number().optional(),
        isActive: z.number().optional(),
        config: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return updateStrategy(id, data);
    }),

  /**
   * Deleta uma estratégia
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteStrategy(input.id);
    }),
});

