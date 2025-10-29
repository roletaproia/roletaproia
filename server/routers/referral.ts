import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { referrals, users, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export const referralRouter = router({
  /**
   * Gera ou obtém o código de indicação do usuário
   */
  getMyReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Buscar usuário com código de referral
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Se não tem código, criar um
    let referralCode = user.referralCode;
    if (!referralCode) {
      referralCode = randomBytes(6).toString('hex'); // 12 caracteres
      
      await db
        .update(users)
        .set({ referralCode })
        .where(eq(users.id, ctx.user.id));
    }

    const referralLink = `${process.env.APP_URL || 'https://roletaproia.onrender.com'}/register?ref=${referralCode}`;

    return {
      code: referralCode,
      link: referralLink,
    };
  }),

  /**
   * Lista usuários indicados pelo usuário atual
   */
  getMyReferrals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const myReferrals = await db
      .select({
        id: referrals.id,
        referredId: referrals.referredId,
        bonusDaysGranted: referrals.bonusDaysGranted,
        createdAt: referrals.createdAt,
        referredName: users.name,
        referredEmail: users.email,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.referredId, users.id))
      .where(eq(referrals.referrerId, ctx.user.id));

    const totalBonusDays = myReferrals.reduce((sum, r) => sum + r.bonusDaysGranted, 0);

    return {
      referrals: myReferrals,
      totalReferrals: myReferrals.length,
      totalBonusDays,
    };
  }),

  /**
   * Valida e aplica código de indicação durante o registro
   * (Chamado internamente pelo authRouter)
   */
  applyReferralCode: protectedProcedure
    .input(
      z.object({
        referralCode: z.string(),
        newUserId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Buscar o referrer pelo código
      const [referrer] = await db
        .select()
        .from(users)
        .where(eq(users.referralCode, input.referralCode))
        .limit(1);

      if (!referrer) {
        throw new Error("Código de indicação inválido");
      }

      // Não pode indicar a si mesmo
      if (referrer.id === input.newUserId) {
        throw new Error("Você não pode usar seu próprio código de indicação");
      }

      // Verificar se já existe referral para este usuário
      const [existingReferral] = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referredId, input.newUserId))
        .limit(1);

      if (existingReferral) {
        throw new Error("Este usuário já foi indicado por alguém");
      }

      // Criar registro de referral
      await db.insert(referrals).values({
        referrerId: referrer.id,
        referredId: input.newUserId,
        bonusDaysGranted: 7,
      });

      // Adicionar 7 dias extras ao referrer
      const [referrerSub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, referrer.id))
        .limit(1);

      if (referrerSub) {
        await db
          .update(subscriptions)
          .set({ extraDays: referrerSub.extraDays + 7 })
          .where(eq(subscriptions.userId, referrer.id));
      }

      return { 
        success: true, 
        bonusDaysGranted: 7,
        referrerName: referrer.name,
      };
    }),
});

