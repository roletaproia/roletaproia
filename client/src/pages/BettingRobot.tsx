import { useState, useEffect } from "react";
import { useLocation } from "wouter";

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Play, Pause, RotateCcw, TrendingUp, Zap, Download, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

// Tipos da extensão
declare global {
  interface Window {
    roletaProExtension?: {
      isInstalled: boolean;
      version: string;
      startMonitoring: () => void;
      stopMonitoring: () => void;
      placeBet: (betData: any) => void;
      getStatus: () => Promise<any>;
    };
  }
}

export default function BettingRobot() {
  const [, navigate] = useLocation();
  const isAuthenticated = true; // Mock as authenticated for public access

  // Estado da extensão
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState<any>(null);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [numbersHistory, setNumbersHistory] = useState<number[]>([]);

  // Estado do robô
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"simulation" | "real">("simulation");
  const [config, setConfig] = useState({
    initialBet: "10",
    maxRounds: "10",
    stopLoss: "100",
    stopWin: "100",
    betType: "color" as "color" | "even_odd" | "dozen" | "number",
    betValue: "red",
  });

  const strategiesQuery = trpc.strategies.list.useQuery();
  const strategies = strategiesQuery.data || [];

  const placeBetMutation = trpc.bets.create.useMutation();
  const bankrollQuery = trpc.bankroll.get.useQuery();
  const betsQuery = trpc.bets.getHistory.useQuery({ limit: 50 });

  const bankroll = bankrollQuery.data;
  const bets = betsQuery.data || [];



  // Verificar se extensão está instalada
  useEffect(() => {
    const checkExtension = () => {
      if (window.roletaProExtension?.isInstalled) {
        setExtensionInstalled(true);
        console.log('[Roleta Pro I.A.] Extensão detectada!', window.roletaProExtension.version);
      } else {
        setExtensionInstalled(false);
      }
    };

    // Verificar imediatamente
    checkExtension();

    // Escutar evento de extensão pronta
    window.addEventListener('roletaproia-extension-ready', checkExtension);

    // Verificar novamente após 1 segundo
    const timeout = setTimeout(checkExtension, 1000);

    return () => {
      window.removeEventListener('roletaproia-extension-ready', checkExtension);
      clearTimeout(timeout);
    };
  }, []);

  // Escutar novos números da extensão
  useEffect(() => {
    const handleNewNumber = (event: MessageEvent) => {
      if (event.data.source === 'roletaproia-extension' && event.data.type === 'NEW_NUMBER') {
        const { number, timestamp } = event.data.data;
        console.log('[Roleta Pro I.A.] Novo número recebido:', number);
        
        setLastNumber(number);
        setNumbersHistory(prev => [number, ...prev].slice(0, 20));

        // Se robô estiver rodando, processar aposta
        if (isRunning) {
          processNewNumber(number);
        }
      }
    };

    window.addEventListener('message', handleNewNumber);
    return () => window.removeEventListener('message', handleNewNumber);
  }, [isRunning, selectedStrategy]);

  // Atualizar status da extensão periodicamente
  useEffect(() => {
    if (!extensionInstalled || !window.roletaProExtension) return;

    const updateStatus = async () => {
      try {
        const status = await window.roletaProExtension!.getStatus();
        setExtensionStatus(status);
      } catch (error) {
        console.error('[Roleta Pro I.A.] Erro ao obter status:', error);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, [extensionInstalled]);

  // Processar novo número e fazer aposta
  const processNewNumber = async (number: number) => {
    if (!selectedStrategy || !bankroll) return;

    try {
      if (mode === "simulation") {
        // Modo Simulação: Usa API do robô
        const result = await fetch('/api/trpc/robot.processNumber', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            number,
            strategyId: parseInt(selectedStrategy),
            config: {
              initialBet: parseInt(config.initialBet) * 100,
              stopLoss: parseInt(config.stopLoss),
              stopWin: parseInt(config.stopWin),
              betType: config.betType,
              betValue: config.betValue,
            },
          }),
        });

        const data = await result.json();
        console.log('[Roleta Pro I.A.] Aposta simulada:', data);

        if (data.shouldStop) {
          handleStopRobot();
          alert(data.error);
        }
      } else {
        // Modo Real: Executa aposta na 1win via extensão
        if (window.roletaProExtension) {
          window.roletaProExtension.placeBet({
            betType: config.betType,
            betValue: config.betValue,
            amount: parseInt(config.initialBet) * 100,
          });
        }
      }

      // Atualizar queries
      bankrollQuery.refetch();
      betsQuery.refetch();
    } catch (error) {
      console.error('[Roleta Pro I.A.] Erro ao processar aposta:', error);
    }
  };

  // Iniciar robô
  const handleStartRobot = async () => {
    if (!selectedStrategy || !bankroll) {
      alert('Selecione uma estratégia e verifique seu saldo!');
      return;
    }

    if (!extensionInstalled || !window.roletaProExtension) {
      alert('Extensão não instalada! Instale a extensão primeiro.');
      return;
    }

    try {
      // Iniciar monitoramento na extensão
      window.roletaProExtension.startMonitoring();
      setIsRunning(true);
      console.log('[Roleta Pro I.A.] Robô iniciado!');
    } catch (error) {
      console.error('[Roleta Pro I.A.] Erro ao iniciar robô:', error);
      alert('Erro ao iniciar robô. Verifique se a aba da 1win está aberta.');
    }
  };

  // Parar robô
  const handleStopRobot = () => {
    if (window.roletaProExtension) {
      window.roletaProExtension.stopMonitoring();
    }
    setIsRunning(false);
    console.log('[Roleta Pro I.A.] Robô parado!');
  };

  // Resetar configuração
  const handleResetConfig = () => {
    setConfig({
      initialBet: "10",
      maxRounds: "10",
      stopLoss: "100",
      stopWin: "100",
    });
  };

  const handleDownloadExtension = () => {
    window.location.href = "/extension-download";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 p-6">
        <h1 className="text-3xl font-bold mb-2 text-yellow-400">🤖 Robô de Apostas Automático</h1>
        <p className="text-gray-200">Conecte com a 1win e execute apostas automáticas com suas estratégias</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Alerta de Extensão */}
        {!extensionInstalled && (
          <Alert className="bg-yellow-900/20 border-yellow-700/50">
            <Download className="h-4 w-4" />
            <AlertTitle>Extensão Necessária</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>Para usar o robô automático, você precisa instalar a extensão do Chrome.</p>
              <div className="flex gap-2">
                <Button onClick={handleDownloadExtension} className="bg-yellow-600 hover:bg-yellow-700">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Extensão
                </Button>
                <Button variant="outline" asChild>
                  <a href="/extension-guide" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Instruções
                  </a>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Banner de Afiliado 1win */}
        <Alert className="bg-gradient-to-r from-yellow-900/30 to-red-900/30 border-yellow-600/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <AlertTitle className="text-yellow-400 text-lg font-bold mb-2">
                Nao tem conta na 1win?
              </AlertTitle>
              <AlertDescription className="text-gray-200">
                <p className="mb-3">
                  O robo funciona exclusivamente com a <strong className="text-yellow-400">Roleta Brasileira da 1win</strong>.
                  Crie sua conta agora e ganhe <strong className="text-green-400">bonus de boas-vindas</strong>!
                </p>
                <Button
                  onClick={() => window.open('https://1wyvrz.life/?open=register&p=f5q8', '_blank')}
                  className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-bold"
                >
                  Criar Conta na 1win (Com Bonus)
                </Button>
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {extensionInstalled && (
          <Alert className="bg-green-900/20 border-green-700/50">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Extensão Conectada</AlertTitle>
            <AlertDescription>
              <p>Versão: {window.roletaProExtension?.version}</p>
              {extensionStatus && (
                <p className="text-sm mt-1">
                  Status: {extensionStatus.isMonitoring ? '🟢 Monitorando' : '⚪ Parado'} | 
                  Último número: {extensionStatus.lastNumber || 'N/A'}
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Status Card */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <CardTitle className="text-white">Status do Robô</CardTitle>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isRunning ? "bg-green-900/30 text-green-300" : "bg-gray-900/30 text-gray-300"
              }`}>
                {isRunning ? "🟢 Em Execução" : "⚪ Parado"}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-200 text-sm">Saldo Atual</p>
                <p className="text-2xl font-bold text-green-400">
                  R$ {bankroll ? (bankroll.currentBalance / 100).toFixed(2) : "0.00"}
                </p>
              </div>
              <div>
                <p className="text-gray-200 text-sm">Apostas Realizadas</p>
                <p className="text-2xl font-bold text-blue-400">{bets?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-200 text-sm">Taxa de Vitória</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {bets && bets.length > 0 ? ((bets.filter((b: any) => b.result === "win").length / bets.length) * 100).toFixed(1) : "0"}%
            {/* Input Manual de Número (Mobile/Desktop) */}
            {isRunning && (
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Adicionar Número Manualmente (Mobile)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0-36"
                    min="0"
                    max="36"
                    className="bg-slate-800 border-blue-700/30"
                    id="manualNumberInput"
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById('manualNumberInput') as HTMLInputElement;
                      const num = parseInt(input.value);
                      if (num >= 0 && num <= 36) {
                        processNewNumber(num);
                        input.value = '';
                      } else {
                        alert('Digite um número entre 0 e 36');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Adicionar
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Use se estiver no celular ou sem extensão
                </p>
              </div>
            )}
                </p>
              </div>
              <div>
                <p className="text-gray-200 text-sm">Último Número</p>
                <p className="text-2xl font-bold text-purple-400">
                  {lastNumber !== null ? lastNumber : "-"}
                </p>
              </div>
            </div>

            {/* Histórico de números */}
            {numbersHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-red-700/30">
                <p className="text-gray-200 text-sm mb-2">Últimos 10 números:</p>
                <div className="flex gap-2 flex-wrap">
                  {numbersHistory.slice(0, 10).map((num, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center font-bold">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Card */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <CardTitle className="text-white">Configuração do Robô</CardTitle>
            <CardDescription>Defina os parâmetros para executar apostas automáticas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Modo de Operação */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Modo de Operação</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() => setMode("simulation")}
                  disabled={isRunning}
                  className={`${
                    mode === "simulation"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  🎮 Simulação
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (confirm('⚠️ ATENÇÃO: Modo Real usa dinheiro de verdade! Tem certeza?')) {
                      setMode("real");
                    }
                  }}
                  disabled={isRunning}
                  className={`${
                    mode === "real"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  💰 Real
                </Button>
              </div>
              {mode === "simulation" && (
                <p className="text-sm text-blue-400 mt-2">
                  ✅ Modo seguro: Usa saldo virtual, captura números reais
                </p>
              )}
              {mode === "real" && (
                <p className="text-sm text-red-400 mt-2">
                  ⚠️ Cuidado: Apostas reais serão executadas na 1win!
                </p>
              )}
            </div>

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
                      {strategy.name} ({strategy.type})
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

            {/* Tipo de Aposta */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Tipo de Aposta</label>
              <Select value={config.betType} onValueChange={(value: any) => setConfig({ ...config, betType: value })} disabled={isRunning}>
                <SelectTrigger className="bg-slate-800 border-red-700/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-red-700/30">
                  <SelectItem value="color">Cor (Vermelho/Preto)</SelectItem>
                  <SelectItem value="even_odd">Par/Ímpar</SelectItem>
                  <SelectItem value="dozen">Dúzia (1ª/2ª/3ª)</SelectItem>
                  <SelectItem value="number">Número Específico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Valor da Aposta */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Apostar em:</label>
              {config.betType === "color" && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => setConfig({ ...config, betValue: "red" })}
                    disabled={isRunning}
                    className={`${config.betValue === "red" ? "bg-red-600" : "bg-slate-700"}`}
                  >
                    🔴 Vermelho
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setConfig({ ...config, betValue: "black" })}
                    disabled={isRunning}
                    className={`${config.betValue === "black" ? "bg-gray-900" : "bg-slate-700"}`}
                  >
                    ⚫ Preto
                  </Button>
                </div>
              )}
              {config.betType === "even_odd" && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => setConfig({ ...config, betValue: "even" })}
                    disabled={isRunning}
                    className={`${config.betValue === "even" ? "bg-blue-600" : "bg-slate-700"}`}
                  >
                    Par
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setConfig({ ...config, betValue: "odd" })}
                    disabled={isRunning}
                    className={`${config.betValue === "odd" ? "bg-purple-600" : "bg-slate-700"}`}
                  >
                    Ímpar
                  </Button>
                </div>
              )}
              {config.betType === "dozen" && (
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    onClick={() => setConfig({ ...config, betValue: "1st" })}
                    disabled={isRunning}
                    className={`${config.betValue === "1st" ? "bg-green-600" : "bg-slate-700"}`}
                  >
                    1ª (1-12)
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setConfig({ ...config, betValue: "2nd" })}
                    disabled={isRunning}
                    className={`${config.betValue === "2nd" ? "bg-green-600" : "bg-slate-700"}`}
                  >
                    2ª (13-24)
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setConfig({ ...config, betValue: "3rd" })}
                    disabled={isRunning}
                    className={`${config.betValue === "3rd" ? "bg-green-600" : "bg-slate-700"}`}
                  >
                    3ª (25-36)
                  </Button>
                </div>
              )}
              {config.betType === "number" && (
                <Input
                  type="number"
                  value={config.betValue}
                  onChange={(e) => setConfig({ ...config, betValue: e.target.value })}
                  placeholder="0-36"
                  className="bg-slate-800 border-red-700/30"
                  disabled={isRunning}
                  min="0"
                  max="36"
                />
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 pt-4">
              {!isRunning ? (
                <>
                  <Button
                    onClick={handleStartRobot}
                    disabled={!selectedStrategy || !bankroll || !extensionInstalled}
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
                  <Button
                    onClick={() => window.open('https://1wyvrz.life/?open=register&p=f5q8', '_blank')}
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-bold"
                  >
                    Criar Conta 1win
                  </Button>
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
                <CardTitle className="text-white">Últimas Apostas</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/bets')}>Ver Todas</Button>
            </div>
          </CardHeader>
          <CardContent>
            {bets && bets.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {bets.slice(0, 10).map((bet: any) => (
                  <div key={bet.id} className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg">
                    <div>
                      <p className="font-medium">
                        R$ {(bet.betAmount / 100).toFixed(2)}
                        {bet.rouletteNumber !== null && ` • Nº ${bet.rouletteNumber}`}
                        {bet.isAutomatic === 1 && <span className="ml-2 text-xs bg-purple-900/50 px-2 py-1 rounded">AUTO</span>}
                      </p>
                      <p className="text-sm text-gray-200">
                        {new Date(bet.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${bet.result === "win" ? "text-green-400" : "text-red-400"}`}>
                        {bet.result === "win" ? "✓ Ganho" : "✗ Perda"}
                      </p>
                      <p className="text-sm text-gray-200">
                        R$ {(bet.payout / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-200 text-center py-8">Nenhuma aposta realizada ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

