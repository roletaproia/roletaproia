import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Radio, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Target,
  Clock,
  BarChart3,
  ExternalLink
} from "lucide-react";

interface Signal {
  id: number;
  number: number;
  color: "red" | "black" | "green";
  timestamp: Date;
}

interface Recommendation {
  id: number;
  betType: string;
  confidence: number;
  suggestedAmount: number;
  strategy: string;
}

interface SessionStats {
  totalSignals: number;
  totalRecommendations: number;
  wins: number;
  losses: number;
  winRate: number;
  estimatedProfit: number;
  currentStreak: number;
}

export default function LiveSignals() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Estado dos sinais
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [previousSignal, setPreviousSignal] = useState<Signal | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [signalsHistory, setSignalsHistory] = useState<Signal[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Queries tRPC
  const latestSignalsQuery = trpc.signals.getLatestSignals.useQuery({ limit: 10 });
  const currentSignalQuery = trpc.signals.getCurrentSignal.useQuery(undefined, {
    refetchInterval: 2000, // Atualizar a cada 2 segundos
  });
  const statsQuery = trpc.signals.getSessionStats.useQuery(undefined, {
    refetchInterval: 5000, // Atualizar a cada 5 segundos
  });

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Atualizar sinais quando query retornar dados
  useEffect(() => {
    if (currentSignalQuery.data) {
      const { signal, recommendation: rec } = currentSignalQuery.data;
      
      // Se houver um sinal atual e for diferente do anterior
      if (signal && signal.id !== currentSignal?.id) {
        setPreviousSignal(currentSignal);
        setCurrentSignal(signal);
        setRecommendation(rec);
        setIsConnected(true);
      }
    }
  }, [currentSignalQuery.data]);

  // Atualizar histórico
  useEffect(() => {
    if (latestSignalsQuery.data) {
      setSignalsHistory(latestSignalsQuery.data);
    }
  }, [latestSignalsQuery.data]);

  // Atualizar estatísticas
  useEffect(() => {
    if (statsQuery.data) {
      setStats(statsQuery.data);
    }
  }, [statsQuery.data]);

  // Função para obter cor do número
  const getNumberColor = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-600 text-white";
      case "black":
        return "bg-gray-900 text-white";
      case "green":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Função para formatar valor em reais
  const formatCurrency = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2)}`;
  };

  // Função para obter tempo relativo
  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000);
    
    if (diff < 10) return "Agora mesmo";
    if (diff < 60) return `Há ${diff} segundos`;
    if (diff < 3600) return `Há ${Math.floor(diff / 60)} minutos`;
    return `Há ${Math.floor(diff / 3600)} horas`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-yellow-400 flex items-center gap-2">
              <Radio className="h-8 w-8 animate-pulse" />
              🤖 Sinais Inteligentes
            </h1>
            <p className="text-gray-200">Análise em tempo real com Inteligência Artificial</p>
          </div>
          <Badge 
            variant={isConnected ? "default" : "secondary"} 
            className={isConnected ? "bg-red-600 animate-pulse" : ""}
          >
            {isConnected ? "🔴 AO VIVO" : "⚪ Aguardando..."}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Banner 1win */}
        <Alert className="bg-gradient-to-r from-yellow-900/30 to-red-900/30 border-yellow-600/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <AlertTitle className="text-yellow-400 text-lg font-bold mb-2">
                🎁 Cadastre-se na 1win com Bônus Exclusivo
              </AlertTitle>
              <AlertDescription className="text-gray-200">
                <div className="space-y-2 mb-3">
                  <p>✅ Nossa I.A. tem <strong className="text-green-400">78% de acerto</strong> nesta casa!</p>
                  <p>✅ Bônus de boas-vindas de até <strong className="text-yellow-400">R$ 500</strong></p>
                  <p>✅ Saque rápido via <strong className="text-green-400">PIX</strong></p>
                </div>
                <Button
                  onClick={() => window.open('https://1wyvrz.life/?open=register&p=f5q8', '_blank')}
                  className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-bold"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Cadastrar Agora com Bônus
                </Button>
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Resultados */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resultado Anterior */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-transparent border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  📊 Resultado Anterior
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previousSignal ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${getNumberColor(previousSignal.color)}`}>
                        {previousSignal.number}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Número</p>
                        <p className="text-2xl font-bold">{previousSignal.number}</p>
                        <p className="text-sm text-gray-400 capitalize">
                          {previousSignal.color === "red" ? "Vermelho" : previousSignal.color === "black" ? "Preto" : "Verde"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Há</p>
                      <p className="text-lg">{previousSignal.timestamp ? getRelativeTime(previousSignal.timestamp) : "N/A"}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Aguardando primeiro resultado...</p>
                )}
              </CardContent>
            </Card>

            {/* Resultado Atual */}
            <Card className="bg-gradient-to-br from-red-900/30 to-transparent border-red-700/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="h-6 w-6 text-red-500" />
                  🎯 Resultado Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentSignal ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold ${getNumberColor(currentSignal.color)} shadow-lg`}>
                        {currentSignal.number}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Número</p>
                        <p className="text-3xl font-bold">{currentSignal.number}</p>
                        <p className="text-lg text-gray-300 capitalize">
                          {currentSignal.color === "red" ? "Vermelho" : currentSignal.color === "black" ? "Preto" : "Verde"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-600 text-white">
                        {currentSignal.timestamp ? getRelativeTime(currentSignal.timestamp) : "Agora"}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-12">
                    <Radio className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                    Aguardando sinal ao vivo...
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recomendação da I.A. */}
            <Card className="bg-gradient-to-br from-yellow-900/30 to-transparent border-yellow-700/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  🔮 Próxima Jogada - Indicação I.A.
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendation ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/30">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">💎 Aposte em:</p>
                        <p className="text-3xl font-bold text-yellow-400 uppercase">{recommendation.betType === "red" ? "VERMELHO" : recommendation.betType === "black" ? "PRETO" : recommendation.betType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400 mb-1">📊 Confiança da I.A.:</p>
                        <p className="text-3xl font-bold text-green-400">{recommendation.confidence}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-sm text-gray-400">💰 Valor sugerido</p>
                        <p className="text-xl font-bold">{formatCurrency(recommendation.suggestedAmount)}</p>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-sm text-gray-400">🎲 Tipo de aposta</p>
                        <p className="text-xl font-bold capitalize">{recommendation.betType === "red" ? "Vermelho" : recommendation.betType === "black" ? "Preto" : recommendation.betType}</p>
                      </div>
                    </div>

                    <Alert className="bg-blue-900/20 border-blue-700/50">
                      <Target className="h-4 w-4" />
                      <AlertDescription>
                        <p className="text-sm">
                          <strong>Estratégia:</strong> {recommendation.strategy === "color_balance" ? "Equalização de Cores" : recommendation.strategy}
                        </p>
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Aguardando recomendação...</p>
                )}
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-transparent border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  📈 Histórico (Últimos 10 resultados)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {signalsHistory.length > 0 ? (
                    signalsHistory.map((signal) => (
                      <div
                        key={signal.id}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getNumberColor(signal.color)}`}
                        title={`${signal.number} - ${signal.color === "red" ? "Vermelho" : signal.color === "black" ? "Preto" : "Verde"}`}
                      >
                        {signal.number}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center w-full py-4">Nenhum histórico disponível</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Estatísticas */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-900/30 to-transparent border-green-700/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  📊 Performance do Robô Hoje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">✅ Acertos:</span>
                        <span className="text-xl font-bold text-green-400">
                          {stats.wins} ({stats.totalRecommendations > 0 ? Math.round((stats.wins / stats.totalRecommendations) * 100) : 0}%)
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">❌ Erros:</span>
                        <span className="text-xl font-bold text-red-400">
                          {stats.losses} ({stats.totalRecommendations > 0 ? Math.round((stats.losses / stats.totalRecommendations) * 100) : 0}%)
                        </span>
                      </div>

                      <div className="h-px bg-gray-700"></div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">💰 Lucro estimado:</span>
                        <span className={`text-2xl font-bold ${stats.estimatedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stats.estimatedProfit >= 0 ? '+' : ''}{formatCurrency(stats.estimatedProfit)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">🎯 Taxa de acerto:</span>
                        <span className="text-2xl font-bold text-yellow-400">
                          {stats.winRate}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">🔥 Sequência atual:</span>
                        <span className={`text-xl font-bold ${stats.currentStreak > 0 ? 'text-green-400' : stats.currentStreak < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                          {stats.currentStreak > 0 ? `${stats.currentStreak} wins` : stats.currentStreak < 0 ? `${Math.abs(stats.currentStreak)} losses` : 'N/A'}
                        </span>
                      </div>

                      <div className="h-px bg-gray-700"></div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">📡 Sinais recebidos:</span>
                        <span className="text-xl font-bold">{stats.totalSignals}</span>
                      </div>
                    </div>

                    {/* Barra de progresso de winrate */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="text-gray-300">{stats.winRate}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-600 to-yellow-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stats.winRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center py-8">Carregando estatísticas...</p>
                )}
              </CardContent>
            </Card>

            {/* Informações */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-transparent border-blue-700/50">
              <CardHeader>
                <CardTitle className="text-lg">ℹ️ Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-300">
                <p>1. 📡 Nosso sistema captura números em tempo real da roleta 1win</p>
                <p>2. 🤖 A I.A. analisa padrões e gera recomendações</p>
                <p>3. 💎 Você recebe sinais com nível de confiança</p>
                <p>4. 🎯 Execute as apostas manualmente na 1win</p>
                <p className="text-yellow-400 font-bold mt-4">⚠️ Aposte com responsabilidade!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

