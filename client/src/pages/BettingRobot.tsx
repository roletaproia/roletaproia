import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Pause, RotateCcw, TrendingUp, Zap } from "lucide-react";

export default function BettingRobot() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState({
    initialBet: "10",
    maxRounds: "10",
    stopLoss: "100",
    stopWin: "100",
  });

  const strategiesQuery = trpc.strategies.list.useQuery();
  const strategies = strategiesQuery.data || [];

  const placeBetMutation = trpc.bets.create.useMutation();
  const bankrollQuery = trpc.bankroll.get.useQuery();
  const betsQuery = trpc.bets.getHistory.useQuery({ limit: 50 });

  const bankroll = bankrollQuery.data;
  const bets = betsQuery.data || [];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleStartRobot = async () => {
    if (!selectedStrategy || !bankroll) return;

    setIsRunning(true);
    const initialBet = parseInt(config.initialBet) * 100;
    const maxRounds = parseInt(config.maxRounds);

    try {
      for (let i = 0; i < maxRounds; i++) {
        if (!isRunning) break;

        // Simular aposta
        const result = Math.random() > 0.5 ? "win" : "loss";
        const multiplier = result === "win" ? 2 : 0;

        await placeBetMutation.mutateAsync({
          strategyId: parseInt(selectedStrategy),
          betAmount: initialBet,
          result: result,
          payout: initialBet * multiplier,
        });

        // Aguardar 2 segundos entre apostas
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error("Erro ao executar robô:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStopRobot = () => {
    setIsRunning(false);
  };

  const handleResetConfig = () => {
    setConfig({
      initialBet: "10",
      maxRounds: "10",
      stopLoss: "100",
      stopWin: "100",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 p-6">
        <h1 className="text-3xl font-bold mb-2">Robô de Apostas</h1>
        <p className="text-gray-400">Configure e execute apostas automáticas com suas estratégias</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Status Card */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <CardTitle>Status do Robô</CardTitle>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isRunning ? "bg-green-900/30 text-green-300" : "bg-gray-900/30 text-gray-300"
              }`}>
                {isRunning ? "🟢 Em Execução" : "⚪ Parado"}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Saldo Atual</p>
                <p className="text-2xl font-bold text-green-400">
                  R$ {bankroll ? (bankroll.currentBalance / 100).toFixed(2) : "0.00"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Apostas Realizadas</p>
                <p className="text-2xl font-bold text-blue-400">{bets?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Taxa de Vitória</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {bets && bets.length > 0 ? ((bets.filter((b: any) => b.result === "win").length / bets.length) * 100).toFixed(1) : "0"}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Card */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <CardTitle>Configuração do Robô</CardTitle>
            <CardDescription>Defina os parâmetros para executar apostas automáticas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estratégia */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Estratégia</label>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy} disabled={isRunning}>
                <SelectTrigger className="bg-slate-800 border-red-700/30">
                  <SelectValue placeholder="Selecione uma estratégia" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-red-700/30">
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id.toString()}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {strategies.length === 0 && (
                <p className="text-sm text-yellow-400 mt-2">
                  Você precisa criar uma estratégia primeiro. <a href="/strategies" className="underline">Criar estratégia</a>
                </p>
              )}
            </div>

            {/* Initial Bet */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Aposta Inicial (R$)</label>
              <Input
                type="number"
                value={config.initialBet}
                onChange={(e) => setConfig({ ...config, initialBet: e.target.value })}
                placeholder="10"
                className="bg-slate-800 border-red-700/30"
                disabled={isRunning}
                min="1"
              />
            </div>

            {/* Max Rounds */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Número de Rodadas</label>
              <Input
                type="number"
                value={config.maxRounds}
                onChange={(e) => setConfig({ ...config, maxRounds: e.target.value })}
                placeholder="10"
                className="bg-slate-800 border-red-700/30"
                disabled={isRunning}
                min="1"
              />
            </div>

            {/* Stop Loss */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Stop Loss (R$)</label>
              <Input
                type="number"
                value={config.stopLoss}
                onChange={(e) => setConfig({ ...config, stopLoss: e.target.value })}
                placeholder="100"
                className="bg-slate-800 border-red-700/30"
                disabled={isRunning}
                min="0"
              />
            </div>

            {/* Stop Win */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Stop Win (R$)</label>
              <Input
                type="number"
                value={config.stopWin}
                onChange={(e) => setConfig({ ...config, stopWin: e.target.value })}
                placeholder="100"
                className="bg-slate-800 border-red-700/30"
                disabled={isRunning}
                min="0"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 pt-4">
              {!isRunning ? (
                <>
                  <Button
                    onClick={handleStartRobot}
                    disabled={!selectedStrategy || !bankroll}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Robô
                  </Button>
                  <Button
                    onClick={handleResetConfig}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Resetar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleStopRobot}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Parar Robô
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bets */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-red-400" />
                <CardTitle>Últimas Apostas</CardTitle>
              </div>
              <Button variant="outline" size="sm">Ver Todas</Button>
            </div>
          </CardHeader>
          <CardContent>
            {bets && bets.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {bets && bets.slice(0, 10).map((bet: any) => (
                  <div key={bet.id} className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg">
                    <div>
                      <p className="font-medium">
                        R$ {(bet.betAmount / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(bet.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${bet.result === "win" ? "text-green-400" : "text-red-400"}`}>
                        {bet.result === "win" ? "✓ Ganho" : "✗ Perda"}
                      </p>
                      <p className="text-sm text-gray-400">
                        R$ {(bet.payout / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Nenhuma aposta realizada ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

