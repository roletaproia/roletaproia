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

    // Verificar se já tem código
    const [existing] = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, ctx.user.id))
      .limit(1);

    if (existing) {
      const referralLink = `${process.env.APP_URL || 'https://roletaproia.onrender.com'}/register?ref=${existing.referralCode}`;
      return {
        code: existing.referralCode,
        link: referralLink,
      };
    }

    // Gerar novo código único
    const code = randomBytes(8).toString('hex');
    const referralLink = `${process.env.APP_URL || 'https://roletaproia.onrender.com'}/register?ref=${code}`;

    // Salvar no banco (sem referredId ainda)
    await db.insert(referrals).values({
      referrerId: ctx.user.id,
      referredId: ctx.user.id, // Temporário, será atualizado quando alguém usar o código
      referralCode: code,
    });

    return {
      code,
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

    // Filtrar referrals válidos (excluir o temporário)
    const validReferrals = myReferrals.filter(r => r.referredId !== ctx.user.id);

    const totalBonusDays = validReferrals.reduce((sum, r) => sum + r.bonusDaysGranted, 0);

    return {
      referrals: validReferrals,
      totalReferrals: validReferrals.length,
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
      const [referral] = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, input.referralCode))
        .limit(1);

      if (!referral) {
        throw new Error("Código de indicação inválido");
      }

      // Criar novo registro de referral
      await db.insert(referrals).values({
        referrerId: referral.referrerId,
        referredId: input.newUserId,
        referralCode: input.referralCode,
        bonusDaysGranted: 7,
      });

      // Adicionar 7 dias extras ao referrer
      const [referrerSub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, referral.referrerId))
        .limit(1);

      if (referrerSub) {
        await db
          .update(subscriptions)
          .set({ extraDays: referrerSub.extraDays + 7 })
          .where(eq(subscriptions.userId, referral.referrerId));
      }

      return { success: true, bonusDaysGranted: 7 };
    }),
});

