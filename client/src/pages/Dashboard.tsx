import Layout from "@/components/Layout";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { trpc } from "@/lib/trpc";
import { Radio, BarChart3, Sparkles, Wallet, BookOpen } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, navigate] = useLocation();

  // Buscar status de subscription (mantido para o badge, mas sem login)
  const { data: subscriptionStatus } = trpc.subscription.checkAccess.useQuery();

  return (<Layout>
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header Simples */}
      <div className="border-b border-red-900/30 p-6 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-yellow-400">Dashboard</h1>
            {subscriptionStatus?.badge && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                subscriptionStatus.badge === "Usuário Premium" 
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black" 
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              }`}>
                {subscriptionStatus.badge}
              </span>
            )}
          </div>
          <p className="text-gray-200">Escolha uma funcionalidade abaixo.</p>
        </div>
      </div>

      <div className="p-6 space-y-8">

        {/* Funcionalidades Principais */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Funcionalidades
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sinais Inteligentes - DESTAQUE */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-950/50 border-purple-600 hover:border-purple-400 transition-all cursor-pointer relative overflow-hidden"
              onClick={() => navigate("/live-signals")}>
              {/* Badge NOVO */}
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                AO VIVO
              </div>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <Radio className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Sinais Inteligentes</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Receba sinais em tempo real com análise de I.A.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                  Ver Sinais Ao Vivo
                </Button>
              </CardContent>
            </Card>







            {/* Gerenciamento de Banca */}
            <Card className="bg-gradient-to-br from-green-900/20 to-transparent border-green-700/30 hover:border-green-600/60 transition-all cursor-pointer"
              onClick={() => navigate("/bankroll")}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Gerenciamento de Banca</CardTitle>
                </div>
                <CardDescription>
                  Gerencie sua banca com estratégias inteligentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Gerenciar Banca
                </Button>
              </CardContent>
            </Card>

            {/* Educação Financeira */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-transparent border-blue-700/30 hover:border-blue-600/60 transition-all cursor-pointer"
              onClick={() => navigate("/education")}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Educação Financeira</CardTitle>
                </div>
                <CardDescription>
                  Aprenda sobre jogo responsável e gestão de banca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Aprender Mais
                </Button>
              </CardContent>
            </Card>

            {/* Estatísticas Avançadas */}
            <Card className="bg-gradient-to-br from-cyan-900/20 to-transparent border-cyan-700/30 hover:border-cyan-600/60 transition-all cursor-pointer"
              onClick={() => navigate("/statistics")}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Estatísticas Avançadas</CardTitle>
                </div>
                <CardDescription>
                  Visualize padrões e estatísticas detalhadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
                  Ver Estatísticas
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>


      </div>
    </div>
  </Layout>);
}

