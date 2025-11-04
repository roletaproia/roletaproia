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
  referralCode: varchar("referralCode", { length: 32 }).unique(), // Código único de indicação do usuário
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


/**
 * Tabela de Bans de Chat
 * Armazena usuários banidos do chat
 */
export const chatBans = mysqlTable("chatBans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  bannedBy: int("bannedBy").notNull().references(() => users.id), // Admin que aplicou o ban
  reason: text("reason").notNull(),
  expiresAt: timestamp("expiresAt"), // null = permanente
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatBan = typeof chatBans.$inferSelect;
export type InsertChatBan = typeof chatBans.$inferInsert;

/**
 * Tabela de Regras do Chat
 * Armazena regras configuráveis do chat
 */
export const chatRules = mysqlTable("chatRules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  isActive: int("isActive").notNull().default(1), // 0 = inativo, 1 = ativo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatRule = typeof chatRules.$inferSelect;
export type InsertChatRule = typeof chatRules.$inferInsert;

/**
 * Tabela de Palavras Proibidas
 * Lista de palavras que não podem ser enviadas no chat
 */
export const bannedWords = mysqlTable("bannedWords", {
  id: int("id").autoincrement().primaryKey(),
  word: varchar("word", { length: 255 }).notNull().unique(),
  severity: mysqlEnum("severity", ["low", "medium", "high"]).default("medium").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BannedWord = typeof bannedWords.$inferSelect;
export type InsertBannedWord = typeof bannedWords.$inferInsert;

/**
 * Tabela de Avisos/Warnings
 * Armazena avisos dados aos usuários antes de ban
 */
export const chatWarnings = mysqlTable("chatWarnings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  issuedBy: int("issuedBy").notNull().references(() => users.id), // Admin que deu o aviso
  reason: text("reason").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatWarning = typeof chatWarnings.$inferSelect;
export type InsertChatWarning = typeof chatWarnings.$inferInsert;

/**
 * Tabela de Mensagens Deletadas (Log de Moderação)
 * Histórico de mensagens removidas pela moderação
 */
export const deletedMessages = mysqlTable("deletedMessages", {
  id: int("id").autoincrement().primaryKey(),
  originalMessageId: int("originalMessageId").notNull(),
  userId: int("userId").notNull().references(() => users.id),
  message: text("message").notNull(),
  deletedBy: int("deletedBy").notNull().references(() => users.id), // Admin que deletou
  reason: text("reason").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DeletedMessage = typeof deletedMessages.$inferSelect;
export type InsertDeletedMessage = typeof deletedMessages.$inferInsert;


/**
 * Tabela de Assinaturas/Subscriptions
 * Gerencia planos pagos e trial dos usuários
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  plan: mysqlEnum("plan", ["trial", "monthly", "quarterly", "annual"]).default("trial").notNull(),
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
  trialEndsAt: timestamp("trialEndsAt"), // Data de fim do trial
  subscriptionEndsAt: timestamp("subscriptionEndsAt"), // Data de fim da assinatura paga
  extraDays: int("extraDays").notNull().default(0), // Dias extras dados pelo admin ou indicações
  registrationIp: varchar("registrationIp", { length: 45 }), // IP do registro (IPv4/IPv6)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Tabela de Referrals/Indicações
 * Sistema de indicação onde cada usuário ganha +7 dias por indicado
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull().references(() => users.id), // Quem indicou
  referredId: int("referredId").notNull().unique().references(() => users.id), // Quem foi indicado
  bonusDaysGranted: int("bonusDaysGranted").notNull().default(7), // Dias bônus dados
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Tabela de Histórico de Pagamentos
 * Log de pagamentos realizados pelos usuários
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  plan: mysqlEnum("plan", ["monthly", "quarterly", "annual"]).notNull(),
  amount: int("amount").notNull(), // Valor em centavos
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 64 }), // 'telegram', 'pix', etc.
  transactionId: varchar("transactionId", { length: 255 }), // ID da transação
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Tabela de IPs Bloqueados
 * Controle anti-fraude: cada IP pode criar até 3 trials
 */
export const blockedIps = mysqlTable("blockedIps", {
  id: int("id").autoincrement().primaryKey(),
  ipAddress: varchar("ipAddress", { length: 45 }).notNull(),
  userId: int("userId").references(() => users.id), // Primeiro usuário que usou este IP
  reason: text("reason"), // Motivo do bloqueio (se manual)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlockedIp = typeof blockedIps.$inferSelect;
export type InsertBlockedIp = typeof blockedIps.$inferInsert;



/**
 * Tabela de Sinais da Roleta (Live Signals)
 * Armazena os números capturados automaticamente da roleta 1win
 */
export const signals = mysqlTable("signals", {
  id: int("id").autoincrement().primaryKey(),
  number: int("number").notNull(), // Número da roleta (0-36)
  color: mysqlEnum("color", ["red", "black", "green"]).notNull(), // Cor do número
  timestamp: timestamp("timestamp").defaultNow().notNull(), // Quando o número saiu
  source: varchar("source", { length: 64 }).default("1win").notNull(), // Origem do sinal
  sessionId: varchar("sessionId", { length: 255 }), // ID da sessão de captura
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Signal = typeof signals.$inferSelect;
export type InsertSignal = typeof signals.$inferInsert;

/**
 * Tabela de Recomendações de Apostas (AI Recommendations)
 * Armazena as recomendações geradas pela I.A. baseadas nos sinais
 */
export const recommendations = mysqlTable("recommendations", {
  id: int("id").autoincrement().primaryKey(),
  signalId: int("signalId").notNull().references(() => signals.id), // Sinal que gerou a recomendação
  betType: varchar("betType", { length: 64 }).notNull(), // 'red', 'black', 'even', 'odd', 'high', 'low', etc.
  confidence: int("confidence").notNull(), // Confiança da I.A. (0-100)
  suggestedAmount: int("suggestedAmount").notNull(), // Valor sugerido em centavos
  strategy: varchar("strategy", { length: 64 }).notNull(), // Estratégia usada (martingale, fibonacci, etc.)
  result: mysqlEnum("result", ["pending", "win", "loss"]), // Resultado da recomendação
  // Campos adicionais da I.A. avançada
  suggestedNumber: int("suggestedNumber"), // Número específico sugerido (0-36)
  suggestedDozen: int("suggestedDozen"), // Dúzia sugerida (1, 2 ou 3)
  suggestedColumn: int("suggestedColumn"), // Coluna sugerida (1, 2 ou 3)
  suggestedParity: varchar("suggestedParity", { length: 16 }), // "par" ou "impar"
  sector: varchar("sector", { length: 64 }), // Setor da roda (vizinhos_zero, orfaos, terceiro)
  neighbors: text("neighbors"), // JSON com números vizinhos
  analysis: text("analysis"), // JSON com motivos da análise
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = typeof recommendations.$inferInsert;

/**
 * Tabela de Sessões de Captura (Capture Sessions)
 * Controla as sessões de captura automática do admin
 */
export const captureSessions = mysqlTable("captureSessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull().unique(), // UUID da sessão
  startedBy: int("startedBy").notNull().references(() => users.id), // Admin que iniciou
  status: mysqlEnum("status", ["active", "stopped", "error"]).default("active").notNull(),
  totalSignals: int("totalSignals").notNull().default(0), // Total de sinais capturados
  lastSignalAt: timestamp("lastSignalAt"), // Último sinal capturado
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  stoppedAt: timestamp("stoppedAt"),
});

export type CaptureSession = typeof captureSessions.$inferSelect;
export type InsertCaptureSession = typeof captureSessions.$inferInsert;

