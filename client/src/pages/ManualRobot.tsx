import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Hand, Gift, ExternalLink, Sparkles, TrendingUp, 
  AlertCircle, CheckCircle, ArrowLeft, Target 
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function ManualRobot() {
  const [, setLocation] = useLocation();
  const [numbers, setNumbers] = useState<string[]>(Array(10).fill(""));
  const [selectedStrategy, setSelectedStrategy] = useState("fibonacci");
  const [selectedBetType, setSelectedBetType] = useState<"color" | "parity" | "dozen">("color");
  const [suggestion, setSuggestion] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeManualMutation = trpc.robot.analyzeManual.useMutation();

  const open1winRegister = () => {
    window.open('https://1wyvrz.life/?open=register&p=f5q8', '_blank');
  };

  const open1winRoulette = () => {
    window.open('https://1whfxh.life/casino/play/v_evolution:RoletaAoVivo', '_blank');
  };

  const handleNumberChange = (index: number, value: string) => {
    // Aceitar apenas números de 0-36
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 36)) {
      const newNumbers = [...numbers];
      newNumbers[index] = value;
      setNumbers(newNumbers);
    }
  };

  const handleAnalyze = async () => {
    // Validar se todos os números foram preenchidos
    const filledNumbers = numbers.filter(n => n !== "");
    if (filledNumbers.length < 5) {
      alert("Por favor, insira pelo menos 5 números para análise.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeManualMutation.mutateAsync({
        numbers: numbers.filter(n => n !== "").map(n => parseInt(n)),
        strategy: selectedStrategy,
        betType: selectedBetType,
      });

      setSuggestion(result);
    } catch (error: any) {
      console.error("Erro ao analisar:", error);
      alert(error.message || "Erro ao analisar números");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearNumbers = () => {
    setNumbers(Array(10).fill(""));
    setSuggestion(null);
  };

  const getColorName = (color: string) => {
    if (color === "red") return "VERMELHO";
    if (color === "black") return "PRETO";
    return "VERDE";
  };

  const getParityName = (parity: string) => {
    return parity === "even" ? "PAR" : "ÍMPAR";
  };

  const getDozenName = (dozen: string) => {
    if (dozen === "first") return "1ª DÚZIA (1-12)";
    if (dozen === "second") return "2ª DÚZIA (13-24)";
    return "3ª DÚZIA (25-36)";
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => setLocation('/betting-robot/select-mode')}
            variant="outline"
            className="mb-4 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Seleção de Modo
          </Button>
          <h1 className="text-4xl font-bold mb-3 text-blue-400">
            <Hand className="inline-block mr-2 mb-1" />
            Robô Manual - Sugestões de IA
          </h1>
          <p className="text-xl text-gray-300">
            Digite os últimos números da roleta e receba sugestões inteligentes de apostas
          </p>
        </div>

        {/* Banner 1win */}
        <Alert className="mb-6 bg-gradient-to-r from-yellow-900/40 to-red-900/40 border-yellow-600">
          <Gift className="h-6 w-6 text-yellow-400" />
          <AlertTitle className="text-yellow-400 text-lg font-bold">🎰 Abra a Roleta da 1win</AlertTitle>
          <AlertDescription className="text-gray-200 mb-3">
            Para usar o robô manual, abra a <strong className="text-yellow-400">Roleta Brasileira da 1win</strong> em outra aba 
            e copie os últimos números que saíram.
          </AlertDescription>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={open1winRoulette}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir Roleta Brasileira
            </Button>
            <Button 
              onClick={open1winRegister}
              variant="outline"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20"
            >
              <Gift className="mr-2 h-4 w-4" />
              Criar Conta (Com Bônus)
            </Button>
          </div>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Painel de Input */}
          <div className="space-y-6">
            {/* Input de Números */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-blue-400">📊 Últimos Números da Roleta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                  Digite os últimos 10 números que saíram na roleta (do mais recente para o mais antigo).
                  Mínimo de 5 números.
                </p>
                
                <div className="grid grid-cols-5 gap-3">
                  {numbers.map((num, index) => (
                    <div key={index}>
                      <Label className="text-xs text-gray-400 mb-1 block">#{index + 1}</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        value={num}
                        onChange={(e) => handleNumberChange(index, e.target.value)}
                        placeholder="0-36"
                        className="bg-gray-700 text-white border-gray-600 text-center text-lg font-bold"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleClearNumbers}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Limpar Números
                </Button>
              </CardContent>
            </Card>

            {/* Configurações */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-blue-400">⚙️ Configurações da Análise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Estratégia</Label>
                  <select
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  >
                    <option value="fibonacci">Fibonacci</option>
                    <option value="martingale">Martingale</option>
                    <option value="dalembert">D'Alembert</option>
                    <option value="labouchere">Labouchere</option>
                  </select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Tipo de Aposta</Label>
                  <select
                    value={selectedBetType}
                    onChange={(e) => setSelectedBetType(e.target.value)}
                    className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  >
                    <option value="color">Cor (Vermelho/Preto)</option>
                    <option value="parity">Paridade (Par/Ímpar)</option>
                    <option value="dozen">Dúzia (1ª/2ª/3ª)</option>
                  </select>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isAnalyzing ? "Analisando..." : "Analisar e Sugerir"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Painel de Sugestão */}
          <div className="space-y-6">
            {suggestion ? (
              <>
                {/* Sugestão Principal */}
                <Card className="bg-gradient-to-br from-green-900/30 to-green-950/50 border-green-600">
                  <CardHeader>
                    <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      💡 Sugestão da IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-950/50 p-6 rounded-lg border border-green-700">
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-400 mb-2">APOSTE EM:</p>
                        <p className="text-4xl font-bold text-yellow-400">
                          {selectedBetType === "color" && getColorName(suggestion.suggestion)}
                          {selectedBetType === "parity" && getParityName(suggestion.suggestion)}
                          {selectedBetType === "dozen" && getDozenName(suggestion.suggestion)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-900/50 p-3 rounded">
                          <p className="text-xs text-gray-400 mb-1">Valor Sugerido</p>
                          <p className="text-xl font-bold text-white">
                            R$ {suggestion.betAmount?.toFixed(2) || "10,00"}
                          </p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded">
                          <p className="text-xs text-gray-400 mb-1">Confiança</p>
                          <p className="text-xl font-bold text-green-400">
                            {suggestion.confidence || 75}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <Alert className="bg-blue-900/30 border-blue-600">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                      <AlertTitle className="text-blue-400 font-bold">Estratégia: {selectedStrategy.toUpperCase()}</AlertTitle>
                      <AlertDescription className="text-gray-200">
                        {suggestion.reasoning || "Análise baseada nos padrões identificados nos últimos números."}
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={open1winRoulette}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-6 text-lg"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Abrir 1win e Apostar Agora
                    </Button>
                  </CardContent>
                </Card>

                {/* Estatísticas */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-yellow-400">📈 Análise dos Números</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Números analisados:</span>
                      <span className="text-white font-bold">{numbers.filter(n => n !== "").length}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Estratégia aplicada:</span>
                      <span className="text-white font-bold capitalize">{selectedStrategy}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Tipo de aposta:</span>
                      <span className="text-white font-bold">
                        {selectedBetType === "color" && "Cor"}
                        {selectedBetType === "parity" && "Paridade"}
                        {selectedBetType === "dozen" && "Dúzia"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="py-12 text-center">
                  <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-xl text-gray-400 mb-2">Aguardando análise...</p>
                  <p className="text-sm text-gray-500">
                    Digite os números e clique em "Analisar e Sugerir" para receber a sugestão da IA.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Dicas */}
        <Card className="mt-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">💡 Dicas para Usar o Modo Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">1. Abra a Roleta</p>
                  <p className="text-sm text-gray-400">
                    Abra a Roleta Brasileira da 1win em outra aba para acompanhar os resultados.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">2. Copie os Números</p>
                  <p className="text-sm text-gray-400">
                    Digite os últimos 5-10 números que saíram, do mais recente para o mais antigo.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">3. Escolha a Estratégia</p>
                  <p className="text-sm text-gray-400">
                    Selecione a estratégia que você quer usar (Fibonacci, Martingale, etc).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">4. Aposte Manualmente</p>
                  <p className="text-sm text-gray-400">
                    Use a sugestão da IA para fazer sua aposta manualmente na 1win.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

