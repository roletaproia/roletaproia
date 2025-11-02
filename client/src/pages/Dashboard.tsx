import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { Radio, MessageSquare, Users, BarChart3, LogOut, User, Settings, Sparkles, Gift } from "lucide-react";
import { useLocation, Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();



  // Buscar status de subscription
  const { data: subscriptionStatus } = trpc.subscription.checkAccess.useQuery();

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
          <p className="text-gray-200">Bem-vindo, {user?.name}! Escolha uma funcionalidade abaixo.</p>
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



            {/* Chat */}
            <Card className="bg-gradient-to-br from-yellow-900/20 to-transparent border-yellow-700/30 hover:border-yellow-600/60 transition-all cursor-pointer"
              onClick={() => navigate("/chat")}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Chat da Comunidade</CardTitle>
                </div>
                <CardDescription>
                  Converse e compartilhe estratégias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold">
                  Entrar no Chat
                </Button>
              </CardContent>
            </Card>

            {/* Indicações */}
            <Card className="bg-gradient-to-br from-pink-900/20 to-transparent border-pink-700/30 hover:border-pink-600/60 transition-all cursor-pointer"
              onClick={() => navigate("/referrals")}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Indicações</CardTitle>
                </div>
                <CardDescription>
                  Indique amigos e ganhe recompensas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold">
                  Meu Link de Indicação
                </Button>
              </CardContent>
            </Card>

            {/* Estratégias */}
            <Card className="bg-gradient-to-br from-orange-900/20 to-transparent border-orange-700/30 hover:border-orange-600/60 transition-all cursor-pointer"
              onClick={() => navigate("/strategies")}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Estratégias</CardTitle>
                </div>
                <CardDescription>
                  Aprenda e configure estratégias profissionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                  Ver Estratégias
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
    </div>
  </Layout>);
}

