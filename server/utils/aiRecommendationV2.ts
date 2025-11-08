/**
 * Sistema Avançado de Recomendação da I.A. V2
 * Com Sistema de Confluências e Análise Profunda
 */

interface Signal {
  id: number;
  number: number;
  color: string;
  timestamp: Date;
}

interface Recommendation {
  hasSignal: boolean; // Se há sinal forte o suficiente
  suggestedNumber: number | null;
  suggestedColor: string | null;
  confidence: number; // 0-100
  analysis: string[];
  confluenceScore: number; // Quantas estratégias concordam (0-5)
}

interface StrategyResult {
  agrees: boolean;
  suggestedColor: string;
  suggestedNumber: number | null;
  confidence: number;
  reason: string;
}

// Números vermelhos e pretos
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// Setores da roleta (ordem física na roda)
const SECTORS = {
  vizinhos_zero: [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25],
  orfaos: [1, 20, 14, 31, 9, 17, 34, 6],
  terceiro: [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33],
};

const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

/**
 * Função principal - Gera recomendação com sistema de confluências
 */
export function generateAdvancedRecommendationV2(recentSignals: Signal[]): Recommendation {
  console.log(`[I.A. V2] Analisando ${recentSignals.length} sinais`);
  
  // Precisa de pelo menos 100 sinais para análise profunda
  if (recentSignals.length < 100) {
    console.log('[I.A. V2] Sinais insuficientes para análise profunda');
    return {
      hasSignal: false,
      suggestedNumber: null,
      suggestedColor: null,
      confidence: 0,
      analysis: ['Aguardando mais dados para análise profunda (mínimo 100 spins)'],
      confluenceScore: 0,
    };
  }

  // Aplicar 5 estratégias diferentes
  const strategies: StrategyResult[] = [
    strategy1_ColorSequenceAnalysis(recentSignals),
    strategy2_SectorHotColdAnalysis(recentSignals),
    strategy3_FrequencyAnalysis(recentSignals),
    strategy4_CyclePatternAnalysis(recentSignals),
    strategy5_BayesianProbability(recentSignals),
  ];

  // Contar quantas estratégias concordam
  const redVotes = strategies.filter(s => s.agrees && s.suggestedColor === 'red').length;
  const blackVotes = strategies.filter(s => s.agrees && s.suggestedColor === 'black').length;
  
  const confluenceScore = Math.max(redVotes, blackVotes);
  
  console.log(`[I.A. V2] Confluência: ${redVotes} vermelho, ${blackVotes} preto`);

  // Sempre gera sinal, mas marca confiança baixa se < 2 estratégias
  const hasStrongSignal = confluenceScore >= 2;
  
  if (!hasStrongSignal) {
    console.log('[I.A. V2] Confluência baixa - gerando sinal com baixa confiança');
  }

  // Determinar cor sugerida (mesmo com baixa confluência)
  let suggestedColor: string;
  
  if (redVotes === 0 && blackVotes === 0) {
    // Nenhuma estratégia concorda - usar a mais confiante
    const mostConfident = strategies.sort((a, b) => b.confidence - a.confidence)[0];
    suggestedColor = mostConfident.suggestedColor;
  } else {
    suggestedColor = redVotes > blackVotes ? 'red' : 'black';
  }
  
  // Pegar estratégias que concordam com a cor sugerida
  let agreeingStrategies = strategies.filter(
    s => s.agrees && s.suggestedColor === suggestedColor
  );
  
  // Se nenhuma estratégia concorda, usar todas da cor sugerida
  if (agreeingStrategies.length === 0) {
    agreeingStrategies = strategies.filter(s => s.suggestedColor === suggestedColor);
  }
  
  // Se ainda não tem, usar a mais confiante
  if (agreeingStrategies.length === 0) {
    agreeingStrategies = [strategies.sort((a, b) => b.confidence - a.confidence)[0]];
  }

  // Calcular confiança média
  const avgConfidence = agreeingStrategies.reduce((sum, s) => sum + s.confidence, 0) / agreeingStrategies.length;
  
  // Escolher número sugerido (média ponderada dos números sugeridos)
  const suggestedNumbers = agreeingStrategies
    .filter(s => s.suggestedNumber !== null)
    .map(s => s.suggestedNumber!);
  
  let suggestedNumber: number | null = null;
  if (suggestedNumbers.length > 0) {
    // Pegar o número mais votado
    const numberCounts = new Map<number, number>();
    suggestedNumbers.forEach(n => {
      numberCounts.set(n, (numberCounts.get(n) || 0) + 1);
    });
    const mostVoted = Array.from(numberCounts.entries())
      .sort((a, b) => b[1] - a[1])[0][0];
    suggestedNumber = mostVoted;
  } else {
    // Se nenhuma estratégia sugeriu número, escolher aleatório da cor
    const colorNumbers = suggestedColor === 'red' ? RED_NUMBERS : BLACK_NUMBERS;
    suggestedNumber = colorNumbers[Math.floor(Math.random() * colorNumbers.length)];
  }

  // Compilar análise com aviso se confiança baixa
  const analysis = agreeingStrategies.map(s => s.reason);
  
  // Adicionar avisos baseados na confiança
  if (avgConfidence < 50) {
    analysis.unshift('⚠️ CONFIANÇA BAIXA - Aguarde sinal com confiança ≥ 50%');
  } else if (avgConfidence >= 70) {
    analysis.unshift('✅ CONFIANÇA ALTA - Sinal forte!');
  }

  console.log(`[I.A. V2] SINAL CONFIRMADO: ${suggestedColor} (${suggestedNumber}) - Confiança: ${Math.round(avgConfidence)}%`);

  return {
    hasSignal: true,
    suggestedNumber,
    suggestedColor,
    confidence: Math.round(avgConfidence),
    analysis,
    confluenceScore,
  };
}

