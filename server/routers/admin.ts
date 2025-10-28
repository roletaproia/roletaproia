import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const adminRouter = router({
  /**
   * Endpoint secreto para tornar usuário Admin
   * Usar apenas uma vez e depois remover!
   */
  /**
   * Criar usuário Admin diretamente
   */
  createAdminUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string(),
        secret: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const SECRET_KEY = "roletaproia2025admin";

      if (input.secret !== SECRET_KEY) {
        throw new Error("Senha secreta incorreta!");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verificar se já existe
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        // Se já existe, apenas atualiza para admin
        await db
          .update(users)
          .set({ role: "admin" })
          .where(eq(users.email, input.email));

        return {
          success: true,
          message: `✅ Usuário ${input.email} já existia e foi promovido a ADMIN!`,
          existed: true,
        };
      }

      // Criar novo usuário admin
      await db.insert(users).values({
        email: input.email,
        password: input.password, // Em produção deveria ser hasheado
        name: input.name,
        role: "admin",
      });

      const newUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      return {
        success: true,
        message: `✅ Usuário Admin ${input.email} criado com sucesso!`,
        user: {
          id: newUser[0].id,
          name: newUser[0].name,
          email: newUser[0].email,
          role: newUser[0].role,
        },
        existed: false,
      };
    }),

  makeAdmin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        secret: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Senha secreta
      const SECRET_KEY = "roletaproia2025admin";

      if (input.secret !== SECRET_KEY) {
        throw new Error("Senha secreta incorreta!");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Buscar usuário
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (!user.length) {
        throw new Error(`Usuário com email ${input.email} não encontrado!`);
      }

      // Atualizar para admin
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.email, input.email));

      // Buscar usuário atualizado
      const updatedUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      return {
        success: true,
        message: `✅ Usuário ${input.email} agora é ADMIN!`,
        user: {
          id: updatedUser[0].id,
          name: updatedUser[0].name,
          email: updatedUser[0].email,
          role: updatedUser[0].role,
        },
      };
    }),

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

