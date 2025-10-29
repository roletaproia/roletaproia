import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { ArrowRight, Bot, BarChart3, MessageSquare, Zap, Shield, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated && user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-red-900/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <span className="text-xl font-bold text-red-400">{APP_TITLE}</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href={getLoginUrl()} className="text-gray-300 hover:text-white transition-colors">
              Login
            </a>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <a href={getLoginUrl()}>Criar Conta</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-red-900/30 border border-red-700/50 rounded-full">
                <span className="text-sm font-semibold text-red-300">🤖 Automação Inteligente</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  Roleta Pro I.A.
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Robô de apostas automático com gerenciamento inteligente de banca e chat em tempo real.
              </p>
            </div>

            {/* Free Trial Badge */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-green-900/30 to-green-900/30 border border-green-500/50 rounded-lg p-4">
              <Zap className="h-6 w-6 text-green-400" />
              <div>
                <p className="font-bold text-green-300 text-lg">Experimente GRÁTIS por 7 dias</p>
                <p className="text-green-200 text-sm">Sem cartão de crédito • Veja os resultados</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <a href={getLoginUrl()}>
                  Criar Conta <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-red-700 text-white hover:bg-red-900/20">
                <a href="#features">Saiba Mais</a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-300">Seguro e Confiável</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-300">Resultados em Tempo Real</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-600/20 rounded-2xl blur-3xl" />
            <img
              src="/robot-roulette.png"
              alt="Robô de Apostas"
              className="relative w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Funcionalidades Principais</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar apostas inteligentemente em um único lugar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group bg-gradient-to-br from-red-900/20 to-transparent border border-red-700/30 rounded-xl p-8 hover:border-red-600/60 transition-all duration-300">
            <div className="mb-4 inline-block p-3 bg-red-900/50 rounded-lg group-hover:bg-red-800/50 transition-colors">
              <Bot className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Robô de Apostas</h3>
            <p className="text-gray-200 mb-4">
              Automatize suas apostas com estratégias configuráveis como Fibonacci, Martingale e muito mais.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>✓ Múltiplas estratégias</li>
              <li>✓ Execução automática</li>
              <li>✓ Simulação antes de usar</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="group bg-gradient-to-br from-red-900/20 to-transparent border border-red-700/30 rounded-xl p-8 hover:border-red-600/60 transition-all duration-300">
            <div className="mb-4 inline-block p-3 bg-red-900/50 rounded-lg group-hover:bg-red-800/50 transition-colors">
              <BarChart3 className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gerenciamento de Banca</h3>
            <p className="text-gray-200 mb-4">
              Acompanhe seu saldo, ganhos e perdas em tempo real com análises detalhadas.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>✓ Dashboard em tempo real</li>
              <li>✓ Histórico completo</li>
              <li>✓ Análise de risco</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="group bg-gradient-to-br from-red-900/20 to-transparent border border-red-700/30 rounded-xl p-8 hover:border-red-600/60 transition-all duration-300">
            <div className="mb-4 inline-block p-3 bg-red-900/50 rounded-lg group-hover:bg-red-800/50 transition-colors">
              <MessageSquare className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Chat em Tempo Real</h3>
            <p className="text-gray-200 mb-4">
              Conecte-se com outros usuários, compartilhe estratégias e aprenda com a comunidade.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>✓ Chat instantâneo</li>
              <li>✓ Comunidade ativa</li>
              <li>✓ Compartilhamento de estratégias</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Comece em 3 passos simples.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-900/50 border border-red-700/50">
              <span className="text-2xl font-bold text-red-400">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Crie sua Conta</h3>
            <p className="text-gray-200">Registre-se gratuitamente em menos de 1 minuto.</p>
          </div>

          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-900/50 border border-red-700/50">
              <span className="text-2xl font-bold text-red-400">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Configure seu Robô</h3>
            <p className="text-gray-200">Escolha uma estratégia e defina seus parâmetros.</p>
          </div>

          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-900/50 border border-red-700/50">
              <span className="text-2xl font-bold text-red-400">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Comece a Ganhar</h3>
            <p className="text-gray-200">Deixe o robô trabalhar e acompanhe seus ganhos.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="bg-gradient-to-r from-red-900/40 to-red-900/40 border border-red-700/50 rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já estão usando o Roleta Pro I.A. para otimizar suas apostas.
          </p>
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            <a href={getLoginUrl()}>
              Criar Conta Agora <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Sobre</h4>
              <p className="text-gray-200 text-sm">
                Roleta Pro I.A. é uma plataforma de automação de apostas com gerenciamento inteligente de banca.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#features" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Comunidade</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#" className="hover:text-white transition-colors">Chat</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fórum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-900/30 pt-8 text-center text-gray-200 text-sm">
             <p>&copy; 2025 Roleta Pro I.A. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

