/**
 * Sistema Avançado de Recomendação da I.A. para Roleta
 * Baseado em análise de padrões, dúzias, setores e probabilidades
 */

interface Signal {
  id: number;
  number: number;
  color: string;
  timestamp: Date;
}

interface Recommendation {
  // Aposta principal
  suggestedNumber: number | null;
  suggestedColor: string;
  suggestedDozen: number; // 1, 2 ou 3
  suggestedColumn: number; // 1, 2 ou 3
  suggestedParity: string; // "par" ou "impar"
  
  // Setor da roda
  sector: string; // "vizinhos_zero", "orfaos", "terceiro"
  neighbors: number[]; // Números vizinhos sugeridos
  
  // Análise
  confidence: number; // 0-100
  analysis: string[]; // Motivos da recomendação
  
  // Estratégia
  betType: string; // "red", "black", "green"
  suggestedAmount: number;
  strategy: string;
}

// Definição dos setores da roleta europeia
const SECTORS = {
  vizinhos_zero: [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25],
  orfaos: [1, 20, 14, 31, 9, 17, 34, 6],
  terceiro: [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33],
};

// Números vermelhos
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

// Números pretos
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// Mapa de vizinhos na roda (ordem física)
const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

/**
 * Função principal de geração de recomendação
 */
export function generateAdvancedRecommendation(recentSignals: Signal[]): Recommendation {
  if (recentSignals.length === 0) {
    return getDefaultRecommendation();
  }

  const analysis: string[] = [];
  let confidence = 50;

  // 1. Análise de Cores (peso: 35%)
  const colorAnalysis = analyzeColors(recentSignals);
  confidence += colorAnalysis.confidenceBoost;
  analysis.push(...colorAnalysis.reasons);

  // 2. Análise de Dúzias (peso: 25%)
  const dozenAnalysis = analyzeDozens(recentSignals);
  confidence += dozenAnalysis.confidenceBoost;
  analysis.push(...dozenAnalysis.reasons);

  // 3. Análise de Setores (peso: 20%)
  const sectorAnalysis = analyzeSectors(recentSignals);
  confidence += sectorAnalysis.confidenceBoost;
  analysis.push(...sectorAnalysis.reasons);

  // 4. Análise de Par/Ímpar (peso: 15%)
  const parityAnalysis = analyzeParity(recentSignals);
  confidence += parityAnalysis.confidenceBoost;
  analysis.push(...parityAnalysis.reasons);

  // 5. Análise de Números Quentes (peso: 5%)
  const hotNumbersAnalysis = analyzeHotNumbers(recentSignals);
  confidence += hotNumbersAnalysis.confidenceBoost;
  analysis.push(...hotNumbersAnalysis.reasons);

  // Limitar confiança entre 50-95%
  confidence = Math.max(50, Math.min(95, confidence));

  // Determinar número sugerido baseado em todas as análises
  const suggestedNumber = determineBestNumber(
    colorAnalysis,
    dozenAnalysis,
    sectorAnalysis,
    parityAnalysis,
    hotNumbersAnalysis
  );

  // Encontrar vizinhos do número sugerido
  const neighbors = getNeighbors(suggestedNumber, 2);

  // Determinar dúzia e coluna
  const suggestedDozen = Math.ceil(suggestedNumber / 12) || 1;
  const suggestedColumn = ((suggestedNumber - 1) % 3) + 1 || 1;

  // Determinar paridade
  const suggestedParity = suggestedNumber % 2 === 0 ? "par" : "impar";

  // Determinar cor
  const suggestedColor = getNumberColor(suggestedNumber);

  return {
    suggestedNumber,
    suggestedColor,
    suggestedDozen,
    suggestedColumn,
    suggestedParity,
    sector: sectorAnalysis.hotSector,
    neighbors,
    confidence: Math.round(confidence),
    analysis,
    betType: suggestedColor,
    suggestedAmount: 10,
    strategy: "ai_advanced",
  };
}

/**
 * Análise de padrões de cores
 */
