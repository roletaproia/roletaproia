import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  TrendingUp, 
  AlertTriangle, 
  Brain, 
  Target, 
  Shield,
  Calculator,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function FinancialEducation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Educação Financeira na Roleta
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Aprenda a jogar com inteligência e responsabilidade. Conheça as probabilidades, 
            gerencie sua banca e use a IA de forma estratégica.
          </p>
        </div>

        {/* Seção: Entendendo a Roleta */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Entendendo a Roleta</h2>
          </div>
          
          <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
            <p className="text-gray-300 mb-4 leading-relaxed">
              A roleta é um jogo de azar clássico que consiste em uma roda com 37 números (0-36) na versão europeia, 
              ou 38 números (0-36 + 00) na versão americana. Os números são divididos em <strong className="text-white">vermelho</strong>, 
              <strong className="text-white"> preto</strong> e <strong className="text-white">verde</strong> (apenas o zero).
            </p>
            <p className="text-gray-300 leading-relaxed">
              Existem diversos tipos de apostas, desde apostas simples (vermelho/preto, par/ímpar) até apostas 
              em números específicos. Quanto menor a probabilidade de acerto, maior o pagamento.
            </p>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/50 p-5">
              <h3 className="text-lg font-semibold text-white mb-2">Apostas Simples</h3>
              <p className="text-gray-300 text-sm mb-2">Vermelho/Preto, Par/Ímpar, Alto/Baixo</p>
              <p className="text-2xl font-bold text-red-400">48,6%</p>
              <p className="text-xs text-gray-400">Probabilidade de acerto</p>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50 p-5">
              <h3 className="text-lg font-semibold text-white mb-2">Dúzias e Colunas</h3>
              <p className="text-gray-300 text-sm mb-2">12 números por aposta</p>
              <p className="text-2xl font-bold text-purple-400">32,4%</p>
              <p className="text-xs text-gray-400">Probabilidade de acerto</p>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50 p-5">
              <h3 className="text-lg font-semibold text-white mb-2">Número Pleno</h3>
              <p className="text-gray-300 text-sm mb-2">Aposta em 1 número</p>
              <p className="text-2xl font-bold text-blue-400">2,7%</p>
              <p className="text-xs text-gray-400">Probabilidade de acerto</p>
            </Card>
          </div>
        </section>

        {/* Seção: Jogo Responsável */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">Jogo Responsável</h2>
          </div>

          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/50 p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  A roleta é um jogo de sorte, não uma fonte de renda
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Nunca aposte dinheiro que você não pode perder. Defina limites claros antes de começar 
                  e respeite-os rigorosamente. O jogo deve ser uma forma de entretenimento, não uma solução financeira.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Práticas Recomendadas</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Defina um orçamento máximo antes de jogar</li>
                <li>✓ Estabeleça limites de tempo</li>
                <li>✓ Faça pausas regulares</li>
                <li>✓ Jogue apenas quando estiver bem emocionalmente</li>
                <li>✓ Comemore as vitórias e aceite as derrotas</li>
              </ul>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <XCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Evite Estes Erros</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✗ Tentar recuperar perdas rapidamente</li>
                <li>✗ Apostar dinheiro de contas ou despesas</li>
                <li>✗ Jogar sob influência de álcool</li>
                <li>✗ Pegar empréstimos para jogar</li>
                <li>✗ Esconder o jogo de familiares</li>
              </ul>
            </Card>
          </div>

          <Card className="bg-red-900/20 border-red-700/50 p-5 mt-4">
            <p className="text-gray-300 text-sm">
              <strong className="text-white">Precisa de ajuda?</strong> Se você ou alguém que conhece tem problemas com jogo, 
              procure ajuda profissional. No Brasil, você pode entrar em contato com os 
              <a href="https://www.jogadoresanonimos.com.br" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 ml-1">
                Jogadores Anônimos
              </a>.
            </p>
          </Card>
        </section>

        {/* Seção: Gerenciamento de Banca */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">Gerenciamento de Banca</h2>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
            <p className="text-gray-300 mb-4 leading-relaxed">
              O gerenciamento de banca é a estratégia mais importante para qualquer jogador. Consiste em 
              controlar quanto você aposta em cada rodada para maximizar sua longevidade no jogo e minimizar 
              o risco de perder todo o seu dinheiro rapidamente.
            </p>
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Regra de Ouro: 1-5%</h3>
              <p className="text-gray-300 text-sm">
                Nunca aposte mais que 1-5% da sua banca total em uma única rodada. Se você tem R$ 1.000, 
                suas apostas devem ficar entre R$ 10 e R$ 50.
              </p>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <h3 className="text-lg font-semibold text-white mb-3">Stop-Loss</h3>
              <p className="text-gray-300 text-sm mb-3">
                Defina um limite máximo de perda. Por exemplo, se perder 20% da banca, pare de jogar 
                naquele dia. Isso evita perdas catastróficas.
              </p>
              <div className="bg-red-900/20 border border-red-700/50 rounded p-3">
                <p className="text-red-400 text-sm font-semibold">Exemplo: Banca R$ 1.000</p>
                <p className="text-gray-300 text-xs mt-1">Stop-Loss: R$ 800 (perda de R$ 200)</p>
              </div>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <h3 className="text-lg font-semibold text-white mb-3">Stop-Win</h3>
              <p className="text-gray-300 text-sm mb-3">
                Defina um objetivo de ganho. Ao atingir, pare e guarde o lucro. Isso garante que você 
                saia com ganhos reais.
              </p>
              <div className="bg-green-900/20 border border-green-700/50 rounded p-3">
                <p className="text-green-400 text-sm font-semibold">Exemplo: Banca R$ 1.000</p>
                <p className="text-gray-300 text-xs mt-1">Stop-Win: R$ 1.300 (ganho de R$ 300)</p>
              </div>
            </Card>
          </div>

          <Card className="bg-yellow-900/20 border-yellow-700/50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cuidado com Progressões</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Estratégias como Martingale (dobrar a aposta após cada perda) podem parecer infalíveis, 
                  mas são extremamente arriscadas. Uma sequência de perdas pode esgotar sua banca rapidamente.
                </p>
                <p className="text-yellow-400 text-sm font-semibold">
                  Se usar progressões, faça com limites rígidos e nunca comprometa mais de 10% da banca total.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Seção: Como Usar a IA */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Como Usar a IA do RoletaPro</h2>
          </div>

          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-700/50 p-6 mb-6">
            <p className="text-gray-300 mb-4 leading-relaxed">
              Nossa Inteligência Artificial analisa os últimos 20 números sorteados e identifica padrões, 
              tendências e anomalias estatísticas. Com base nessa análise, ela gera recomendações com um 
              nível de confiança percentual.
            </p>
            <div className="bg-purple-900/40 border border-purple-600/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">⚠️ Importante Entender</h3>
              <p className="text-gray-300 text-sm">
                A IA <strong className="text-white">NÃO prevê o futuro</strong> e <strong className="text-white">NÃO garante vitórias</strong>. 
                Ela é uma ferramenta de apoio à decisão que aumenta suas chances ao identificar padrões, 
                mas a roleta continua sendo um jogo de sorte.
              </p>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="text-center mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-900/50 rounded-full mb-2">
                  <span className="text-2xl font-bold text-green-400">80%+</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Alta Confiança</h3>
              </div>
              <p className="text-gray-300 text-sm text-center">
                Padrões fortes identificados. Considere seguir a recomendação.
              </p>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="text-center mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-900/50 rounded-full mb-2">
                  <span className="text-2xl font-bold text-yellow-400">60-79%</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Confiança Média</h3>
              </div>
              <p className="text-gray-300 text-sm text-center">
                Padrões moderados. Use com cautela e apostas menores.
              </p>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="text-center mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-900/50 rounded-full mb-2">
                  <span className="text-2xl font-bold text-red-400">&lt;60%</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Baixa Confiança</h3>
              </div>
              <p className="text-gray-300 text-sm text-center">
                Padrões fracos. Considere aguardar melhores oportunidades.
              </p>
            </Card>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 p-5">
            <h3 className="text-lg font-semibold text-white mb-3">Dicas para Usar a IA</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✓ Combine as recomendações da IA com seu gerenciamento de banca</li>
              <li>✓ Não aposte todo seu dinheiro em uma única recomendação</li>
              <li>✓ Analise o histórico e a análise detalhada fornecida</li>
              <li>✓ Use a confiança como guia, não como garantia</li>
              <li>✓ Mantenha registro de quais recomendações você seguiu e os resultados</li>
            </ul>
          </Card>
        </section>

        {/* Seção: Mitos vs Realidade */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Mitos vs Realidade</h2>
          </div>

          <div className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    ❌ Mito: "Depois de 5 vermelhos, o preto é garantido"
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">✅ Realidade:</strong> Cada giro é completamente independente. 
                    A roleta não tem memória. A probabilidade de sair vermelho ou preto é sempre a mesma, 
                    independente do histórico.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    ❌ Mito: "Martingale sempre funciona"
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">✅ Realidade:</strong> Martingale (dobrar após perda) pode 
                    levar a perdas catastróficas. Uma sequência de 7-8 perdas consecutivas pode esgotar uma 
                    banca de R$ 1.000 com apostas iniciais de apenas R$ 10.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    ❌ Mito: "A IA pode prever o futuro"
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">✅ Realidade:</strong> A IA analisa padrões estatísticos 
                    e tendências, mas não prevê resultados futuros. Ela aumenta suas chances ao identificar 
                    anomalias, mas não garante vitórias.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    ❌ Mito: "Números quentes têm mais chance de sair"
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">✅ Realidade:</strong> A probabilidade de cada número é 
                    sempre 1/37 (2,7%), independente de quantas vezes saiu recentemente. "Números quentes" 
                    são apenas coincidências estatísticas.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Seção: Dicas Práticas */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">Dicas Práticas para Jogar Melhor</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-400">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Comece Pequeno</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Inicie com apostas pequenas para entender a dinâmica do jogo e testar estratégias 
                sem arriscar muito capital.
              </p>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-400">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Mantenha Registro</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Anote suas apostas, ganhos e perdas. Isso ajuda a identificar padrões no seu 
                comportamento e melhorar suas decisões.
              </p>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-400">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Faça Pausas</h3>
              </div>
              <p className="text-gray-300 text-sm">
                A cada 30-60 minutos, faça uma pausa de 10-15 minutos. Isso ajuda a manter a 
                clareza mental e evitar decisões impulsivas.
              </p>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-400">4</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Não Persiga Perdas</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Nunca tente recuperar perdas rapidamente aumentando apostas. Isso geralmente 
                leva a perdas ainda maiores.
              </p>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-400">5</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Estude Estatísticas</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Use as estatísticas da plataforma para entender tendências e tomar decisões 
                mais informadas baseadas em dados reais.
              </p>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-400">6</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Jogue por Diversão</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Encare o jogo como entretenimento, não como fonte de renda. Se não estiver 
                se divertindo, é hora de parar.
              </p>
            </Card>
          </div>
        </section>

        {/* Call-to-Action Final */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 border-purple-700/50 p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para Jogar com Inteligência?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Agora que você entende como funciona a roleta, como gerenciar sua banca e como usar 
              nossa IA de forma estratégica, está pronto para começar!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/live-signals">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
                  Acessar Sinais Inteligentes
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-all">
                  Ver Meu Dashboard
                </button>
              </Link>
            </div>
            <p className="text-yellow-400 text-sm mt-6 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Lembre-se: Jogue com responsabilidade e dentro dos seus limites!
            </p>
          </Card>
        </section>

      </div>
    </div>
  );
}
