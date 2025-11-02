import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Target, PieChart as PieChartIcon, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdvancedStatistics() {
  // Dados simulados de tendências (em produção, viriam do backend)
  const colorTrendData = useMemo(() => [
    { time: "10:00", vermelho: 5, preto: 3, verde: 0 },
    { time: "10:30", vermelho: 7, preto: 6, verde: 1 },
    { time: "11:00", vermelho: 4, preto: 8, verde: 0 },
    { time: "11:30", vermelho: 9, preto: 5, verde: 1 },
    { time: "12:00", vermelho: 6, preto: 7, verde: 0 },
    { time: "12:30", vermelho: 8, preto: 4, verde: 1 },
    { time: "13:00", vermelho: 5, preto: 9, verde: 0 },
  ], []);

  // Dados de setores da roda
  const sectorData = useMemo(() => [
    { name: "Vizinhos do Zero", value: 35, color: "#8b5cf6" },
    { name: "Terceiro da Roda", value: 25, color: "#3b82f6" },
    { name: "Órfãos", value: 20, color: "#10b981" },
    { name: "Zero Game", value: 15, color: "#f59e0b" },
    { name: "Outros", value: 5, color: "#6b7280" },
  ], []);

  // Dados de assertividade da IA
  const aiAccuracyData = useMemo(() => [
    { confidence: "60-69%", acertos: 62, erros: 38 },
    { confidence: "70-79%", acertos: 71, erros: 29 },
    { confidence: "80-89%", acertos: 82, erros: 18 },
    { confidence: "90-100%", acertos: 91, erros: 9 },
  ], []);

  // Dados de recomendações vs resultados
  const recommendationResultsData = useMemo(() => [
    { tipo: "Número Exato", acertos: 15, tentativas: 100, taxa: 15 },
    { tipo: "Cor", acertos: 52, tentativas: 100, taxa: 52 },
    { tipo: "Dúzia", acertos: 38, tentativas: 100, taxa: 38 },
    { tipo: "Coluna", acertos: 35, tentativas: 100, taxa: 35 },
    { tipo: "Par/Ímpar", acertos: 51, tentativas: 100, taxa: 51 },
    { tipo: "Setor", acertos: 42, tentativas: 100, taxa: 42 },
  ], []);

  // Dados de números mais frequentes
  const frequentNumbersData = useMemo(() => [
    { number: 17, frequency: 12, color: "black" },
    { number: 23, frequency: 11, color: "red" },
    { number: 7, frequency: 10, color: "red" },
    { number: 32, frequency: 10, color: "red" },
    { number: 11, frequency: 9, color: "black" },
    { number: 29, frequency: 9, color: "black" },
    { number: 18, frequency: 8, color: "red" },
    { number: 4, frequency: 8, color: "black" },
    { number: 21, frequency: 7, color: "red" },
    { number: 2, frequency: 7, color: "black" },
  ], []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-8">
        <div className="container mx-auto px-4 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2 animate-fade-in">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <BarChart3 className="h-10 w-10 text-purple-500" />
              Estatísticas Avançadas
            </h1>
            <p className="text-gray-400">
              Análises detalhadas de padrões, tendências e performance da IA
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="trends" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="trends">
                <TrendingUp className="h-4 w-4 mr-2" />
                Tendências
              </TabsTrigger>
              <TabsTrigger value="sectors">
                <PieChartIcon className="h-4 w-4 mr-2" />
                Setores
              </TabsTrigger>
              <TabsTrigger value="ai-accuracy">
                <Target className="h-4 w-4 mr-2" />
                Assertividade IA
              </TabsTrigger>
              <TabsTrigger value="results">
                <Activity className="h-4 w-4 mr-2" />
                Resultados
              </TabsTrigger>
            </TabsList>

            {/* Tab: Tendências */}
            <TabsContent value="trends" className="space-y-6 animate-fade-in">
              
              {/* Gráfico de Tendências de Cores */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    Tendências de Cores ao Longo do Tempo
                  </CardTitle>
                  <CardDescription>
                    Frequência de vermelho, preto e verde nas últimas horas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={colorTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="vermelho"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: "#ef4444", r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="preto"
                        stroke="#1f2937"
                        strokeWidth={3}
                        dot={{ fill: "#1f2937", r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="verde"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Números Mais Frequentes */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Top 10 Números Mais Frequentes</CardTitle>
                  <CardDescription>
                    Números que mais saíram nas últimas 200 rodadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {frequentNumbersData.map((item, index) => (
                      <div
                        key={item.number}
                        className={`p-4 rounded-lg border-2 text-center transition-all hover:scale-105 ${
                          item.color === "red"
                            ? "bg-red-900/30 border-red-500"
                            : "bg-gray-900/30 border-gray-500"
                        }`}
                      >
                        <div className="text-3xl font-bold text-white mb-1">
                          {item.number}
                        </div>
                        <div className="text-sm text-gray-400">
                          {item.frequency}x
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Setores */}
            <TabsContent value="sectors" className="space-y-6 animate-fade-in">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-purple-500" />
                    Distribuição por Setores da Roda
                  </CardTitle>
                  <CardDescription>
                    Análise de frequência dos setores nas últimas 200 rodadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={sectorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sectorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Tabela de Setores */}
                  <div className="mt-6 space-y-3">
                    {sectorData.map((sector) => (
                      <div
                        key={sector.name}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: sector.color }}
                          ></div>
                          <span className="text-white font-medium">{sector.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{sector.value}%</div>
                          <div className="text-xs text-gray-400">
                            {Math.round((sector.value / 100) * 200)} rodadas
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Assertividade da IA */}
            <TabsContent value="ai-accuracy" className="space-y-6 animate-fade-in">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Assertividade da IA por Nível de Confiança
                  </CardTitle>
                  <CardDescription>
                    Taxa de acerto das recomendações baseada no nível de confiança
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={aiAccuracyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="confidence" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="acertos" fill="#10b981" name="Acertos (%)" />
                      <Bar dataKey="erros" fill="#ef4444" name="Erros (%)" />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Insights */}
                  <div className="mt-6 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
                    <h4 className="text-purple-300 font-semibold mb-2">💡 Insights</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Recomendações com 80%+ de confiança têm 82% de assertividade</li>
                      <li>• Quanto maior a confiança, maior a taxa de acerto</li>
                      <li>• Recomendações com 90%+ são as mais confiáveis</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Resultados */}
            <TabsContent value="results" className="space-y-6 animate-fade-in">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    Recomendações vs Resultados Reais
                  </CardTitle>
                  <CardDescription>
                    Taxa de acerto por tipo de recomendação nas últimas 100 rodadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={recommendationResultsData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey="tipo" type="category" stroke="#94a3b8" width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="taxa" fill="#8b5cf6" name="Taxa de Acerto (%)" />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Tabela Detalhada */}
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-gray-300">Tipo</th>
                          <th className="text-center py-3 px-4 text-gray-300">Acertos</th>
                          <th className="text-center py-3 px-4 text-gray-300">Tentativas</th>
                          <th className="text-center py-3 px-4 text-gray-300">Taxa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recommendationResultsData.map((item) => (
                          <tr key={item.tipo} className="border-b border-slate-800">
                            <td className="py-3 px-4 text-white font-medium">{item.tipo}</td>
                            <td className="text-center py-3 px-4 text-green-400">
                              {item.acertos}
                            </td>
                            <td className="text-center py-3 px-4 text-gray-400">
                              {item.tentativas}
                            </td>
                            <td className="text-center py-3 px-4">
                              <span
                                className={`px-3 py-1 rounded-full font-medium ${
                                  item.taxa >= 50
                                    ? "bg-green-900/30 text-green-400"
                                    : item.taxa >= 30
                                    ? "bg-yellow-900/30 text-yellow-400"
                                    : "bg-red-900/30 text-red-400"
                                }`}
                              >
                                {item.taxa}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
