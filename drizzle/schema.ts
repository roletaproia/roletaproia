import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Sistema de autenticação com email e senha.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // Hash da senha (bcrypt)
  avatarUrl: text("avatarUrl"), // URL do avatar/foto de perfil
  role: mysqlEnum("role", ["user", "sub-admin", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de Estratégias de Apostas
 * Armazena as estratégias configuradas pelos usuários (Fibonacci, Martingale, etc.)
 */
export const strategies = mysqlTable("strategies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 64 }).notNull(), // 'fibonacci', 'martingale', 'custom', etc.
  description: text("description"),
  baseBetAmount: int("baseBetAmount").notNull().default(10), // Aposta base em centavos
  isActive: int("isActive").notNull().default(1), // 0 = inativo, 1 = ativo
  config: text("config"), // JSON com configurações específicas da estratégia
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Strategy = typeof strategies.$inferSelect;
export type InsertStrategy = typeof strategies.$inferInsert;

/**
 * Tabela de Configuração de Banca
 * Armazena o saldo e configurações de gerenciamento de banca do usuário
 */
export const bankrolls = mysqlTable("bankrolls", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  initialBalance: int("initialBalance").notNull().default(10000), // Saldo inicial em centavos
  currentBalance: int("currentBalance").notNull().default(10000), // Saldo atual em centavos
  totalWins: int("totalWins").notNull().default(0), // Total de ganhos em centavos
  totalLosses: int("totalLosses").notNull().default(0), // Total de perdas em centavos
  totalBets: int("totalBets").notNull().default(0), // Número total de apostas
  winRate: varchar("winRate", { length: 10 }).default("0"), // Taxa de vitória em percentual
  stopLoss: int("stopLoss"), // Limite de perda em centavos (opcional)
  stopWin: int("stopWin"), // Limite de ganho em centavos (opcional)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Bankroll = typeof bankrolls.$inferSelect;
export type InsertBankroll = typeof bankrolls.$inferInsert;

/**
 * Tabela de Histórico de Apostas
 * Armazena cada aposta realizada (manual ou automática)
 */
export const bets = mysqlTable("bets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  strategyId: int("strategyId").references(() => strategies.id),
  betAmount: int("betAmount").notNull(), // Valor da aposta em centavos
  result: varchar("result", { length: 32 }).notNull(), // 'win', 'loss', 'pending'
  payout: int("payout"), // Valor do pagamento em centavos
  rouletteNumber: int("rouletteNumber"), // Número da roleta (0-36)
  betType: varchar("betType", { length: 64 }), // Tipo de aposta (vermelho, preto, par, ímpar, etc.)
  isAutomatic: int("isAutomatic").notNull().default(0), // 0 = manual, 1 = automático
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Bet = typeof bets.$inferSelect;
export type InsertBet = typeof bets.$inferInsert;

/**
 * Tabela de Mensagens de Chat
 * Armazena as mensagens do chat em tempo real entre usuários
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  message: text("message").notNull(),
  isSystemMessage: int("isSystemMessage").notNull().default(0), // 0 = usuário, 1 = sistema
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

