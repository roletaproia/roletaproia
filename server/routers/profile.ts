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
        name: z.string().optional(),
        email: z.string().optional(),
        avatarUrl: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log('[Profile Update] Input recebido:', JSON.stringify(input, null, 2));
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const updateData: Record<string, any> = {};

      if (input.name !== undefined) {
        updateData.name = input.name;
      }

      if (input.email !== undefined) {
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

      if (input.avatarUrl !== undefined) {
        // Converter string vazia, null ou whitespace para null
        const newAvatarUrl = (input.avatarUrl && input.avatarUrl.trim()) ? input.avatarUrl.trim() : null;
        
        // Se avatarUrl é diferente da atual, deletar a antiga
        if (newAvatarUrl !== ctx.user.avatarUrl && ctx.user.avatarUrl) {
          deleteAvatar(ctx.user.avatarUrl);
        }
        updateData.avatarUrl = newAvatarUrl;
      }

      // Sempre atualizar updatedAt, mesmo se nenhum campo mudou
      const dataToUpdate = Object.keys(updateData).length > 0 
        ? { ...updateData, updatedAt: new Date() }
        : { updatedAt: new Date() };

      await db
        .update(users)
        .set(dataToUpdate)
        .where(eq(users.id, ctx.user.id));

      // Buscar usuário atualizado
      const updatedUser = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      return updatedUser[0];
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

    await db
      .update(users)
      .set({
        avatarUrl: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, ctx.user.id));

    // Buscar usuário atualizado
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    return updatedUser[0];
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

