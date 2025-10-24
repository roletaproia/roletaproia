import { z } from "zod";

// 1. Tipos de Estratégias
export const StrategyTypeSchema = z.enum([
  "fibonacci",
  "martingale",
  "reverseMartingale",
  "dalembert",
  "labouchere",
  "flatBetting",
  "custom",
]);
export type StrategyType = z.infer<typeof StrategyTypeSchema>;

// 2. Esquemas de Configuração (para cada tipo de estratégia)

// Fibonacci
export const FibonacciConfigSchema = z.object({
  sequenceStep: z.number().int().min(1).default(1).describe("Passo na sequência de Fibonacci após uma perda"),
  resetOnWin: z.boolean().default(true).describe("Voltar ao início da sequência após uma vitória"),
});
export type FibonacciConfig = z.infer<typeof FibonacciConfigSchema>;

// Martingale
export const MartingaleConfigSchema = z.object({
  multiplier: z.number().min(1.1).default(2.0).describe("Multiplicador da aposta após uma perda"),
  maxSteps: z.number().int().min(1).default(5).describe("Número máximo de passos (limite de perdas)"),
});
export type MartingaleConfig = z.infer<typeof MartingaleConfigSchema>;

// Reverse Martingale (Paroli)
export const ReverseMartingaleConfigSchema = z.object({
  multiplier: z.number().min(1.1).default(2.0).describe("Multiplicador da aposta após uma vitória"),
  maxWins: z.number().int().min(1).default(3).describe("Número máximo de vitórias consecutivas antes de resetar"),
});
export type ReverseMartingaleConfig = z.infer<typeof ReverseMartingaleConfigSchema>;

// D'Alembert
export const DalembertConfigSchema = z.object({
  unitAmount: z.number().min(1).default(1).describe("Valor da unidade a ser adicionado/subtraído"),
  maxBetLimit: z.number().min(1).default(1000).describe("Aposta máxima permitida"),
});
export type DalembertConfig = z.infer<typeof DalembertConfigSchema>;

// Labouchere
export const LabouchereConfigSchema = z.object({
  initialSequence: z.array(z.number().int().min(1)).default([1, 2, 3]).describe("Sequência inicial de unidades"),
  maxLosses: z.number().int().min(1).default(10).describe("Número máximo de perdas consecutivas antes de resetar"),
});
export type LabouchereConfig = z.infer<typeof LabouchereConfigSchema>;

// Flat Betting (Aposta Fixa)
export const FlatBettingConfigSchema = z.object({
  description: z.string().optional().describe("Descrição da estratégia"),
});
export type FlatBettingConfig = z.infer<typeof FlatBettingConfigSchema>;

// Custom
export const CustomConfigSchema = z.object({
  jsonConfig: z.string().optional().describe("Configuração JSON customizada"),
});
export type CustomConfig = z.infer<typeof CustomConfigSchema>;

// 3. Esquema de Configuração Unificado
export const StrategyConfigSchema = z.union([
  FibonacciConfigSchema,
  MartingaleConfigSchema,
  ReverseMartingaleConfigSchema,
  DalembertConfigSchema,
  LabouchereConfigSchema,
  FlatBettingConfigSchema,
  CustomConfigSchema,
]);
export type StrategyConfig = z.infer<typeof StrategyConfigSchema>;

// 4. Mapeamento de Esquemas por Tipo
export const StrategyConfigMap = {
  fibonacci: FibonacciConfigSchema,
  martingale: MartingaleConfigSchema,
  reverseMartingale: ReverseMartingaleConfigSchema,
  dalembert: DalembertConfigSchema,
  labouchere: LabouchereConfigSchema,
  flatBetting: FlatBettingConfigSchema,
  custom: CustomConfigSchema,
};

// 5. Estrutura de Estratégia
export const StrategySchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  type: StrategyTypeSchema,
  baseBetAmount: z.number(), // Em centavos
  isActive: z.boolean(),
  config: z.string().optional(), // JSON string da configuração
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Strategy = z.infer<typeof StrategySchema>;

