import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createChatMessage, getChatMessages, deleteChatMessage } from "../db";
import { getDb } from "../db";
import { chatBans, bannedWords } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Verifica se a mensagem contém links
 */
function containsLink(message: string): boolean {
  // Regex melhorado para detectar URLs, domínios e links
  const patterns = [
    /https?:\/\/[^\s]+/gi,                    // http:// ou https://
    /www\.[a-zA-Z0-9][a-zA-Z0-9-]+[^\s]*/gi,  // www.exemplo.com
    /[a-zA-Z0-9][a-zA-Z0-9-]*\.(com|net|org|br|io|co|uk|me|info|biz|tv|app|dev|tech|site|online|store|blog|xyz|top|live|bet|casino|vip|pro|club|link|click)[a-zA-Z0-9\/.\-_]*/gi,  // dominio.com.br
    /[a-zA-Z0-9]+\.(com|net|org|br)\/[^\s]*/gi // exemplo.com/path
  ];
  
  return patterns.some(pattern => pattern.test(message));
}

/**
 * Verifica se a mensagem contém palavras proibidas
 */
async function containsBannedWords(message: string): Promise<{ contains: boolean; word?: string; severity?: string }> {
  const db = getDb();
  const words = await db.select().from(bannedWords);
  
  const messageLower = message.toLowerCase();
  
  for (const bannedWord of words) {
    if (messageLower.includes(bannedWord.word.toLowerCase())) {
      return {
        contains: true,
        word: bannedWord.word,
        severity: bannedWord.severity,
      };
    }
  }
  
  return { contains: false };
}

/**
 * Verifica se o usuário está banido
 */
async function isUserBanned(userId: number): Promise<{ isBanned: boolean; reason?: string; expiresAt?: Date | null }> {
  const db = getDb();
  const bans = await db
    .select()
    .from(chatBans)
    .where(eq(chatBans.userId, userId));

  if (bans.length === 0) {
    return { isBanned: false };
  }

  const activeBan = bans.find((ban) => {
    if (!ban.expiresAt) return true; // Ban permanente
    return new Date(ban.expiresAt) > new Date(); // Ban ainda ativo
  });

  if (!activeBan) {
    // Remover bans expirados
    await db.delete(chatBans).where(eq(chatBans.userId, userId));
    return { isBanned: false };
  }

  return {
    isBanned: true,
    reason: activeBan.reason,
    expiresAt: activeBan.expiresAt,
  };
}

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
      // Verificar se usuário está banido
      const banStatus = await isUserBanned(ctx.user.id);
      if (banStatus.isBanned) {
        const expiresText = banStatus.expiresAt 
          ? `até ${new Date(banStatus.expiresAt).toLocaleString('pt-BR')}`
          : "permanentemente";
        
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Você está banido do chat ${expiresText}. Motivo: ${banStatus.reason}`,
        });
      }

      // Verificar se contém links
      if (containsLink(input.message)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Não é permitido enviar links no chat. Entre em contato com um administrador se precisar compartilhar algo.",
        });
      }

      // Verificar palavras proibidas
      const bannedCheck = await containsBannedWords(input.message);
      if (bannedCheck.contains) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Sua mensagem contém conteúdo proibido e não pode ser enviada. Mantenha o respeito na comunidade.`,
        });
      }

      // Verificar spam (mensagens muito curtas repetidas)
      const recentMessages = await getChatMessages(10);
      const userRecentMessages = recentMessages.filter(m => m.userId === ctx.user.id);
      
      if (userRecentMessages.length >= 3) {
        const lastThree = userRecentMessages.slice(0, 3);
        const allSame = lastThree.every(m => m.message === input.message);
        
        if (allSame) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Não envie a mesma mensagem repetidamente. Isso é considerado spam.",
          });
        }
      }

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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mensagem não encontrada",
        });
      }

      // Apenas o dono da mensagem ou admin pode deletar
      if (message.userId !== ctx.user.id && ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Permissão negada",
        });
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
      if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Permissão negada",
        });
      }

      return createChatMessage(ctx.user.id, input.message, 1);
    }),

  /**
   * Painel de moderação (apenas para admins)
   */
  getModerationPanel: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Permissão negada",
      });
    }

    const messages = await getChatMessages(500);
    return messages;
  }),
});

