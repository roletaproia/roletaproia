import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { 
  ArrowRight, Bot, BarChart3, MessageSquare, Zap, Shield, TrendingUp,
  BookOpen, Wallet, Bell, Smartphone, Brain, PieChart, Target
} from "lucide-react";
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
            {APP_LOGO && <img src="/logo-56.webp" srcSet="/logo-56.webp 1x, /logo-112.webp 2x" alt={APP_TITLE} className="h-8 w-8" width="56" height="56" />}
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
                <span className="text-sm font-semibold text-red-300">🤖 IA Avançada + PWA Mobile</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  Roleta Pro I.A.
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Plataforma completa com análise inteligente, gerenciamento profissional de banca e educação financeira para jogo responsável.
              </p>
            </div>

            {/* 100% Free Badge */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-green-900/30 to-green-900/30 border border-green-500/50 rounded-lg p-4">
              <Zap className="h-6 w-6 text-green-400" />
              <div>
                <p className="font-bold text-green-300 text-lg">100% GRATUITO</p>
                <p className="text-green-200 text-sm">Análises por IA + PWA Instalável • Sem custos</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <a href={getLoginUrl()}>
                  Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-red-700 text-white hover:bg-red-900/20">
                <a href="#features">Ver Funcionalidades</a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-300">Seguro e Confiável</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-300">Tempo Real</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-gray-300">PWA Mobile</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-600/20 rounded-2xl blur-3xl" />
            <img
              src="/robot-roulette-665.webp"
              srcSet="/robot-roulette-665.webp 1x, /robot-roulette-1330.webp 2x"
              alt="Robô de Apostas"
              className="relative w-full h-auto drop-shadow-2xl"
              width="665"
              height="665"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Funcionalidades Completas</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Sistema profissional com tudo que você precisa para jogar de forma inteligente e responsável.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 - Sinais Inteligentes */}
          <div className="group bg-gradient-to-br from-red-900/20 to-transparent border border-red-700/30 rounded-xl p-8 hover:border-red-600/60 transition-all duration-300 hover:scale-105">
            <div className="mb-4 inline-block p-3 bg-red-900/50 rounded-lg group-hover:bg-red-800/50 transition-colors">
              <Bot className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sinais Inteligentes</h3>
            <p className="text-gray-200 mb-4">
              Recomendações em tempo real com IA avançada de análise de padrões.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Sinais ao vivo</li>
              <li>✓ Análise de 5+ padrões</li>
              <li>✓ Confiança % em cada sinal</li>
              <li>✓ Números vizinhos na roda</li>
            </ul>
          </div>

          {/* Feature 2 - Gerenciamento de Banca */}
          <div className="group bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-700/30 rounded-xl p-8 hover:border-purple-600/60 transition-all duration-300 hover:scale-105">
            <div className="mb-4 inline-block p-3 bg-purple-900/50 rounded-lg group-hover:bg-purple-800/50 transition-colors">
              <Wallet className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gerenciamento de Banca</h3>
            <p className="text-gray-200 mb-4">
              Ferramentas profissionais para controlar sua banca e apostas.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Calculadora de apostas</li>
              <li>✓ 4 estratégias de progressão</li>
              <li>✓ Stop-Loss e Stop-Win</li>
              <li>✓ Gráficos de evolução</li>
            </ul>
          </div>

          {/* Feature 3 - Estatísticas Avançadas */}
          <div className="group bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-700/30 rounded-xl p-8 hover:border-blue-600/60 transition-all duration-300 hover:scale-105">
            <div className="mb-4 inline-block p-3 bg-blue-900/50 rounded-lg group-hover:bg-blue-800/50 transition-colors">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Estatísticas Avançadas</h3>
            <p className="text-gray-200 mb-4">
              Análises detalhadas com gráficos interativos e insights.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Tendências de cores</li>
              <li>✓ Análise de setores</li>
              <li>✓ Assertividade da IA</li>
              <li>✓ Números quentes/frios</li>
            </ul>
          </div>

          {/* Feature 4 - Educação Financeira */}
          <div className="group bg-gradient-to-br from-green-900/20 to-transparent border border-green-700/30 rounded-xl p-8 hover:border-green-600/60 transition-all duration-300 hover:scale-105">
            <div className="mb-4 inline-block p-3 bg-green-900/50 rounded-lg group-hover:bg-green-800/50 transition-colors">
              <BookOpen className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Educação Financeira</h3>
            <p className="text-gray-200 mb-4">
              Aprenda sobre jogo responsável e gerenciamento de risco.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Guia completo de roleta</li>
              <li>✓ Práticas recomendadas</li>
              <li>✓ Mitos vs Realidade</li>
              <li>✓ Dicas profissionais</li>
            </ul>
          </div>

          {/* Feature 5 - IA Melhorada */}
          <div className="group bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-700/30 rounded-xl p-8 hover:border-yellow-600/60 transition-all duration-300 hover:scale-105">
            <div className="mb-4 inline-block p-3 bg-yellow-900/50 rounded-lg group-hover:bg-yellow-800/50 transition-colors">
              <Brain className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">IA Melhorada</h3>
            <p className="text-gray-200 mb-4">
              Análise avançada de padrões com múltiplas estratégias.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Detecção de sequências</li>
              <li>✓ Dúzias atrasadas</li>
              <li>✓ Setores dominantes</li>
              <li>✓ Ciclos de paridade</li>
            </ul>
          </div>

          {/* Feature 6 - PWA Mobile */}
          <div className="group bg-gradient-to-br from-pink-900/20 to-transparent border border-pink-700/30 rounded-xl p-8 hover:border-pink-600/60 transition-all duration-300 hover:scale-105">
            <div className="mb-4 inline-block p-3 bg-pink-900/50 rounded-lg group-hover:bg-pink-800/50 transition-colors">
              <Smartphone className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">PWA Mobile</h3>
            <p className="text-gray-200 mb-4">
              Instale no celular e use como app nativo.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Instalável no celular</li>
              <li>✓ Funciona offline</li>
              <li>✓ Notificações push</li>
              <li>✓ Atalhos rápidos</li>
            </ul>
          </div>
        </div>
      </section>

      {/* New Features Showcase */}
      <section className="container mx-auto px-4 py-20 md:py-32 bg-gradient-to-br from-purple-900/10 to-transparent rounded-3xl">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-900/30 border border-purple-700/50 rounded-full mb-4">
            <span className="text-sm font-semibold text-purple-300">✨ Novidades 2025</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">O Que Há de Novo</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Implementamos melhorias significativas para tornar sua experiência ainda melhor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Análise de Padrões Avançada</h3>
                <p className="text-gray-300">
                  Nossa IA agora detecta 5 tipos diferentes de padrões: sequências de cores, dúzias atrasadas, números vizinhos, ciclos de paridade e setores dominantes.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Gráficos Interativos</h3>
                <p className="text-gray-300">
                  Visualize tendências, setores da roda, assertividade da IA e muito mais com gráficos profissionais e interativos.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Educação e Responsabilidade</h3>
                <p className="text-gray-300">
                  Página completa de educação financeira com guias sobre jogo responsável, gerenciamento de risco e melhores práticas.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Gestão Profissional de Banca</h3>
                <p className="text-gray-300">
                  Compare 4 estratégias de progressão (Flat, D'Alembert, Fibonacci, Martingale) com tabelas detalhadas e alertas de segurança.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-900/50 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Notificações Push</h3>
                <p className="text-gray-300">
                  Receba alertas instantâneos quando novas recomendações forem geradas ou quando a confiança for alta (&gt;80%).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Progressive Web App</h3>
                <p className="text-gray-300">
                  Instale no seu celular como um app nativo. Funciona offline, tem ícone na tela inicial e atalhos rápidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Comece em 3 passos simples e tenha acesso a todas as funcionalidades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-900/50 border border-red-700/50">
              <span className="text-2xl font-bold text-red-400">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Crie sua Conta</h3>
            <p className="text-gray-200">Registre-se gratuitamente em menos de 1 minuto. Sem cartão de crédito.</p>
          </div>

          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-900/50 border border-red-700/50">
              <span className="text-2xl font-bold text-red-400">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Explore as Ferramentas</h3>
            <p className="text-gray-200">Acesse sinais, estatísticas, gerenciamento de banca e educação financeira.</p>
          </div>

          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-900/50 border border-red-700/50">
              <span className="text-2xl font-bold text-red-400">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Jogue com Inteligência</h3>
            <p className="text-gray-200">Use as recomendações da IA e ferramentas profissionais para tomar decisões informadas.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-red-400 mb-2">100%</div>
            <div className="text-gray-300">Gratuito</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">8+</div>
            <div className="text-gray-300">Funcionalidades</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-gray-300">Disponível</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">PWA</div>
            <div className="text-gray-300">Mobile Ready</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="bg-gradient-to-r from-red-900/40 to-red-900/40 border border-red-700/50 rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Junte-se aos usuários que já estão usando o Roleta Pro I.A. para jogar de forma mais inteligente e responsável.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <a href={getLoginUrl()}>
                Criar Conta Grátis <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-red-700 text-white hover:bg-red-900/20">
              <a href="#features">Ver Todas as Features</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Sobre</h4>
              <p className="text-gray-200 text-sm">
                Roleta Pro I.A. é uma plataforma completa com análise inteligente, gerenciamento profissional e educação financeira.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Funcionalidades</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#features" className="hover:text-white transition-colors">Sinais Inteligentes</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Gerenciamento de Banca</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Estatísticas Avançadas</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Educação Financeira</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Comunidade</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href={getLoginUrl()} className="hover:text-white transition-colors">Chat</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suporte Telegram</a></li>
                <li><a href={getLoginUrl()} className="hover:text-white transition-colors">Indicações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="/blog" className="hover:text-white transition-colors">Artigos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Jogo Responsável</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-900/30 pt-8 text-center text-gray-200 text-sm">
            <p>&copy; 2025 Roleta Pro I.A. Todos os direitos reservados.</p>
            <p className="mt-2 text-xs text-gray-400">
              ⚠️ Jogue com responsabilidade. A roleta é um jogo de sorte e não garante ganhos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
