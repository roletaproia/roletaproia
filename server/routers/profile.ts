import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { deleteAvatar } from "../_core/fileUpload";

export const profileRouter = router({
  /**
   * Get current user profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user.length) {
      throw new Error("User not found");
    }

    return user[0];
  }),

  /**
   * Update user profile (name, email, avatar)
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100).optional(),
        email: z.string().email("Email inválido").optional(),
        avatarUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const updateData: Record<string, any> = {};

      if (input.name) {
        updateData.name = input.name;
      }

      if (input.email) {
        // Check if email is already taken by another user
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0 && existingUser[0].id !== ctx.user.id) {
          throw new Error("Email já está em uso");
        }

        updateData.email = input.email;
      }

      if (input.avatarUrl) {
        // Delete old avatar if exists
        if (ctx.user.avatarUrl) {
          deleteAvatar(ctx.user.avatarUrl);
        }
        updateData.avatarUrl = input.avatarUrl;
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error("Nenhum campo para atualizar");
      }

      const result = await db
        .update(users)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return result[0];
    }),

  /**
   * Delete user avatar
   */
  deleteAvatar: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    if (ctx.user.avatarUrl) {
      deleteAvatar(ctx.user.avatarUrl);
    }

    const result = await db
      .update(users)
      .set({
        avatarUrl: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, ctx.user.id))
      .returning();

    return result[0];
  }),

  /**
   * Get user statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    // This can be extended to return user-specific statistics
    // For now, just return basic user info
    return {
      userId: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      role: ctx.user.role,
      createdAt: ctx.user.createdAt,
    };
  }),
});