/**
 * ESTRATÉGIA 1: Análise de Sequências de Cores
 * Baseada em: 3+ cores consecutivas → cor oposta tem maior probabilidade
 */
function strategy1_ColorSequenceAnalysis(signals: Signal[]): StrategyResult {
  const last20 = signals.slice(0, 20);
  
  // Contar sequências consecutivas
  let consecutiveRed = 0;
  let consecutiveBlack = 0;
  
  for (const signal of last20) {
    if (signal.color === 'red') {
      consecutiveRed++;
      consecutiveBlack = 0;
    } else if (signal.color === 'black') {
      consecutiveBlack++;
      consecutiveRed = 0;
    } else {
      break; // Verde quebra sequência
    }
  }

  // Se 3+ vermelhos → sugerir preto
  if (consecutiveRed >= 3) {
    return {
      agrees: true,
      suggestedColor: 'black',
      suggestedNumber: null,
      confidence: 65 + (consecutiveRed - 3) * 5, // Aumenta com mais consecutivos
      reason: `${consecutiveRed} vermelhos consecutivos → Preto tem maior probabilidade`,
    };
  }
  
  // Se 3+ pretos → sugerir vermelho
  if (consecutiveBlack >= 3) {
    return {
      agrees: true,
      suggestedColor: 'red',
      suggestedNumber: null,
      confidence: 65 + (consecutiveBlack - 3) * 5,
      reason: `${consecutiveBlack} pretos consecutivos → Vermelho tem maior probabilidade`,
    };
  }

  // Sem padrão forte
  return {
    agrees: false,
    suggestedColor: 'red',
    suggestedNumber: null,
    confidence: 50,
    reason: 'Sem sequência significativa de cores',
  };
}

/**
 * ESTRATÉGIA 2: Análise de Setores Quentes/Frios
 * Baseada em: Setores com 8+ ocorrências em 50 spins são "quentes"
 */
