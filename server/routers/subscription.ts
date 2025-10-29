import { z } from "zod";
import { protectedProcedure, router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { subscriptions, users, referrals, blockedIps } from "../../drizzle/schema";
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
      // Criar trial automático se não existir
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7 dias de trial

      await db.insert(subscriptions).values({
        userId: ctx.user.id,
        plan: "trial",
        status: "active",
        trialEndsAt,
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

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription) {
      return { hasAccess: false, reason: "no_subscription" };
    }

    const now = new Date();

    // Verificar trial
    if (subscription.plan === "trial") {
      if (!subscription.trialEndsAt) {
        return { hasAccess: false, reason: "invalid_trial" };
      }

      const trialEnd = new Date(subscription.trialEndsAt);
      // Adicionar dias extras
      trialEnd.setDate(trialEnd.getDate() + subscription.extraDays);

      if (now > trialEnd) {
        // Trial expirado
        await db
          .update(subscriptions)
          .set({ status: "expired" })
          .where(eq(subscriptions.userId, ctx.user.id));

        return { hasAccess: false, reason: "trial_expired", daysRemaining: 0 };
      }

      const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        hasAccess: true,
        plan: "trial",
        daysRemaining,
        badge: "Usuário Teste",
      };
    }

    // Verificar assinatura paga
    if (subscription.subscriptionEndsAt) {
      const subEnd = new Date(subscription.subscriptionEndsAt);
      if (now > subEnd) {
        await db
          .update(subscriptions)
          .set({ status: "expired" })
          .where(eq(subscriptions.userId, ctx.user.id));

        return { hasAccess: false, reason: "subscription_expired" };
      }

      const daysRemaining = Math.ceil((subEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        hasAccess: true,
        plan: subscription.plan,
        daysRemaining,
        badge: "Usuário Premium",
      };
    }

    return { hasAccess: false, reason: "unknown" };
  }),

  /**
   * Admin: Adicionar dias extras para um usuário
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

