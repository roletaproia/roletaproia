/**
 * Análise Avançada de Padrões para Roleta
 * Sistema inteligente de detecção de padrões e tendências
 */

export interface SpinResult {
  number: number;
  color: 'red' | 'black' | 'green';
  dozen: 1 | 2 | 3 | null;
  column: 1 | 2 | 3 | null;
  parity: 'even' | 'odd' | null;
  sector: string;
}

export interface PatternAnalysis {
  patterns: DetectedPattern[];
  trends: Trend[];
  hotNumbers: number[];
  coldNumbers: number[];
  hotSectors: string[];
  coldSectors: string[];
  recommendations: string[];
  confidence: number;
}

export interface DetectedPattern {
  type: string;
  description: string;
  confidence: number;
  data: any;
}

export interface Trend {
  type: string;
  direction: 'up' | 'down' | 'stable';
  strength: number;
  description: string;
}

// Setores da roleta europeia
const SECTORS = {
  vizinhos_zero: [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25],
  terceiro_roda: [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33],
  orfaos: [17, 34, 6, 1, 20, 14, 31, 9],
  zero_game: [12, 35, 3, 26, 0, 32, 15],
};

export class AdvancedPatternAnalyzer {
  
  /**
   * Analisa os últimos resultados e detecta padrões
   */
  static analyze(history: SpinResult[]): PatternAnalysis {
    if (history.length < 20) {
      return {
        patterns: [],
        trends: [],
        hotNumbers: [],
        coldNumbers: [],
        hotSectors: [],
        coldSectors: [],
        recommendations: ['Histórico insuficiente para análise'],
        confidence: 0,
      };
    }

    const patterns = this.detectPatterns(history);
    const trends = this.analyzeTrends(history);
    const { hot: hotNumbers, cold: coldNumbers } = this.analyzeNumberFrequency(history);
    const { hot: hotSectors, cold: coldSectors } = this.analyzeSectorFrequency(history);
    const recommendations = this.generateRecommendations(patterns, trends, hotNumbers, hotSectors);
    const confidence = this.calculateConfidence(patterns, trends);

    return {
      patterns,
      trends,
      hotNumbers,
      coldNumbers,
      hotSectors,
      coldSectors,
      recommendations,
      confidence,
    };
  }

