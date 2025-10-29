import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Hand, Radio, Gift, ExternalLink, CheckCircle, Zap } from "lucide-react";

export default function RobotModeSelection() {
  const [, setLocation] = useLocation();

  const open1winRegister = () => {
    window.open('https://1wyvrz.life/?open=register&p=f5q8', '_blank');
  };

  const open1winRoulette = () => {
    window.open('https://1whfxh.life/casino/play/v_evolution:RoletaAoVivo', '_blank');
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Imagem do Robô */}
          <div className="flex justify-center mb-6">
            <img 
              src="/robot-roulette.png" 
              alt="Robô de Apostas" 
              className="w-64 h-64 object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-yellow-400">🤖 Escolha o Modo do Robô</h1>
          <p className="text-xl text-gray-300">
            Selecione como você deseja usar nosso sistema de apostas inteligente
          </p>
        </div>

        {/* Banner 1win */}
        <Alert className="mb-8 bg-gradient-to-r from-yellow-900/40 to-red-900/40 border-yellow-600">
          <Gift className="h-6 w-6 text-yellow-400" />
          <AlertTitle className="text-yellow-400 text-xl font-bold">🎁 Ainda não tem conta na 1win?</AlertTitle>
          <AlertDescription className="text-gray-200 mb-4">
            Nosso robô funciona exclusivamente com a <strong className="text-yellow-400">Roleta Brasileira da 1win</strong>. 
            Cadastre-se agora e ganhe <strong className="text-green-400">bônus de boas-vindas</strong>!
          </AlertDescription>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={open1winRegister}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
            >
              <Gift className="mr-2 h-4 w-4" />
              Criar Conta na 1win (Com Bônus)
            </Button>
            <Button 
              onClick={open1winRoulette}
              variant="outline"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir Roleta Brasileira
            </Button>
          </div>
        </Alert>

        {/* Modos */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Modo Manual */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-950/50 border-blue-600 hover:border-blue-400 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Hand className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-blue-400">Modo Manual</CardTitle>
              </div>
              <CardDescription className="text-gray-300 text-base">
                Você controla tudo! Receba sugestões inteligentes e aposte manualmente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">Sem extensão necessária</strong> - Funciona em qualquer dispositivo
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">Você digita os números</strong> - Insira os últimos resultados da roleta
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">IA analisa e sugere</strong> - Receba dicas baseadas em estratégias profissionais
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">Você aposta manualmente</strong> - Total controle sobre suas apostas
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">Perfeito para iniciantes</strong> - Aprenda enquanto aposta
                  </p>
                </div>
              </div>

              <div className="bg-blue-950/50 p-4 rounded-lg border border-blue-700">
                <p className="text-sm text-blue-300 font-semibold mb-2">✨ Ideal para:</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Usuários de celular (qualquer navegador)</li>
                  <li>• Quem quer aprender estratégias</li>
                  <li>• Quem prefere controle total</li>
                </ul>
              </div>

              <Button
                onClick={() => setLocation('/betting-robot/manual')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
              >
                <Hand className="mr-2 h-5 w-5" />
                Usar Modo Manual
              </Button>
            </CardContent>
          </Card>

          {/* Sinais Inteligentes */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-950/50 border-purple-600 hover:border-purple-400 transition-all relative overflow-hidden">
            {/* Badge "NOVO" */}
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              NOVO
            </div>
            
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-purple-400">Sinais Inteligentes</CardTitle>
              </div>
              <CardDescription className="text-gray-300 text-base">
                Receba sinais em tempo real! A I.A. analisa e recomenda automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">Sinais ao vivo</strong> - Números capturados em tempo real da 1win
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">Recomendações automáticas</strong> - I.A. analisa padrões e sugere apostas
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">Confiança %</strong> - Veja o nível de confiança de cada sinal
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">Estatísticas detalhadas</strong> - Winrate, distribuição de cores, e mais
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200">
                    <strong className="text-white">Funciona em qualquer dispositivo</strong> - Sem extensões ou instalações
                  </p>
                </div>
              </div>

              <div className="bg-purple-950/50 p-4 rounded-lg border border-purple-700">
                <p className="text-sm text-purple-300 font-semibold mb-2">✨ Ideal para:</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Quem quer sinais em tempo real</li>
                  <li>• Usuários que confiam na I.A.</li>
                  <li>• Máxima eficiência e praticidade</li>
                </ul>
              </div>

              <Button
                onClick={() => setLocation('/live-signals')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 text-lg"
              >
                <Radio className="mr-2 h-5 w-5" />
                Ver Sinais Inteligentes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Comparação */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">📊 Comparação Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400">Característica</th>
                    <th className="text-center py-3 px-4 text-blue-400">Manual</th>
                    <th className="text-center py-3 px-4 text-purple-400">Sinais Inteligentes</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">Extensão necessária</td>
                    <td className="text-center py-3 px-4">❌ Não</td>
                    <td className="text-center py-3 px-4">❌ Não</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">Funciona em qualquer dispositivo</td>
                    <td className="text-center py-3 px-4">✅ Sim</td>
                    <td className="text-center py-3 px-4">✅ Sim</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">Entrada de números</td>
                    <td className="text-center py-3 px-4">👤 Manual</td>
                    <td className="text-center py-3 px-4">🤖 Automático (tempo real)</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">Execução de apostas</td>
                    <td className="text-center py-3 px-4">👤 Você aposta</td>
                    <td className="text-center py-3 px-4">👤 Você aposta</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">Sugestões de I.A.</td>
                    <td className="text-center py-3 px-4">✅ Sim</td>
                    <td className="text-center py-3 px-4">✅ Sim (em tempo real)</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">Estratégias profissionais</td>
                    <td className="text-center py-3 px-4">✅ Todas</td>
                    <td className="text-center py-3 px-4">✅ Todas</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Nível de dificuldade</td>
                    <td className="text-center py-3 px-4">⭐ Fácil</td>
                    <td className="text-center py-3 px-4">⭐ Muito fácil</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA Final */}
        <div className="mt-8 text-center">
          <Alert className="bg-green-900/30 border-green-600">
            <Zap className="h-5 w-5 text-green-400" />
            <AlertTitle className="text-green-400 text-lg font-bold">💡 Dica</AlertTitle>
            <AlertDescription className="text-gray-200">
              Não sabe qual escolher? Experimente os <strong className="text-purple-400">Sinais Inteligentes</strong> para 
              ver recomendações em tempo real, ou use o <strong className="text-blue-400">Modo Manual</strong> se preferir 
              controle total!
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </Layout>
  );
}

