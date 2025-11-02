import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  DollarSign,
  Percent
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function BankrollManagement() {
  // Estado da banca
  const [bankroll, setBankroll] = useState(1000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [stopLossPercent, setStopLossPercent] = useState(20);
  const [stopWinPercent, setStopWinPercent] = useState(30);
  
  // Cálculos
  const recommendedBet = (bankroll * riskPercent) / 100;
  const stopLossValue = bankroll - (bankroll * stopLossPercent) / 100;
  const stopWinValue = bankroll + (bankroll * stopWinPercent) / 100;
  
  // Dados simulados para gráficos
  const bankrollHistory = [
    { time: '10:00', value: 1000 },
    { time: '10:30', value: 1050 },
    { time: '11:00', value: 980 },
    { time: '11:30', value: 1100 },
    { time: '12:00', value: 1150 },
    { time: '12:30', value: 1080 },
    { time: '13:00', value: 1200 },
  ];
  
  const winRateData = [
    { name: 'Vitórias', value: 65, color: '#10b981' },
    { name: 'Derrotas', value: 35, color: '#ef4444' },
  ];
  
  // Função para calcular progressão Martingale
  const calculateMartingale = (baseBet: number, maxSteps: number = 10) => {
    const sequence = [];
    let currentBet = baseBet;
    let totalRisk = 0;
    
    for (let i = 1; i <= maxSteps; i++) {
      totalRisk += currentBet;
      sequence.push({
        step: i,
        bet: currentBet,
        totalRisk: totalRisk,
        percentOfBankroll: ((totalRisk / bankroll) * 100).toFixed(1)
      });
      currentBet *= 2;
    }
    
    return sequence;
  };
  
  // Função para calcular progressão Fibonacci
  const calculateFibonacci = (baseBet: number, maxSteps: number = 10) => {
    const sequence = [];
    const fib = [1, 1];
    let totalRisk = 0;
    
    for (let i = 0; i < maxSteps; i++) {
      if (i >= 2) {
        fib.push(fib[i - 1] + fib[i - 2]);
      }
      const currentBet = baseBet * fib[i];
      totalRisk += currentBet;
      sequence.push({
        step: i + 1,
        bet: currentBet,
        totalRisk: totalRisk,
        percentOfBankroll: ((totalRisk / bankroll) * 100).toFixed(1)
      });
    }
    
    return sequence;
  };
  
  // Função para calcular progressão D'Alembert
  const calculateDAlembert = (baseBet: number, maxSteps: number = 10) => {
    const sequence = [];
    let currentBet = baseBet;
    let totalRisk = 0;
    
    for (let i = 1; i <= maxSteps; i++) {
      totalRisk += currentBet;
      sequence.push({
        step: i,
        bet: currentBet,
        totalRisk: totalRisk,
        percentOfBankroll: ((totalRisk / bankroll) * 100).toFixed(1)
      });
      currentBet += baseBet;
    }
    
    return sequence;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciamento de Banca</h1>
            <p className="text-gray-400">Gerencie suas apostas de forma inteligente e profissional</p>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Banca Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                R$ {bankroll.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Saldo disponível para apostas</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Lucro Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                +R$ 200.00
              </div>
              <p className="text-xs text-gray-500 mt-1">+20% de ROI</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                65%
              </div>
              <p className="text-xs text-gray-500 mt-1">Taxa de acerto</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Evolução */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Evolução da Banca
            </CardTitle>
            <CardDescription>Acompanhe a evolução do seu saldo ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bankrollHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Linhas de referência */}
            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">Stop-Win: R$ {stopWinValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-400">Stop-Loss: R$ {stopLossValue.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Ferramentas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Calculadora de Apostas */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-500" />
                Calculadora de Apostas
              </CardTitle>
              <CardDescription>Calcule o valor ideal para suas apostas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankroll" className="text-gray-300">Banca Atual (R$)</Label>
                <Input
                  id="bankroll"
                  type="number"
                  value={bankroll}
                  onChange={(e) => setBankroll(Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="risk" className="text-gray-300">Percentual de Risco (%)</Label>
                <Input
                  id="risk"
                  type="number"
                  min="1"
                  max="5"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-xs text-gray-500">Recomendado: 1-5% da banca</p>
              </div>
              
              <div className="p-4 bg-purple-900/30 border border-purple-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Aposta Recomendada:</span>
                  <span className="text-2xl font-bold text-purple-400">R$ {recommendedBet.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Apostas possíveis:</span>
                  <span className="text-gray-300">{Math.floor(bankroll / recommendedBet)}x</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="text-gray-400 mb-1">Lucro (2x)</div>
                  <div className="text-green-400 font-bold">+R$ {recommendedBet.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <div className="text-gray-400 mb-1">Lucro (3x)</div>
                  <div className="text-blue-400 font-bold">+R$ {(recommendedBet * 2).toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertas e Limites */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Alertas e Limites
              </CardTitle>
              <CardDescription>Configure seus limites de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss" className="text-gray-300">Stop-Loss (%)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  min="10"
                  max="50"
                  value={stopLossPercent}
                  onChange={(e) => setStopLossPercent(Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Parar ao atingir:</span>
                  <span className="text-red-400 font-bold">R$ {stopLossValue.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stopWin" className="text-gray-300">Stop-Win (%)</Label>
                <Input
                  id="stopWin"
                  type="number"
                  min="10"
                  max="100"
                  value={stopWinPercent}
                  onChange={(e) => setStopWinPercent(Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Parar ao atingir:</span>
                  <span className="text-green-400 font-bold">R$ {stopWinValue.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Barra de Progresso */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Stop-Loss</span>
                  <span>Banca Atual</span>
                  <span>Stop-Win</span>
                </div>
                <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 h-full bg-gradient-to-r from-red-500 to-yellow-500"
                    style={{ width: `${((bankroll - stopLossValue) / (stopWinValue - stopLossValue)) * 100}%` }}
                  ></div>
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-lg"
                    style={{ left: `${((bankroll - stopLossValue) / (stopWinValue - stopLossValue)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Alertas Ativos */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Alertas Ativos</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-900/20 border border-green-700 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-300">Banca dentro dos limites</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabelas de Progressão */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Estratégias de Progressão
            </CardTitle>
            <CardDescription>Compare diferentes estratégias de apostas</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="flat" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="flat">Flat Betting</TabsTrigger>
                <TabsTrigger value="dalembert">D'Alembert</TabsTrigger>
                <TabsTrigger value="fibonacci">Fibonacci</TabsTrigger>
                <TabsTrigger value="martingale">Martingale</TabsTrigger>
              </TabsList>
              
              <TabsContent value="flat" className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-white">Estratégia Recomendada</div>
                    <div className="text-sm text-gray-400">Risco: Baixo | Retorno: Médio</div>
                  </div>
                </div>
                <p className="text-gray-300">
                  <strong>Flat Betting</strong> é a estratégia mais segura. Você aposta sempre o mesmo valor, independente de vitórias ou derrotas. 
                  Ideal para gerenciamento de banca de longo prazo.
                </p>
                <div className="p-4 bg-slate-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">R$ {recommendedBet.toFixed(2)}</div>
                    <div className="text-sm text-gray-400 mt-1">Aposta fixa em todas as rodadas</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="dalembert" className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-white">Estratégia Conservadora</div>
                    <div className="text-sm text-gray-400">Risco: Baixo | Retorno: Médio</div>
                  </div>
                </div>
                <p className="text-gray-300">
                  <strong>D'Alembert</strong> aumenta 1 unidade após perda e diminui 1 unidade após vitória. Menos agressivo que Martingale.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-2 text-gray-400">Sequência</th>
                        <th className="text-right p-2 text-gray-400">Aposta</th>
                        <th className="text-right p-2 text-gray-400">Risco Total</th>
                        <th className="text-right p-2 text-gray-400">% Banca</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculateDAlembert(recommendedBet, 7).map((row) => (
                        <tr key={row.step} className="border-b border-slate-800">
                          <td className="p-2 text-gray-300">{row.step}ª perda</td>
                          <td className="text-right p-2 text-white font-mono">R$ {row.bet.toFixed(2)}</td>
                          <td className="text-right p-2 text-gray-400 font-mono">R$ {row.totalRisk.toFixed(2)}</td>
                          <td className="text-right p-2">
                            <Badge variant={Number(row.percentOfBankroll) > 20 ? "destructive" : "secondary"}>
                              {row.percentOfBankroll}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="fibonacci" className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-medium text-white">Use com Cautela</div>
                    <div className="text-sm text-gray-400">Risco: Médio | Retorno: Alto</div>
                  </div>
                </div>
                <p className="text-gray-300">
                  <strong>Fibonacci</strong> segue a sequência matemática (1, 1, 2, 3, 5, 8, 13...). Menos agressivo que Martingale, mas ainda arriscado.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-2 text-gray-400">Sequência</th>
                        <th className="text-right p-2 text-gray-400">Aposta</th>
                        <th className="text-right p-2 text-gray-400">Risco Total</th>
                        <th className="text-right p-2 text-gray-400">% Banca</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculateFibonacci(recommendedBet, 7).map((row) => (
                        <tr key={row.step} className="border-b border-slate-800">
                          <td className="p-2 text-gray-300">{row.step}ª perda</td>
                          <td className="text-right p-2 text-white font-mono">R$ {row.bet.toFixed(2)}</td>
                          <td className="text-right p-2 text-gray-400 font-mono">R$ {row.totalRisk.toFixed(2)}</td>
                          <td className="text-right p-2">
                            <Badge variant={Number(row.percentOfBankroll) > 30 ? "destructive" : Number(row.percentOfBankroll) > 15 ? "secondary" : "outline"}>
                              {row.percentOfBankroll}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="martingale" className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium text-white">⚠️ Não Recomendado</div>
                    <div className="text-sm text-gray-400">Risco: Muito Alto | Retorno: Muito Alto</div>
                  </div>
                </div>
                <p className="text-gray-300">
                  <strong>Martingale</strong> dobra a aposta após cada perda. <span className="text-red-400 font-bold">Extremamente arriscado!</span> Uma sequência de 7-8 perdas pode esgotar sua banca completamente.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-2 text-gray-400">Sequência</th>
                        <th className="text-right p-2 text-gray-400">Aposta</th>
                        <th className="text-right p-2 text-gray-400">Risco Total</th>
                        <th className="text-right p-2 text-gray-400">% Banca</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculateMartingale(recommendedBet, 7).map((row) => (
                        <tr key={row.step} className="border-b border-slate-800">
                          <td className="p-2 text-gray-300">{row.step}ª perda</td>
                          <td className="text-right p-2 text-white font-mono">R$ {row.bet.toFixed(2)}</td>
                          <td className="text-right p-2 text-gray-400 font-mono">R$ {row.totalRisk.toFixed(2)}</td>
                          <td className="text-right p-2">
                            <Badge variant={Number(row.percentOfBankroll) > 50 ? "destructive" : "secondary"}>
                              {row.percentOfBankroll}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                  <p className="text-sm text-red-300">
                    ⚠️ <strong>Atenção:</strong> Com apenas 7 perdas consecutivas, você arriscaria {calculateMartingale(recommendedBet, 7)[6].percentOfBankroll}% da sua banca!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Win Rate Chart */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Percent className="h-5 w-5 text-blue-500" />
              Distribuição de Resultados
            </CardTitle>
            <CardDescription>Análise de vitórias e derrotas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-around">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={winRateData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {winRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-4 mt-4 md:mt-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">65%</div>
                    <div className="text-sm text-gray-400">Taxa de Vitórias</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">35%</div>
                    <div className="text-sm text-gray-400">Taxa de Derrotas</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dica Final */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">💡 Dica Profissional</h3>
                <p className="text-gray-300">
                  A estratégia <strong>Flat Betting</strong> é a mais recomendada para gerenciamento de banca de longo prazo. 
                  Evite progressões agressivas como Martingale, que podem esgotar sua banca rapidamente em sequências de perdas.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Lembre-se: Jogue com responsabilidade e dentro dos seus limites!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
