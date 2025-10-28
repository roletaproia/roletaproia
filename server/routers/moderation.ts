import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { chatBans, chatWarnings, deletedMessages, bannedWords, chatRules, chatMessages } from "../../drizzle/schema.js";
import { eq, and, desc, gt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const moderationRouter = router({
  // Banir usuário do chat
  banUser: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        reason: z.string().min(5, "Motivo deve ter pelo menos 5 caracteres"),
        duration: z.number().optional(), // Duração em horas (null = permanente)
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Apenas admins podem banir
      if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem banir usuários",
        });
      }

      const db = getDb();
      const expiresAt = input.duration
        ? new Date(Date.now() + input.duration * 60 * 60 * 1000)
        : null;

      await db.insert(chatBans).values({
        userId: input.userId,
        bannedBy: ctx.user.id,
        reason: input.reason,
        expiresAt,
      });

      return { success: true, message: "Usuário banido com sucesso" };
    }),

  // Remover ban de usuário
  unbanUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem remover bans",
        });
      }

      const db = getDb();
      await db.delete(chatBans).where(eq(chatBans.userId, input.userId));

      return { success: true, message: "Ban removido com sucesso" };
    }),

  // Verificar se usuário está banido
  checkBan: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const bans = await db
      .select()
      .from(chatBans)
      .where(eq(chatBans.userId, ctx.user.id));

    if (bans.length === 0) {
      return { isBanned: false };
    }

    const activeBan = bans.find((ban) => {
      if (!ban.expiresAt) return true; // Ban permanente
      return new Date(ban.expiresAt) > new Date(); // Ban ainda ativo
    });

    if (!activeBan) {
      // Remover bans expirados
      await db.delete(chatBans).where(eq(chatBans.userId, ctx.user.id));
      return { isBanned: false };
    }

    return {
      isBanned: true,
      reason: activeBan.reason,
      expiresAt: activeBan.expiresAt,
    };
  }),

  // Listar usuários banidos
  listBans: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem ver a lista de bans",
      });
    }

    const db = getDb();
    const bans = await db
      .select()
      .from(chatBans)
      .orderBy(desc(chatBans.createdAt));

    return bans;
  }),

  // Dar aviso a usuário
  warnUser: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        reason: z.string().min(5, "Motivo deve ter pelo menos 5 caracteres"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem dar avisos",
        });
      }

      const db = getDb();
      await db.insert(chatWarnings).values({
        userId: input.userId,
        issuedBy: ctx.user.id,
        reason: input.reason,
      });

      return { success: true, message: "Aviso registrado com sucesso" };
    }),

  // Listar avisos de um usuário
  getUserWarnings: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem ver avisos",
        });
      }

      const db = getDb();
      const warnings = await db
        .select()
        .from(chatWarnings)
        .where(eq(chatWarnings.userId, input.userId))
        .orderBy(desc(chatWarnings.createdAt));

      return warnings;
    }),

  // Deletar mensagem
  deleteMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.number(),
        reason: z.string().min(5, "Motivo deve ter pelo menos 5 caracteres"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem deletar mensagens",
        });
      }

      const db = getDb();

      // Buscar mensagem original
      const [message] = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.id, input.messageId));

      if (!message) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mensagem não encontrada",
        });
      }

      // Salvar no log de mensagens deletadas
      await db.insert(deletedMessages).values({
        originalMessageId: message.id,
        userId: message.userId,
        message: message.message,
        deletedBy: ctx.user.id,
        reason: input.reason,
      });

      // Deletar mensagem original
      await db.delete(chatMessages).where(eq(chatMessages.id, input.messageId));

      return { success: true, message: "Mensagem deletada com sucesso" };
    }),

  // Listar mensagens deletadas (log)
  getDeletedMessages: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem ver mensagens deletadas",
      });
    }

    const db = getDb();
    const deleted = await db
      .select()
      .from(deletedMessages)
      .orderBy(desc(deletedMessages.createdAt))
      .limit(100);

    return deleted;
  }),

  // Adicionar palavra proibida
  addBannedWord: protectedProcedure
    .input(
      z.object({
        word: z.string().min(2, "Palavra deve ter pelo menos 2 caracteres"),
        severity: z.enum(["low", "medium", "high"]).default("medium"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem adicionar palavras proibidas",
        });
      }

      const db = getDb();
      await db.insert(bannedWords).values({
        word: input.word.toLowerCase(),
        severity: input.severity,
      });

      return { success: true, message: "Palavra adicionada à lista de proibidas" };
    }),

  // Remover palavra proibida
  removeBannedWord: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem remover palavras proibidas",
        });
      }

      const db = getDb();
      await db.delete(bannedWords).where(eq(bannedWords.id, input.id));

      return { success: true, message: "Palavra removida da lista" };
    }),

  // Listar palavras proibidas
  listBannedWords: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "sub-admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem ver palavras proibidas",
      });
    }

    const db = getDb();
    const words = await db.select().from(bannedWords);

    return words;
  }),

  // Criar regra do chat
  createRule: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
        description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem criar regras",
        });
      }

      const db = getDb();
      await db.insert(chatRules).values({
        name: input.name,
        description: input.description,
      });

      return { success: true, message: "Regra criada com sucesso" };
    }),

  // Listar regras do chat
  listRules: protectedProcedure.query(async () => {
    const db = getDb();
    const rules = await db
      .select()
      .from(chatRules)
      .where(eq(chatRules.isActive, 1));

    return rules;
  }),

  // Atualizar regra
  updateRule: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        isActive: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem atualizar regras",
        });
      }

      const db = getDb();
      const { id, ...updates } = input;

      await db.update(chatRules).set(updates).where(eq(chatRules.id, id));

      return { success: true, message: "Regra atualizada com sucesso" };
    }),

  // Deletar regra
  deleteRule: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem deletar regras",
        });
      }

      const db = getDb();
      await db.delete(chatRules).where(eq(chatRules.id, input.id));

      return { success: true, message: "Regra deletada com sucesso" };
    }),
});