  /**
   * Detecta padrões específicos no histórico
   */
  private static detectPatterns(history: SpinResult[]): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];

    // Padrão 1: Sequência de cores
    const colorSequence = this.detectColorSequence(history);
    if (colorSequence) patterns.push(colorSequence);

    // Padrão 2: Dúzias atrasadas
    const delayedDozen = this.detectDelayedDozen(history);
    if (delayedDozen) patterns.push(delayedDozen);

    // Padrão 3: Números vizinhos
    const neighborPattern = this.detectNeighborPattern(history);
    if (neighborPattern) patterns.push(neighborPattern);

    // Padrão 4: Ciclos de paridade
    const parityCycle = this.detectParityCycle(history);
    if (parityCycle) patterns.push(parityCycle);

    // Padrão 5: Setor dominante
    const dominantSector = this.detectDominantSector(history);
    if (dominantSector) patterns.push(dominantSector);

    return patterns;
  }

  /**
   * Detecta sequências de cores
   */
  private static detectColorSequence(history: SpinResult[]): DetectedPattern | null {
    const recent = history.slice(-10);
    const colors = recent.map(s => s.color);
    
    // Contar sequências
    let currentColor = colors[0];
    let currentStreak = 1;
    let maxStreak = 1;
    let streakColor = currentColor;

    for (let i = 1; i < colors.length; i++) {
      if (colors[i] === currentColor) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
          streakColor = currentColor;
        }
      } else {
        currentStreak = 1;
        currentColor = colors[i];
      }
    }

    if (maxStreak >= 3) {
      const oppositeColor = streakColor === 'red' ? 'preto' : 'vermelho';
      return {
        type: 'color_sequence',
        description: `${maxStreak} ${streakColor === 'red' ? 'vermelhos' : 'pretos'} consecutivos - tendência para ${oppositeColor}`,
        confidence: Math.min(maxStreak * 15, 75),
        data: { streak: maxStreak, color: streakColor },
      };
    }

    return null;
  }

  /**
   * Detecta dúzias atrasadas
   */
  private static detectDelayedDozen(history: SpinResult[]): DetectedPattern | null {
    const recent = history.slice(-20);
    const dozenCounts = { 1: 0, 2: 0, 3: 0 };

    recent.forEach(spin => {
      if (spin.dozen) dozenCounts[spin.dozen]++;
    });

    const minDozen = Object.entries(dozenCounts).reduce((min, [dozen, count]) => 
      count < dozenCounts[min as any] ? parseInt(dozen) : min, 1
    );

    if (dozenCounts[minDozen as keyof typeof dozenCounts] <= 3) {
      return {
        type: 'delayed_dozen',
        description: `${minDozen}ª dúzia atrasada (apenas ${dozenCounts[minDozen as keyof typeof dozenCounts]} nos últimos 20)`,
        confidence: 65,
        data: { dozen: minDozen, count: dozenCounts[minDozen as keyof typeof dozenCounts] },
      };
    }

    return null;
  }

  /**
   * Detecta padrões de números vizinhos
   */
  private static detectNeighborPattern(history: SpinResult[]): DetectedPattern | null {
    const recent = history.slice(-5);
    const numbers = recent.map(s => s.number);

    // Verificar se há números próximos na roda
    const rouletteOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    
    let neighborCount = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      const idx1 = rouletteOrder.indexOf(numbers[i]);
      const idx2 = rouletteOrder.indexOf(numbers[i + 1]);
      const distance = Math.abs(idx1 - idx2);
      
      if (distance <= 5 || distance >= rouletteOrder.length - 5) {
        neighborCount++;
      }
    }

    if (neighborCount >= 2) {
      return {
        type: 'neighbor_pattern',
        description: `Números vizinhos na roda saindo frequentemente`,
        confidence: 60,
        data: { neighborCount },
      };
    }

    return null;
  }

  /**
   * Detecta ciclos de paridade
   */
  private static detectParityCycle(history: SpinResult[]): DetectedPattern | null {
    const recent = history.slice(-10);
    const parities = recent.map(s => s.parity).filter(p => p !== null);

    // Verificar alternância
    let alternations = 0;
    for (let i = 0; i < parities.length - 1; i++) {
      if (parities[i] !== parities[i + 1]) {
        alternations++;
      }
    }

    const alternationRate = alternations / (parities.length - 1);

    if (alternationRate >= 0.7) {
      return {
        type: 'parity_cycle',
        description: `Alternância frequente entre par e ímpar (${Math.round(alternationRate * 100)}%)`,
        confidence: 55,
        data: { alternationRate },
      };
    }

    return null;
  }

  /**
   * Detecta setor dominante
   */
  private static detectDominantSector(history: SpinResult[]): DetectedPattern | null {
    const recent = history.slice(-20);
    const sectorCounts: { [key: string]: number } = {};

    recent.forEach(spin => {
      const sector = this.getNumberSector(spin.number);
      if (sector) {
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      }
    });

    const maxSector = Object.entries(sectorCounts).reduce((max, [sector, count]) => 
      count > (sectorCounts[max] || 0) ? sector : max, Object.keys(sectorCounts)[0]
    );

    const maxCount = sectorCounts[maxSector];

    if (maxCount >= 8) {
      return {
        type: 'dominant_sector',
        description: `Setor ${maxSector.replace('_', ' ')} quente (${maxCount} ocorrências)`,
        confidence: 70,
        data: { sector: maxSector, count: maxCount },
      };
    }

    return null;
  }

  /**
   * Analisa tendências gerais
   */
  private static analyzeTrends(history: SpinResult[]): Trend[] {
    const trends: Trend[] = [];

    // Tendência de cores
    const colorTrend = this.analyzeColorTrend(history);
    if (colorTrend) trends.push(colorTrend);

    // Tendência de dúzias
    const dozenTrend = this.analyzeDozenTrend(history);
    if (dozenTrend) trends.push(dozenTrend);

    return trends;
  }

  /**
   * Analisa tendência de cores
   */
  private static analyzeColorTrend(history: SpinResult[]): Trend | null {
    const recent = history.slice(-20);
    const colorCounts = { red: 0, black: 0, green: 0 };

    recent.forEach(spin => {
      colorCounts[spin.color]++;
    });

    const redPercentage = (colorCounts.red / recent.length) * 100;
    const blackPercentage = (colorCounts.black / recent.length) * 100;

    if (Math.abs(redPercentage - blackPercentage) >= 20) {
      const dominant = redPercentage > blackPercentage ? 'vermelho' : 'preto';
      const strength = Math.abs(redPercentage - blackPercentage);

      return {
        type: 'color_trend',
        direction: redPercentage > blackPercentage ? 'up' : 'down',
        strength,
        description: `Tendência para ${dominant} (${Math.round(Math.max(redPercentage, blackPercentage))}%)`,
      };
    }

    return null;
  }

  /**
   * Analisa tendência de dúzias
   */
  private static analyzeDozenTrend(history: SpinResult[]): Trend | null {
    const recent = history.slice(-15);
    const dozenCounts = { 1: 0, 2: 0, 3: 0 };

    recent.forEach(spin => {
      if (spin.dozen) dozenCounts[spin.dozen]++;
    });

    const maxDozen = Object.entries(dozenCounts).reduce((max, [dozen, count]) => 
      count > dozenCounts[max as any] ? parseInt(dozen) : max, 1
    );

    const maxCount = dozenCounts[maxDozen as keyof typeof dozenCounts];
    const percentage = (maxCount / recent.length) * 100;

    if (percentage >= 45) {
      return {
        type: 'dozen_trend',
        direction: 'up',
        strength: percentage - 33.33,
        description: `${maxDozen}ª dúzia dominante (${Math.round(percentage)}%)`,
      };
    }

    return null;
  }

  /**
   * Analisa frequência de números
   */
  private static analyzeNumberFrequency(history: SpinResult[]): { hot: number[], cold: number[] } {
    const recent = history.slice(-50);
    const numberCounts: { [key: number]: number } = {};

    recent.forEach(spin => {
      numberCounts[spin.number] = (numberCounts[spin.number] || 0) + 1;
    });

    const sorted = Object.entries(numberCounts)
      .map(([num, count]) => ({ number: parseInt(num), count }))
      .sort((a, b) => b.count - a.count);

    const hot = sorted.slice(0, 5).map(item => item.number);
    const cold = sorted.slice(-5).map(item => item.number);

    return { hot, cold };
  }

  /**
   * Analisa frequência de setores
   */
  private static analyzeSectorFrequency(history: SpinResult[]): { hot: string[], cold: string[] } {
    const recent = history.slice(-30);
    const sectorCounts: { [key: string]: number } = {};

    recent.forEach(spin => {
      const sector = this.getNumberSector(spin.number);
      if (sector) {
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      }
    });

    const sorted = Object.entries(sectorCounts)
      .sort((a, b) => b[1] - a[1]);

    const hot = sorted.slice(0, 2).map(item => item[0]);
    const cold = sorted.slice(-2).map(item => item[0]);

    return { hot, cold };
  }

  /**
   * Gera recomendações baseadas nos padrões e tendências
   */
  private static generateRecommendations(
    patterns: DetectedPattern[],
    trends: Trend[],
    hotNumbers: number[],
    hotSectors: string[]
  ): string[] {
    const recommendations: string[] = [];

    patterns.forEach(pattern => {
      recommendations.push(pattern.description);
    });

    trends.forEach(trend => {
      recommendations.push(trend.description);
    });

    if (hotNumbers.length > 0) {
      recommendations.push(`Números quentes: ${hotNumbers.slice(0, 3).join(', ')}`);
    }

    if (hotSectors.length > 0) {
      recommendations.push(`Setores quentes: ${hotSectors.join(', ')}`);
    }

    return recommendations.slice(0, 5); // Limitar a 5 recomendações
  }

  /**
   * Calcula nível de confiança geral
   */
  private static calculateConfidence(patterns: DetectedPattern[], trends: Trend[]): number {
    if (patterns.length === 0 && trends.length === 0) {
      return 50; // Confiança base
    }

    const patternConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length || 50;
    const trendStrength = trends.reduce((sum, t) => sum + t.strength, 0) / trends.length || 0;

    const confidence = Math.min(
      Math.round((patternConfidence + trendStrength) / 2),
      95
    );

    return Math.max(confidence, 50);
  }

  /**
   * Obtém o setor de um número
   */
  private static getNumberSector(number: number): string | null {
    for (const [sector, numbers] of Object.entries(SECTORS)) {
      if (numbers.includes(number)) {
        return sector;
      }
    }
    return null;
  }
}
