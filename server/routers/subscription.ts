import { z } from "zod";
import { protectedProcedure, router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { subscriptions, users, blockedIps } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const subscriptionRouter = router({
  /**
   * Obtém informações da assinatura do usuário
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription) {
      // Criar acesso gratuito ilimitado se não existir
      await db.insert(subscriptions).values({
        userId: ctx.user.id,
        plan: "free",
        status: "active",
        trialEndsAt: null,
        registrationIp: ctx.req.ip || ctx.req.socket.remoteAddress,
      });

      const [newSubscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      return newSubscription;
    }

    return subscription;
  }),

  /**
   * Verifica se o usuário tem acesso ativo
   * AGORA: Todos os usuários têm acesso gratuito ilimitado
   */
  checkAccess: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Admins têm acesso ilimitado
    if (ctx.user.role === "admin") {
      return {
        hasAccess: true,
        plan: "unlimited",
        badge: "Administrador",
      };
    }

    // Todos os usuários têm acesso gratuito ilimitado
    return {
      hasAccess: true,
      plan: "free",
      badge: "100% Gratuito",
    };
  }),

  /**
   * Admin: Adicionar dias extras para um usuário
   * MANTIDO APENAS PARA COMPATIBILIDADE COM CÓDIGO EXISTENTE
   */
  addExtraDays: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        days: z.number().min(1).max(365),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, input.userId))
        .limit(1);

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      await db
        .update(subscriptions)
        .set({ extraDays: subscription.extraDays + input.days })
        .where(eq(subscriptions.userId, input.userId));

      return { success: true, totalExtraDays: subscription.extraDays + input.days };
    }),

  /**
   * Admin: Converter usuário para premium
   * MANTIDO APENAS PARA COMPATIBILIDADE COM CÓDIGO EXISTENTE
   */
  convertToPremium: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        plan: z.enum(["monthly", "quarterly", "annual"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const now = new Date();
      let subscriptionEndsAt = new Date();

      switch (input.plan) {
        case "monthly":
          subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 1);
          break;
        case "quarterly":
          subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 3);
          break;
        case "annual":
          subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 1);
          break;
      }

      await db
        .update(subscriptions)
        .set({
          plan: input.plan,
          status: "active",
          subscriptionEndsAt,
        })
        .where(eq(subscriptions.userId, input.userId));

      return { success: true, subscriptionEndsAt };
    }),
});
