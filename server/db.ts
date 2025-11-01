import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, strategies, InsertStrategy, bankrolls, InsertBankroll, bets, InsertBet, chatMessages, InsertChatMessage } from "./_core/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Gerenciamento de Estratégias
 */
export async function getUserStrategies(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(strategies).where(eq(strategies.userId, userId));
}

export async function createStrategy(userId: number, name: string, type: string, baseBetAmount: number, config?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(strategies).values({
    userId,
    name,
    type,
    baseBetAmount,
    config,
  });
  
  return result;
}

export async function updateStrategy(strategyId: number, data: Partial<InsertStrategy>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(strategies).set(data).where(eq(strategies.id, strategyId));
}

export async function deleteStrategy(strategyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(strategies).where(eq(strategies.id, strategyId));
}

/**
 * Gerenciamento de Banca
 */
export async function getOrCreateBankroll(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(bankrolls).where(eq(bankrolls.userId, userId)).limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  // Criar nova banca com saldo inicial de R$ 0,00
  await db.insert(bankrolls).values({
    userId,
    initialBalance: 0,
    currentBalance: 0,
  });
  
  const created = await db.select().from(bankrolls).where(eq(bankrolls.userId, userId)).limit(1);
  return created[0];
}

export async function updateBankroll(userId: number, data: Partial<InsertBankroll>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(bankrolls).set(data).where(eq(bankrolls.userId, userId));
}

/**
 * Gerenciamento de Apostas
 */
export async function createBet(userId: number, betAmount: number, result: string, payout?: number, strategyId?: number, rouletteNumber?: number, betType?: string, isAutomatic?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(bets).values({
    userId,
    betAmount,
    result,
    payout,
    strategyId,
    rouletteNumber,
    betType,
    isAutomatic: isAutomatic ?? 0,
  });
}

export async function getUserBets(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(bets).where(eq(bets.userId, userId)).orderBy(desc(bets.createdAt)).limit(limit);
}

/**
 * Gerenciamento de Chat
 */
export async function createChatMessage(userId: number, message: string, isSystemMessage: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(chatMessages).values({
    userId,
    message,
    isSystemMessage,
  });
}

export async function getChatMessages(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  
  // JOIN com users para trazer nome e role
  const messages = await db
    .select({
      id: chatMessages.id,
      userId: chatMessages.userId,
      message: chatMessages.message,
      isSystemMessage: chatMessages.isSystemMessage,
      createdAt: chatMessages.createdAt,
      userName: users.name,
      userRole: users.role,
    })
    .from(chatMessages)
    .leftJoin(users, eq(chatMessages.userId, users.id))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
  
  return messages;
}

export async function deleteChatMessage(messageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(chatMessages).where(eq(chatMessages.id, messageId));
}