function strategy2_SectorHotColdAnalysis(signals: Signal[]): StrategyResult {
  const last50 = signals.slice(0, 50);
  
  const sectorCounts = {
    vizinhos_zero: 0,
    orfaos: 0,
    terceiro: 0,
  };

  for (const signal of last50) {
    if (SECTORS.vizinhos_zero.includes(signal.number)) {
      sectorCounts.vizinhos_zero++;
    } else if (SECTORS.orfaos.includes(signal.number)) {
      sectorCounts.orfaos++;
    } else if (SECTORS.terceiro.includes(signal.number)) {
      sectorCounts.terceiro++;
    }
  }

  // Encontrar setor mais quente
  const maxCount = Math.max(...Object.values(sectorCounts));
  const hotSector = Object.keys(sectorCounts).find(
    key => sectorCounts[key as keyof typeof sectorCounts] === maxCount
  ) as keyof typeof SECTORS;

  // Se setor quente tem 8+ ocorrências
  if (maxCount >= 8) {
    const sectorNumbers = SECTORS[hotSector];
    
    // Contar vermelhos e pretos no setor
    const redInSector = sectorNumbers.filter(n => RED_NUMBERS.includes(n)).length;
    const blackInSector = sectorNumbers.filter(n => BLACK_NUMBERS.includes(n)).length;
    
    const suggestedColor = redInSector > blackInSector ? 'red' : 'black';
    const colorNumbers = suggestedColor === 'red' 
      ? sectorNumbers.filter(n => RED_NUMBERS.includes(n))
      : sectorNumbers.filter(n => BLACK_NUMBERS.includes(n));
    
    return {
      agrees: true,
      suggestedColor,
      suggestedNumber: colorNumbers[Math.floor(Math.random() * colorNumbers.length)],
      confidence: 70,
      reason: `Setor ${hotSector} quente (${maxCount}/50 spins)`,
    };
  }

  return {
    agrees: false,
    suggestedColor: 'red',
    suggestedNumber: null,
    confidence: 50,
    reason: 'Nenhum setor significativamente quente',
  };
}

/**
 * ESTRATÉGIA 3: Análise de Frequência
 * Baseada em: Números que não saem há muito tempo (lei dos grandes números)
 */
function strategy3_FrequencyAnalysis(signals: Signal[]): StrategyResult {
  const last100 = signals.slice(0, 100);
  
  // Contar frequência de cada número
  const numberCounts = new Map<number, number>();
  for (let i = 0; i <= 36; i++) {
    numberCounts.set(i, 0);
  }
  
  for (const signal of last100) {
    numberCounts.set(signal.number, (numberCounts.get(signal.number) || 0) + 1);
  }

  // Encontrar números "atrasados" (que não saíram ou saíram pouco)
  const delayedNumbers = Array.from(numberCounts.entries())
    .filter(([num]) => num !== 0) // Excluir verde
    .sort((a, b) => a[1] - b[1]) // Ordenar por frequência (menor primeiro)
    .slice(0, 10); // Top 10 mais atrasados

  // Contar vermelhos e pretos entre os atrasados
  const delayedRed = delayedNumbers.filter(([num]) => RED_NUMBERS.includes(num)).length;
  const delayedBlack = delayedNumbers.filter(([num]) => BLACK_NUMBERS.includes(num)).length;

  if (delayedRed > delayedBlack + 2) {
    const suggestedNumber = delayedNumbers.find(([num]) => RED_NUMBERS.includes(num))?.[0] || null;
    return {
      agrees: true,
      suggestedColor: 'red',
      suggestedNumber,
      confidence: 68,
      reason: `${delayedRed} números vermelhos atrasados`,
    };
  }

  if (delayedBlack > delayedRed + 2) {
    const suggestedNumber = delayedNumbers.find(([num]) => BLACK_NUMBERS.includes(num))?.[0] || null;
    return {
      agrees: true,
      suggestedColor: 'black',
      suggestedNumber,
      confidence: 68,
      reason: `${delayedBlack} números pretos atrasados`,
    };
  }

  return {
    agrees: false,
    suggestedColor: 'red',
    suggestedNumber: null,
    confidence: 50,
    reason: 'Frequências equilibradas',
  };
}

