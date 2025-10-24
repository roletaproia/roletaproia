import type { StrategyType, FibonacciConfig, MartingaleConfig, DalembertConfig, LabouchereConfig } from "../../shared/strategyTypes";

/**
 * Motor de Estratégias de Apostas
 * Implementa a lógica de cada tipo de estratégia
 */

export interface StrategyState {
  currentBet: number;
  losses: number;
  wins: number;
  totalProfit: number;
  sequenceIndex?: number;
  sequence?: number[];
  lastAction?: "win" | "loss";
}

export class StrategyEngine {
  private state: StrategyState;
  private baseBet: number;
  private config: any;
  private strategyType: StrategyType;

  constructor(
    strategyType: StrategyType,
    baseBet: number,
    configJson?: string
  ) {
    this.strategyType = strategyType;
    this.baseBet = baseBet;
    this.config = configJson ? JSON.parse(configJson) : {};
    this.state = {
      currentBet: baseBet,
      losses: 0,
      wins: 0,
      totalProfit: 0,
    };
  }

  /**
   * Calcula a próxima aposta baseado na estratégia
   */
  getNextBet(lastResult?: "win" | "loss"): number {
    if (lastResult) {
      this.recordResult(lastResult);
    }

    switch (this.strategyType) {
      case "fibonacci":
        return this.getFibonacciBet();
      case "martingale":
        return this.getMartingaleBet();
      case "reverseMartingale":
        return this.getReverseMartingaleBet();
      case "dalembert":
        return this.getDalembertBet();
      case "labouchere":
        return this.getLabouchiereBet();
      case "flatBetting":
        return this.getFlatBettingBet();
      case "custom":
      default:
        return this.state.currentBet;
    }
  }

  /**
   * Fibonacci Strategy
   * Sequência: 1, 1, 2, 3, 5, 8, 13, 21...
   */
  private getFibonacciBet(): number {
    const config = this.config as Partial<FibonacciConfig>;
    const resetOnWin = config.resetOnWin ?? true;

    // Inicializar sequência se necessário
    if (!this.state.sequence) {
      this.state.sequence = [1, 1];
      this.state.sequenceIndex = 0;
    }

    // Se ganhou e resetOnWin está ativado, volta ao início
    if (this.state.lastAction === "win" && resetOnWin) {
      this.state.sequenceIndex = 0;
      this.state.currentBet = this.baseBet * this.state.sequence[0];
      return this.state.currentBet;
    }

    // Se perdeu, avança na sequência
    if (this.state.lastAction === "loss") {
      this.state.sequenceIndex = (this.state.sequenceIndex || 0) + 1;

      // Gera a sequência até o índice necessário
      while (this.state.sequence!.length <= this.state.sequenceIndex!) {
        const len = this.state.sequence!.length;
        this.state.sequence!.push(
          this.state.sequence![len - 1] + this.state.sequence![len - 2]
        );
      }
    }

    const sequenceValue = this.state.sequence[this.state.sequenceIndex || 0];
    this.state.currentBet = this.baseBet * sequenceValue;
    return this.state.currentBet;
  }

  /**
   * Martingale Strategy
   * Dobra a aposta após cada perda
   */
  private getMartingaleBet(): number {
    const config = this.config as Partial<MartingaleConfig>;
    const multiplier = config.multiplier ?? 2.0;
    const maxSteps = config.maxSteps ?? 5;

    // Se ganhou, volta ao valor base
    if (this.state.lastAction === "win") {
      this.state.currentBet = this.baseBet;
      this.state.losses = 0;
      return this.state.currentBet;
    }

    // Se perdeu e não atingiu o limite, multiplica
    if (this.state.lastAction === "loss" && this.state.losses < maxSteps) {
      this.state.currentBet = Math.floor(this.state.currentBet * multiplier);
      return this.state.currentBet;
    }

    // Se atingiu o limite, reseta
    if (this.state.losses >= maxSteps) {
      this.state.currentBet = this.baseBet;
      this.state.losses = 0;
    }

    return this.state.currentBet;
  }

  /**
   * D'Alembert Strategy
   * Aumenta/diminui em uma unidade
   */
  private getDalembertBet(): number {
    const config = this.config as Partial<DalembertConfig>;
    const unitAmount = config.unitAmount ?? 1;
    const maxBetLimit = config.maxBetLimit ?? 1000;

    // Se ganhou, diminui a aposta
    if (this.state.lastAction === "win") {
      this.state.currentBet = Math.max(this.baseBet, this.state.currentBet - unitAmount);
      return this.state.currentBet;
    }

    // Se perdeu, aumenta a aposta (até o limite)
    if (this.state.lastAction === "loss") {
      this.state.currentBet = Math.min(maxBetLimit, this.state.currentBet + unitAmount);
      return this.state.currentBet;
    }

    return this.state.currentBet;
  }

