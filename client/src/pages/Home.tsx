
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { 
  ArrowRight, Bot, BarChart3, MessageSquare, Zap, Shield, TrendingUp,
  BookOpen, Wallet, Bell, Smartphone, Brain, PieChart, Target
} from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const isAuthenticated = true; // Mock as authenticated for public access
  const [, navigate] = useLocation();



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Navigation - REMOVED FOR PLAY STORE COMPLIANCE */}


      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Seja bem-vindo à mais nova tecnologia de inteligência artificial para a roleta.
              </h1>
              <p className="text-2xl font-bold text-green-400 max-w-lg">
                100% grátis.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <a href="/dashboard">
                  Entrar Aqui <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right Video */}
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl shadow-red-900/50">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/BSExzVwAgLU?autoplay=1&mute=1"
              title="Robô Roleta - Como funciona"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
            <div className="absolute inset-0 pointer-events-none bg-black/10" />
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

      {/* Blog Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Aprenda Mais Sobre Roleta e IA</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Confira nossos artigos sobre estratégias, inteligência artificial e gerenciamento de banca.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Article 1 */}
          <a href="/blog/como-a-inteligencia-artificial-esta-mudando-o-jogo-da-roleta" className="group bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-700/30 rounded-xl p-6 hover:border-red-600/60 transition-all duration-300 hover:scale-105">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-red-900/50 text-red-300 text-xs font-semibold rounded-full">IA & Tecnologia</span>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-red-400 transition-colors">Como a Inteligência Artificial Está Mudando o Jogo da Roleta</h3>
            <p className="text-gray-400 text-sm mb-4">
              Descubra como a IA está revolucionando as estratégias de apostas e análise de padrões na roleta online.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Leitura de 8 min</span>
            </div>
          </a>

          {/* Article 2 */}
          <a href="/blog/estrategias-de-apostas-em-roleta-online-o-que-funciona-de-verdade" className="group bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-700/30 rounded-xl p-6 hover:border-purple-600/60 transition-all duration-300 hover:scale-105">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 text-xs font-semibold rounded-full">Estratégias</span>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">Estratégias de Apostas em Roleta Online: O Que Funciona de Verdade</h3>
            <p className="text-gray-400 text-sm mb-4">
              Análise completa das principais estratégias de apostas, com dados reais sobre eficácia e riscos.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Target className="h-4 w-4 mr-2" />
              <span>Leitura de 10 min</span>
            </div>
          </a>

          {/* Article 3 */}
          <a href="/blog/gerenciamento-de-banca-como-nao-perder-tudo-na-roleta" className="group bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-700/30 rounded-xl p-6 hover:border-green-600/60 transition-all duration-300 hover:scale-105">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-green-900/50 text-green-300 text-xs font-semibold rounded-full">Gerenciamento</span>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors">Gerenciamento de Banca: Como Não Perder Tudo na Roleta</h3>
            <p className="text-gray-400 text-sm mb-4">
              Aprenda técnicas profissionais de gerenciamento de banca para proteger seu capital e jogar com responsabilidade.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Wallet className="h-4 w-4 mr-2" />
              <span>Leitura de 9 min</span>
            </div>
          </a>
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="border-red-700 text-white hover:bg-red-900/20">
            <a href="/blog">Ver Todos os Artigos <ArrowRight className="ml-2 h-4 w-4" /></a>
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
