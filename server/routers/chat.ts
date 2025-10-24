import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createChatMessage, getChatMessages, deleteChatMessage } from "../db";

export const chatRouter = router({
  /**
   * Envia uma mensagem no chat
   */
  send: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1, "Mensagem não pode estar vazia").max(1000, "Mensagem muito longa"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createChatMessage(ctx.user.id, input.message, 0);
    }),

  /**
   * Obtém as últimas mensagens do chat com dados do usuário
   */
  getMessages: protectedProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input, ctx }) => {
      const messages = await getChatMessages(input.limit);
      // Reverter a ordem para mostrar as mensagens mais recentes no final
      return messages.map(msg => ({
        ...msg,
        isOwnMessage: msg.userId === ctx.user.id,
      })).reverse();
    }),

  /**
   * Deleta uma mensagem (apenas para admins ou o próprio usuário)
   */
  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Buscar a mensagem para verificar se pertence ao usuário ou se é admin
      const messages = await getChatMessages(1000);
      const message = messages.find(m => m.id === input.messageId);

      if (!message) {
        throw new Error("Mensagem não encontrada");
      }

      // Apenas o dono da mensagem ou admin pode deletar
      if (message.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Permissão negada");
      }

      return deleteChatMessage(input.messageId);
    }),

  /**
   * Envia uma mensagem de sistema (apenas para admins)
   */
  sendSystemMessage: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Apenas admins podem enviar mensagens de sistema
      if (ctx.user.role !== "admin") {
        throw new Error("Permissão negada");
      }

      return createChatMessage(ctx.user.id, input.message, 1);
    }),

  /**
   * Painel de moderação (apenas para admins)
   */
  getModerationPanel: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Permissão negada");
    }

    const messages = await getChatMessages(500);
    return messages;
  }),
});