  /**
   * Reverse Martingale Strategy (Paroli)
   * Aumenta a aposta após cada vitória
   */
  private getReverseMartingaleBet(): number {
    const config = this.config as Partial<any>;
    const multiplier = config.multiplier ?? 2.0;
    const maxWins = config.maxWins ?? 3;

    // Se perdeu, volta ao valor base
    if (this.state.lastAction === "loss") {
      this.state.currentBet = this.baseBet;
      this.state.wins = 0;
      return this.state.currentBet;
    }

    // Se ganhou e não atingiu o limite, multiplica
    if (this.state.lastAction === "win" && this.state.wins < maxWins) {
      this.state.currentBet = Math.floor(this.state.currentBet * multiplier);
      return this.state.currentBet;
    }

    // Se atingiu o limite de vitórias, reseta
    if (this.state.wins >= maxWins) {
      this.state.currentBet = this.baseBet;
      this.state.wins = 0;
    }

    return this.state.currentBet;
  }

  /**
   * Labouchère Strategy
   * Usa uma sequência customizada
   */
  private getLabouchiereBet(): number {
    const config = this.config as Partial<LabouchereConfig>;
    const initialSequence = config.initialSequence ?? [1, 2, 3];
    const maxLosses = config.maxLosses ?? 10;

    // Inicializar sequência se necessário
    if (!this.state.sequence) {
      this.state.sequence = [...initialSequence];
      this.state.sequenceIndex = 0;
    }

    // Se ganhou, remove o primeiro e último número da sequência
    if (this.state.lastAction === "win") {
      if (this.state.sequence!.length > 0) {
        this.state.sequence!.shift(); // Remove primeiro
        this.state.sequence!.pop(); // Remove último
      }

      // Se sequência vazia, reseta
      if (this.state.sequence!.length === 0) {
        this.state.sequence = [...initialSequence];
        this.state.losses = 0;
      }
    }

    // Se perdeu e atingiu limite, reseta
    if (this.state.lastAction === "loss" && this.state.losses >= maxLosses) {
      this.state.sequence = [...initialSequence];
      this.state.losses = 0;
    }

    // Calcula a aposta: soma do primeiro e último número
    if (this.state.sequence!.length === 0) {
      this.state.currentBet = this.baseBet;
    } else if (this.state.sequence!.length === 1) {
      this.state.currentBet = this.baseBet * this.state.sequence![0];
    } else {
      const first = this.state.sequence![0];
      const last = this.state.sequence![this.state.sequence!.length - 1];
      this.state.currentBet = this.baseBet * (first + last);
    }

    return this.state.currentBet;
  }

  /**
   * Flat Betting Strategy (Aposta Fixa)
   * Aposta sempre o mesmo valor
   */
  private getFlatBettingBet(): number {
    // Aposta sempre o mesmo valor (baseBet)
    this.state.currentBet = this.baseBet;
    return this.state.currentBet;
  }

  /**
   * Registra o resultado de uma aposta
   */
  private recordResult(result: "win" | "loss"): void {
    this.state.lastAction = result;

    if (result === "win") {
      this.state.wins++;
      this.state.losses = 0;
      this.state.totalProfit += this.state.currentBet;
    } else {
      this.state.losses++;
      this.state.totalProfit -= this.state.currentBet;
    }
  }

  /**
   * Retorna o estado atual da estratégia
   */
  getState(): StrategyState {
    return { ...this.state };
  }

  /**
   * Reseta a estratégia ao estado inicial
   */
  reset(): void {
    this.state = {
      currentBet: this.baseBet,
      losses: 0,
      wins: 0,
      totalProfit: 0,
    };
  }

  /**
   * Define o estado da estratégia (para carregar estado anterior)
   */
  setState(state: StrategyState): void {
    this.state = { ...state };
  }
}

/**
 * Simula uma série de apostas com a estratégia
 */
export function simulateStrategy(
  strategyType: StrategyType,
  baseBet: number,
  configJson: string | undefined,
  results: Array<"win" | "loss">,
  initialState?: StrategyState
): StrategyState {
  const engine = new StrategyEngine(strategyType, baseBet, configJson);

  if (initialState) {
    engine.setState(initialState);
  }

  for (const result of results) {
    engine.getNextBet(result);
  }

  return engine.getState();
}

