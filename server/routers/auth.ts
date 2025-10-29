import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, blockedIps, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export const authRouter = router({
  /**
   * Registro de novo usuário
   */
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Obter IP do usuário
      const userIp = ctx.req.ip || ctx.req.socket.remoteAddress || 'unknown';

      // Verificar se o IP já foi usado para criar trial
      const [existingIp] = await db
        .select()
        .from(blockedIps)
        .where(eq(blockedIps.ipAddress, userIp))
        .limit(1);

      if (existingIp) {
        throw new Error("Este IP já foi usado para criar uma conta de teste. Entre em contato com o suporte se precisar de ajuda.");
      }

      // Verificar se o email já existe
      
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error("Email já cadastrado");
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Criar usuário
      const [newUser] = await db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: "user",
        })
        .$returningId();

      // Registrar IP como usado
      await db.insert(blockedIps).values({
        ipAddress: userIp,
        userId: newUser.id,
      });

      // Criar subscription com trial de 7 dias
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      await db.insert(subscriptions).values({
        userId: newUser.id,
        plan: "trial",
        status: "active",
        trialEndsAt,
        registrationIp: userIp,
      });

      // Gerar JWT token
      const token = await new SignJWT({
          userId: newUser.id,
          email: input.email,
        })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

      // Definir cookie
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

      return {
        success: true,
        message: "Usuário registrado com sucesso",
      };
    }),

  /**
   * Login de usuário
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(1, "Senha é obrigatória"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Buscar usuário pelo email
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (!user) {
        throw new Error("Email ou senha incorretos");
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(input.password, user.password);

      if (!isPasswordValid) {
        throw new Error("Email ou senha incorretos");
      }

      // Atualizar último login
      await db
        .update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.id, user.id));

      // Gerar JWT token
      const token = await new SignJWT({
          userId: user.id,
          email: user.email,
        })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

      // Definir cookie
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

      return {
        success: true,
        message: "Login realizado com sucesso",
      };
    }),

  /**
   * Obter usuário atual
   */
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  /**
   * Logout
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    } as const;
  }),

  /**
   * Alterar senha
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Senha atual é obrigatória"),
        newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Buscar usuário
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Verificar senha atual
      const isPasswordValid = await bcrypt.compare(input.currentPassword, user.password);

      if (!isPasswordValid) {
        throw new Error("Senha atual incorreta");
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      // Atualizar senha
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, ctx.user.id));

      return {
        success: true,
        message: "Senha alterada com sucesso",
      };
    }),
});

