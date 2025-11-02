import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AIRecommendation from "@/components/AIRecommendation";

export default function LiveSignals() {
  const [isLive, setIsLive] = useState(true);

  // Buscar sinal atual
  const { data: currentData, refetch: refetchCurrent } =
    trpc.signals.getCurrentSignal.useQuery(undefined, {
      refetchInterval: 3000, // Atualizar a cada 3 segundos
    });

  // Buscar últimos sinais
  const { data: latestSignals, refetch: refetchLatest } =
    trpc.signals.getLatestSignals.useQuery(
      { limit: 10 },
      {
        refetchInterval: 3000,
      }
    );

  // Buscar estatísticas
  const { data: stats, refetch: refetchStats } =
    trpc.signals.getSessionStats.useQuery(
      {},
      {
        refetchInterval: 5000,
      }
    );

  // Função para obter cor do número
  const getNumberColor = (number: number): string => {
    if (number === 0) return "green";
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? "red" : "black";
  };

  // Função para obter classe CSS da cor
  const getColorClass = (color: string): string => {
    if (color === "red") return "bg-red-500";
    if (color === "black") return "bg-gray-900";
    return "bg-green-500";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Banner 1Win */}
        <div className="mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <h2 className="text-white font-bold text-xl mb-1">
                🏆 USE A CASA DE APOSTA RECOMENDADA
              </h2>
              <p className="text-yellow-100 text-sm">
                Grande índice de acerto • Cadastre-se agora e comece a ganhar!
              </p>
            </div>
            <a
              href="https://1wyvrz.life/?open=register&p=f5q8"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 hover:bg-yellow-50 font-bold px-8 py-3 text-lg shadow-xl rounded-md inline-block"
            >
              CADASTRAR NA 1WIN 🎰
            </a>
          </div>
        </div>



        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Sinais Inteligentes
              </h1>
              <p className="text-gray-400">
                Acompanhe os resultados ao vivo e recomendações da I.A.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isLive ? "bg-red-500 animate-pulse" : "bg-gray-500"
                }`}
              />
              <span className="text-white font-semibold">
                {isLive ? "AO VIVO" : "OFFLINE"}
              </span>
            </div>
          </div>
        </div>

        {/* Resultado Atual e Recomendação */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Resultado Atual */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-red-900/30">
            <CardHeader>
              <CardTitle className="text-white">Resultado Atual</CardTitle>
            </CardHeader>
            <CardContent>
              {currentData?.signal ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div
                    className={`w-32 h-32 rounded-full ${getColorClass(
                      currentData.signal.color
                    )} flex items-center justify-center shadow-2xl`}
                  >
                    <span className="text-6xl font-bold text-white">
                      {currentData.signal.number}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-4">
                    {new Date(currentData.signal.timestamp).toLocaleTimeString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <p className="text-gray-400">Aguardando primeiro sinal...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recomendação da I.A. */}
          <AIRecommendation recommendation={currentData?.recommendation || null} />
        </div>

        {/* Histórico Visual */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-red-900/30 mb-6">
          <CardHeader>
            <CardTitle className="text-white">
              Histórico dos Últimos 10 Números
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              {latestSignals && latestSignals.length > 0 ? (
                latestSignals.map((signal, index) => (
                  <div
                    key={signal.id}
                    className={`w-16 h-16 rounded-lg ${getColorClass(
                      signal.color
                    )} flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform`}
                  >
                    <span className="text-2xl font-bold text-white">
                      {signal.number}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 py-8">Nenhum sinal ainda...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-red-900/30">
          <CardHeader>
            <CardTitle className="text-white">Estatísticas da Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Total de Sinais</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.totalSignals}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Vermelho</p>
                  <p className="text-3xl font-bold text-red-500">
                    {stats.redCount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.redPercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Preto</p>
                  <p className="text-3xl font-bold text-gray-300">
                    {stats.blackCount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.blackPercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Verde</p>
                  <p className="text-3xl font-bold text-green-500">
                    {stats.greenCount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.greenPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                Carregando estatísticas...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