function analyzeColors(signals: Signal[]) {
  const last10 = signals.slice(0, 10);
  const redCount = last10.filter(s => s.color === "red").length;
  const blackCount = last10.filter(s => s.color === "black").length;
  const greenCount = last10.filter(s => s.color === "green").length;

  const reasons: string[] = [];
  let confidenceBoost = 0;
  let suggestedColor = "red";

  // Detectar sequências
  const lastColors = last10.map(s => s.color);
  let consecutiveRed = 0;
  let consecutiveBlack = 0;

  for (const color of lastColors) {
    if (color === "red") {
      consecutiveRed++;
      consecutiveBlack = 0;
    } else if (color === "black") {
      consecutiveBlack++;
      consecutiveRed = 0;
    } else {
      break;
    }
  }

  // Se muitos vermelhos, sugerir preto
  if (consecutiveRed >= 3) {
    suggestedColor = "black";
    confidenceBoost += 10 + (consecutiveRed - 3) * 3;
    reasons.push(`${consecutiveRed} vermelhos consecutivos - tendência para preto`);
  }
  // Se muitos pretos, sugerir vermelho
  else if (consecutiveBlack >= 3) {
    suggestedColor = "red";
    confidenceBoost += 10 + (consecutiveBlack - 3) * 3;
    reasons.push(`${consecutiveBlack} pretos consecutivos - tendência para vermelho`);
  }
  // Análise de equilíbrio
  else if (redCount > blackCount + 3) {
    suggestedColor = "black";
    confidenceBoost += 8;
    reasons.push(`Desequilíbrio de cores (${redCount}R vs ${blackCount}P)`);
  } else if (blackCount > redCount + 3) {
    suggestedColor = "red";
    confidenceBoost += 8;
    reasons.push(`Desequilíbrio de cores (${blackCount}P vs ${redCount}R)`);
  }

  return {
    suggestedColor,
    confidenceBoost,
    reasons,
    redCount,
    blackCount,
    greenCount,
  };
}

/**
 * Análise de dúzias
 */
function analyzeDozens(signals: Signal[]) {
  const last10 = signals.slice(0, 10);
  const dozenCounts = [0, 0, 0]; // 1ª, 2ª, 3ª dúzia

  for (const signal of last10) {
    if (signal.number === 0) continue;
    const dozen = Math.ceil(signal.number / 12) - 1;
    dozenCounts[dozen]++;
  }

  const reasons: string[] = [];
  let confidenceBoost = 0;

  // Encontrar dúzia mais ativa
  const maxCount = Math.max(...dozenCounts);
  const hotDozen = dozenCounts.indexOf(maxCount) + 1;

  // Encontrar dúzia "atrasada"
  const minCount = Math.min(...dozenCounts);
  const coldDozen = dozenCounts.indexOf(minCount) + 1;

  if (maxCount >= 5) {
    confidenceBoost += 8;
    reasons.push(`${hotDozen}ª dúzia ativa (${maxCount} de 10)`);
  }

  if (minCount <= 1) {
    confidenceBoost += 5;
    reasons.push(`${coldDozen}ª dúzia atrasada (apenas ${minCount})`);
  }

  return {
    hotDozen,
    coldDozen,
    dozenCounts,
    confidenceBoost,
    reasons,
  };
}

/**
 * Análise de setores da roda
 */
function analyzeSectors(signals: Signal[]) {
  const last20 = signals.slice(0, 20);
  const sectorCounts = {
    vizinhos_zero: 0,
    orfaos: 0,
    terceiro: 0,
  };

  for (const signal of last20) {
    if (SECTORS.vizinhos_zero.includes(signal.number)) {
      sectorCounts.vizinhos_zero++;
    } else if (SECTORS.orfaos.includes(signal.number)) {
      sectorCounts.orfaos++;
    } else if (SECTORS.terceiro.includes(signal.number)) {
      sectorCounts.terceiro++;
    }
  }

  const reasons: string[] = [];
  let confidenceBoost = 0;

  // Encontrar setor mais quente
  const maxCount = Math.max(...Object.values(sectorCounts));
  const hotSector = Object.keys(sectorCounts).find(
    key => sectorCounts[key as keyof typeof sectorCounts] === maxCount
  ) || "vizinhos_zero";

  if (maxCount >= 8) {
    confidenceBoost += 7;
    reasons.push(`Setor ${hotSector.replace("_", " ")} quente (${maxCount} ocorrências)`);
  }

  return {
    hotSector,
    sectorCounts,
    confidenceBoost,
    reasons,
  };
}

/**
 * Análise de par/ímpar
 */
function analyzeParity(signals: Signal[]) {
  const last10 = signals.slice(0, 10);
  let evenCount = 0;
  let oddCount = 0;

  for (const signal of last10) {
    if (signal.number === 0) continue;
    if (signal.number % 2 === 0) {
      evenCount++;
    } else {
      oddCount++;
    }
  }

  const reasons: string[] = [];
  let confidenceBoost = 0;
  let suggestedParity = "par";

  if (evenCount > oddCount + 3) {
    suggestedParity = "impar";
    confidenceBoost += 5;
    reasons.push(`Tendência para ímpar (${evenCount}P vs ${oddCount}I)`);
  } else if (oddCount > evenCount + 3) {
    suggestedParity = "par";
    confidenceBoost += 5;
    reasons.push(`Tendência para par (${oddCount}I vs ${evenCount}P)`);
  }

  return {
    suggestedParity,
    evenCount,
    oddCount,
    confidenceBoost,
    reasons,
  };
}