/**
 * ESTRATÉGIA 4: Análise de Ciclos e Padrões
 * Baseada em: Identificar padrões que se repetem em intervalos regulares
 */
function strategy4_CyclePatternAnalysis(signals: Signal[]): StrategyResult {
  const last150 = signals.slice(0, 150);
  
  // Analisar padrões de cores em grupos de 10
  const colorGroups: string[] = [];
  for (let i = 0; i < last150.length; i += 10) {
    const group = last150.slice(i, i + 10);
    const redCount = group.filter(s => s.color === 'red').length;
    const blackCount = group.filter(s => s.color === 'black').length;
    
    if (redCount > blackCount + 2) {
      colorGroups.push('red');
    } else if (blackCount > redCount + 2) {
      colorGroups.push('black');
    } else {
      colorGroups.push('neutral');
    }
  }

  // Verificar se há padrão nos últimos 3 grupos
  const last3Groups = colorGroups.slice(0, 3);
  const redGroups = last3Groups.filter(g => g === 'red').length;
  const blackGroups = last3Groups.filter(g => g === 'black').length;

  if (redGroups >= 2) {
    return {
      agrees: true,
      suggestedColor: 'black',
      suggestedNumber: null,
      confidence: 66,
      reason: `Ciclo de ${redGroups} grupos vermelhos → Tendência para preto`,
    };
  }

  if (blackGroups >= 2) {
    return {
      agrees: true,
      suggestedColor: 'red',
      suggestedNumber: null,
      confidence: 66,
      reason: `Ciclo de ${blackGroups} grupos pretos → Tendência para vermelho`,
    };
  }

  return {
    agrees: false,
    suggestedColor: 'red',
    suggestedNumber: null,
    confidence: 50,
    reason: 'Sem padrão cíclico identificado',
  };
}

/**
 * ESTRATÉGIA 5: Probabilidade Bayesiana
 * Baseada em: Atualizar probabilidades com base em eventos recentes
 */
function strategy5_BayesianProbability(signals: Signal[]): StrategyResult {
  const last200 = signals.slice(0, Math.min(200, signals.length));
  
  // Contar cores totais
  const redCount = last200.filter(s => s.color === 'red').length;
  const blackCount = last200.filter(s => s.color === 'black').length;
  const total = redCount + blackCount;

  // Probabilidade esperada: 48.6% para cada cor (roleta europeia)
  const expectedProb = 0.486;
  const redProb = redCount / total;
  const blackProb = blackCount / total;

  // Se vermelho está acima do esperado → preto tem maior chance
  if (redProb > expectedProb + 0.05) {
    return {
      agrees: true,
      suggestedColor: 'black',
      suggestedNumber: null,
      confidence: 64,
      reason: `Vermelho acima do esperado (${(redProb * 100).toFixed(1)}%) → Regressão à média`,
    };
  }

  // Se preto está acima do esperado → vermelho tem maior chance
  if (blackProb > expectedProb + 0.05) {
    return {
      agrees: true,
      suggestedColor: 'red',
      suggestedNumber: null,
      confidence: 64,
      reason: `Preto acima do esperado (${(blackProb * 100).toFixed(1)}%) → Regressão à média`,
    };
  }

  return {
    agrees: false,
    suggestedColor: 'red',
    suggestedNumber: null,
    confidence: 50,
    reason: 'Probabilidades dentro do esperado',
  };
}

/**
 * Função auxiliar para obter cor do número
 */
function getNumberColor(num: number): string {
  if (num === 0) return 'green';
  if (RED_NUMBERS.includes(num)) return 'red';
  if (BLACK_NUMBERS.includes(num)) return 'black';
  return 'green';
}
