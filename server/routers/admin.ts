import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const adminRouter = router({
  /**
   * Lista todos os usuários (apenas para admins)
   */
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Permissão negada");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return db.select().from(users);
  }),

  /**
   * Promove um usuário a sub-admin (apenas admin pode fazer isso)
   */
  promoteToSubAdmin: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Apenas admins podem promover sub-admins");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Não permitir que um admin seja promovido novamente
      const user = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (user.length === 0) {
        throw new Error("Usuário não encontrado");
      }

      if (user[0].role === "admin" || user[0].role === "sub-admin") {
        throw new Error("Usuário já é admin ou sub-admin");
      }

      await db.update(users).set({ role: "sub-admin" }).where(eq(users.id, input.userId));

      return { success: true, message: "Usuário promovido a sub-admin com sucesso" };
    }),

  /**
   * Remove permissão de admin/sub-admin de um usuário (apenas admin pode fazer isso)
   */
  demoteFromAdmin: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Apenas admins podem remover permissões de admin");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Não permitir que o próprio admin se remova
      if (ctx.user.id === input.userId) {
        throw new Error("Você não pode remover suas próprias permissões de admin");
      }

      const user = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (user.length === 0) {
        throw new Error("Usuário não encontrado");
      }

      if (user[0].role === "user") {
        throw new Error("Usuário não é admin ou sub-admin");
      }

      await db.update(users).set({ role: "user" }).where(eq(users.id, input.userId));

      return { success: true, message: "Permissões de admin removidas com sucesso" };
    }),

  /**
   * Obtém estatísticas do sistema (apenas para admins)
   */
  getSystemStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Permissão negada");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allUsers = await db.select().from(users);
    const adminCount = allUsers.filter(u => u.role === "admin").length;
    const userCount = allUsers.length - adminCount;

    return {
      totalUsers: allUsers.length,
      adminCount,
      userCount,
      lastUpdated: new Date(),
    };
  }),
});

