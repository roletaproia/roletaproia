import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@shared/const";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Obter token do cookie
    const token = opts.req.cookies[COOKIE_NAME];

    if (token) {
      // Verificar e decodificar JWT
      const { payload } = await jwtVerify(token, JWT_SECRET);

      if (payload.userId) {
        // Buscar usuário no banco
        const db = await getDb();
        if (db) {
          const [dbUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, payload.userId as number))
            .limit(1);

          if (dbUser) {
            user = dbUser;
          }
        }
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

