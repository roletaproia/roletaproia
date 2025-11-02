import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface ResultAnalysisProps {
  lastResult: {
    isWin: boolean;
    amount: number;
    number: number;
    color: string;
  } | null;
  currentBalance: number;
  strategy: {
    name: string;
    type: string;
    baseBetAmount: number;
    config?: any;
  } | null;
  galeCount: number;
}

export default function ResultAnalysis({
  lastResult,
  currentBalance,
  strategy,
  galeCount,
}: ResultAnalysisProps) {
  if (!lastResult || !strategy) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-blue-900/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            📊 Análise do Resultado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Aguardando primeiro resultado...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { isWin, amount, number, color } = lastResult;

  // Calcular próxima ação baseada na estratégia
  const getNextAction = () => {
    if (isWin) {
      return {
        action: "Voltar para aposta base",
        nextAmount: strategy.baseBetAmount / 100,
        message: "✨ Continue com a estratégia atual",
        color: "text-green-400",
        icon: <TrendingUp className="w-5 h-5" />,
      };
    }

    // Lógica de Martingale
    if (strategy.type === "martingale") {
      const nextAmount = (strategy.baseBetAmount / 100) * Math.pow(2, galeCount + 1);
      const maxGale = strategy.config?.maxGale || 3;

      if (galeCount >= maxGale) {
        return {
          action: "⚠️ Limite de Gale atingido",
          nextAmount: strategy.baseBetAmount / 100,
          message: "Voltar para aposta base e aguardar nova oportunidade",
          color: "text-red-400",
          icon: <AlertCircle className="w-5 h-5" />,
        };
      }

      return {
        action: `Dobrar aposta (Gale ${galeCount + 1}/${maxGale})`,
        nextAmount,
        message: `🎲 Apostar na mesma cor: ${color === "red" ? "Vermelho" : "Preto"}`,
        color: "text-yellow-400",
        icon: <TrendingDown className="w-5 h-5" />,
      };
    }

    // Lógica de D'Alembert
    if (strategy.type === "dalembert") {
      const nextAmount = (strategy.baseBetAmount / 100) + ((galeCount + 1) * 1);
      return {
        action: "Aumentar aposta em 1 unidade",
        nextAmount,
        message: "📈 D'Alembert: progressão suave",
        color: "text-blue-400",
        icon: <TrendingDown className="w-5 h-5" />,
      };
    }

    // Lógica de Fibonacci
    if (strategy.type === "fibonacci") {
      const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
      const nextFibIndex = Math.min(galeCount + 1, fib.length - 1);
      const nextAmount = (strategy.baseBetAmount / 100) * fib[nextFibIndex];
      
      return {
        action: `Fibonacci: próximo valor (${fib[nextFibIndex]}x)`,
        nextAmount,
        message: "🔢 Seguir sequência de Fibonacci",
        color: "text-purple-400",
        icon: <TrendingDown className="w-5 h-5" />,
      };
    }

    // Aposta Fixa
    return {
      action: "Manter aposta base",
      nextAmount: strategy.baseBetAmount / 100,
      message: "💰 Aposta fixa: sem progressão",
      color: "text-gray-400",
      icon: <TrendingDown className="w-5 h-5" />,
    };
  };

  const nextAction = getNextAction();

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-blue-900/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          📊 Análise do Resultado Anterior
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resultado */}
        <div
          className={`${
            isWin
              ? "bg-green-900/30 border-green-600/50"
              : "bg-red-900/30 border-red-600/50"
          } border rounded-lg p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">
              {isWin ? "✅ VITÓRIA!" : "❌ DERROTA"}
            </span>
            <span
              className={`text-2xl font-bold ${
                isWin ? "text-green-400" : "text-red-400"
              }`}
            >
              {isWin ? "+" : "-"}R$ {Math.abs(amount).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>Número sorteado:</span>
            <div
              className={`${
                color === "red"
                  ? "bg-red-500"
                  : color === "black"
                  ? "bg-gray-900"
                  : "bg-green-500"
              } text-white font-bold px-3 py-1 rounded`}
            >
              {number}
            </div>
          </div>
        </div>

        {/* Saldo Atual */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">💰 Saldo Atual:</span>
            <span className="text-2xl font-bold text-white">
              R$ {currentBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Próxima Ação */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-4 border border-blue-600/30">
          <h3 className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wide flex items-center gap-2">
            {nextAction.icon}
            🤖 Próxima Ação Recomendada
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Ação:</span>
              <Badge className={`${nextAction.color} bg-slate-700`}>
                {nextAction.action}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Próxima aposta:</span>
              <span className="text-xl font-bold text-yellow-400">
                R$ {nextAction.nextAmount.toFixed(2)}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded p-2">
              <p className="text-sm text-gray-300">{nextAction.message}</p>
            </div>
          </div>
        </div>

        {/* Contador de Gale */}
        {galeCount > 0 && (
          <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-orange-300 text-sm">
                ⚠️ Gale Atual:
              </span>
              <span className="text-xl font-bold text-orange-400">
                {galeCount} / {strategy.config?.maxGale || 3}
              </span>
            </div>
          </div>
        )}

        {/* Estratégia Ativa */}
        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">📋 Estratégia Ativa:</span>
            <span className="text-white font-semibold">{strategy.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