/**
 * Análise de números quentes
 */
function analyzeHotNumbers(signals: Signal[]) {
  const last20 = signals.slice(0, 20);
  const numberCounts: { [key: number]: number } = {};

  for (const signal of last20) {
    numberCounts[signal.number] = (numberCounts[signal.number] || 0) + 1;
  }

  const reasons: string[] = [];
  let confidenceBoost = 0;

  // Encontrar números que repetiram
  const hotNumbers = Object.entries(numberCounts)
    .filter(([_, count]) => count >= 2)
    .map(([num, count]) => ({ num: parseInt(num), count }))
    .sort((a, b) => b.count - a.count);

  if (hotNumbers.length > 0) {
    const hottest = hotNumbers[0];
    confidenceBoost += 3;
    reasons.push(`Número ${hottest.num} quente (${hottest.count}x nos últimos 20)`);
  }

  return {
    hotNumbers,
    confidenceBoost,
    reasons,
  };
}

/**
 * Determina o melhor número baseado em todas as análises
 */
function determineBestNumber(
  colorAnalysis: any,
  dozenAnalysis: any,
  sectorAnalysis: any,
  parityAnalysis: any,
  hotNumbersAnalysis: any
): number {
  // Se houver número quente, considerar
  if (hotNumbersAnalysis.hotNumbers.length > 0) {
    const hottest = hotNumbersAnalysis.hotNumbers[0];
    // Verificar se o número quente está alinhado com outras análises
    const numberColor = getNumberColor(hottest.num);
    if (numberColor === colorAnalysis.suggestedColor) {
      return hottest.num;
    }
  }

  // Buscar número no setor quente que corresponda à cor sugerida
  const sectorNumbers = SECTORS[sectorAnalysis.hotSector as keyof typeof SECTORS];
  const candidateNumbers = sectorNumbers.filter(num => {
    const color = getNumberColor(num);
    const parity = num % 2 === 0 ? "par" : "impar";
    return color === colorAnalysis.suggestedColor && parity === parityAnalysis.suggestedParity;
  });

  if (candidateNumbers.length > 0) {
    // Escolher número aleatório dos candidatos
    return candidateNumbers[Math.floor(Math.random() * candidateNumbers.length)];
  }

  // Fallback: escolher número da cor sugerida na dúzia quente
  const dozenStart = (dozenAnalysis.hotDozen - 1) * 12 + 1;
  const dozenEnd = dozenAnalysis.hotDozen * 12;
  const dozenNumbers = [];
  
  for (let i = dozenStart; i <= dozenEnd; i++) {
    if (getNumberColor(i) === colorAnalysis.suggestedColor) {
      dozenNumbers.push(i);
    }
  }

  if (dozenNumbers.length > 0) {
    return dozenNumbers[Math.floor(Math.random() * dozenNumbers.length)];
  }

  // Último fallback: número aleatório da cor sugerida
  const colorNumbers = colorAnalysis.suggestedColor === "red" ? RED_NUMBERS : BLACK_NUMBERS;
  return colorNumbers[Math.floor(Math.random() * colorNumbers.length)];
}

/**
 * Obtém a cor de um número
 */
function getNumberColor(number: number): string {
  if (number === 0) return "green";
  return RED_NUMBERS.includes(number) ? "red" : "black";
}

/**
 * Obtém vizinhos de um número na roda física
 */
function getNeighbors(number: number, count: number): number[] {
  const index = WHEEL_ORDER.indexOf(number);
  if (index === -1) return [];

  const neighbors: number[] = [];
  for (let i = 1; i <= count; i++) {
    const leftIndex = (index - i + WHEEL_ORDER.length) % WHEEL_ORDER.length;
    const rightIndex = (index + i) % WHEEL_ORDER.length;
    neighbors.push(WHEEL_ORDER[leftIndex], WHEEL_ORDER[rightIndex]);
  }

  return neighbors;
}

/**
 * Recomendação padrão quando não há dados
 */
function getDefaultRecommendation(): Recommendation {
  return {
    suggestedNumber: 14,
    suggestedColor: "red",
    suggestedDozen: 2,
    suggestedColumn: 2,
    suggestedParity: "par",
    sector: "orfaos",
    neighbors: [31, 9, 22, 18],
    confidence: 50,
    analysis: ["Aguardando mais dados para análise precisa"],
    betType: "red",
    suggestedAmount: 10,
    strategy: "default",
  };
}
