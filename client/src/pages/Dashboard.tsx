import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { BarChart3, Bot, MessageSquare, TrendingUp, Zap, LogOut, User, Settings } from "lucide-react";
import { useLocation, Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Buscar dados de banca
  const { data: bankroll, isLoading: bankrollLoading } = trpc.bankroll.get.useQuery();

  // Buscar histórico de apostas
  const { data: bets, isLoading: betsLoading } = trpc.bets.getHistory.useQuery({ limit: 5 });

  // Buscar estratégias
  const { data: strategies, isLoading: strategiesLoading } = trpc.strategies.list.useQuery();

  // Buscar status de subscription
  const { data: subscriptionStatus } = trpc.subscription.checkAccess.useQuery();

  const formatCurrency = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2)}`;
  };

  const { logout } = useAuth();

  return (<Layout>
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header com Menu de Perfil */}
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
          <p className="text-gray-200">Bem-vindo, {user?.name}! Aqui está um resumo da sua atividade.</p>
          {subscriptionStatus?.daysRemaining !== undefined && subscriptionStatus.daysRemaining <= 7 && (
            <div className={`mt-2 px-3 py-2 rounded-lg text-sm font-medium ${
              subscriptionStatus.daysRemaining <= 2 
                ? "bg-red-900/30 border border-red-700/50 text-red-300" 
                : "bg-yellow-900/30 border border-yellow-700/50 text-yellow-300"
            }`}>
              ⏱️ {subscriptionStatus.daysRemaining} {subscriptionStatus.daysRemaining === 1 ? "dia restante" : "dias restantes"} no seu {subscriptionStatus.plan === "trial" ? "período de teste" : "plano"}
            </div>
          )}
        </div>
        {/* Menu de Perfil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full h-10 w-10 p-0 bg-red-900/20 border-red-700/30 hover:bg-red-900/40">
              {user?.name?.charAt(0).toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm font-medium text-foreground">
              {user?.name}
            </div>
            <div className="px-2 py-0.5 text-xs text-muted-foreground">
              {user?.role === "admin" ? "👑 Admin" : user?.role === "sub-admin" ? "🔐 Sub-Admin" : "👤 Usuário"}
            </div>
            <div className="border-t my-1" />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Editar Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            {user?.role === "admin" && (
              <>
                <div className="border-t my-1" />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer text-yellow-400 flex items-center">
                    <span>🔐 Painel Admin</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <div className="border-t my-1" />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-destructive focus:text-destructive flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Deslogar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Saldo Atual */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {bankrollLoading ? "..." : formatCurrency(bankroll?.currentBalance || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Inicial: {bankrollLoading ? "..." : formatCurrency(bankroll?.initialBalance || 0)}
              </p>
            </CardContent>
          </Card>

          {/* Total de Ganhos */}
          <Card className="bg-gradient-to-br from-green-900/20 to-transparent border-green-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200">Total de Ganhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {bankrollLoading ? "..." : formatCurrency(bankroll?.totalWins || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Acumulado</p>
            </CardContent>
          </Card>

          {/* Total de Perdas */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200">Total de Perdas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {bankrollLoading ? "..." : formatCurrency(bankroll?.totalLosses || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Acumulado</p>
            </CardContent>
          </Card>

          {/* Taxa de Vitória */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200">Taxa de Vitória</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {bankrollLoading ? "..." : `${bankroll?.winRate || "0"}%`}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {bankrollLoading ? "..." : `${bankroll?.totalBets || 0} apostas`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Robô de Apostas */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30 hover:border-red-600/60 transition-all cursor-pointer"
            onClick={() => navigate("/betting-robot")}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-red-400" />
                <CardTitle className="text-white">Robô de Apostas</CardTitle>
              </div>
              <CardDescription>Configure e execute apostas automáticas</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Acessar</Button>
            </CardContent>
          </Card>

          {/* Gerenciamento de Banca */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30 hover:border-red-600/60 transition-all cursor-pointer"
            onClick={() => navigate("/bankroll-management")}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-red-400" />
                <CardTitle className="text-white">Gerenciamento de Banca</CardTitle>
              </div>
              <CardDescription>Acompanhe seu saldo e estatísticas</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Acessar</Button>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30 hover:border-red-600/60 transition-all cursor-pointer"
            onClick={() => navigate("/chat")}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-red-400" />
                <CardTitle className="text-white">Chat</CardTitle>
              </div>
              <CardDescription>Converse com outros usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Acessar</Button>
            </CardContent>
          </Card>
        </div>

        {/* Estratégias */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-red-400" />
                <CardTitle className="text-white">Minhas Estratégias</CardTitle>
              </div>
              <Button size="sm" onClick={() => navigate("/strategies")}>
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {strategiesLoading ? (
              <p className="text-gray-200">Carregando...</p>
            ) : strategies && strategies.length > 0 ? (
              <div className="space-y-3">
                {strategies.slice(0, 3).map((strategy) => (
                  <div key={strategy.id} className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg">
                    <div>
                      <p className="font-medium">{strategy.name}</p>
                      <p className="text-sm text-gray-200">{strategy.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${strategy.isActive ? "bg-green-900/30 text-green-400" : "bg-gray-900/30 text-gray-200"}`}>
                      {strategy.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-200">Nenhuma estratégia criada. <Button variant="link" size="sm" onClick={() => navigate("/strategies")}>Criar uma</Button></p>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Apostas */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-red-400" />
                <CardTitle className="text-white">Últimas Apostas</CardTitle>
              </div>
              <Button size="sm" onClick={() => navigate("/bet-history")}>
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {betsLoading ? (
              <p className="text-gray-200">Carregando...</p>
            ) : bets && bets.length > 0 ? (
              <div className="space-y-3">
                {bets.map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg">
                    <div>
                      <p className="font-medium">{formatCurrency(bet.betAmount)}</p>
                      <p className="text-sm text-gray-200">{new Date(bet.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bet.result === "win" ? "bg-green-900/30 text-green-400" : 
                      bet.result === "loss" ? "bg-red-900/30 text-red-400" :
                      "bg-yellow-900/30 text-yellow-400"
                    }`}>
                      {bet.result === "win" ? "✓ Ganho" : bet.result === "loss" ? "✗ Perda" : "⏳ Pendente"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-200">Nenhuma aposta realizada ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </Layout>
  );
}

