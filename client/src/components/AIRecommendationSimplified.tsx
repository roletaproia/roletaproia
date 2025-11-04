import { useState, useEffect } from "react";
import { Target, TrendingUp, AlertTriangle, CheckCircle, XCircle, Loader } from "lucide-react";

interface Recommendation {
  hasSignal: boolean;
  suggestedNumber: number | null;
  suggestedColor: string | null;
  confidence: number;
  analysis: string[];
  confluenceScore: number;
}

interface AIRecommendationSimplifiedProps {
  recommendation: Recommendation;
  lastResult: number | null; // Último número que saiu
}

export function AIRecommendationSimplified({ recommendation, lastResult }: AIRecommendationSimplifiedProps) {
  const [martingaleLevel, setMartingaleLevel] = useState(0); // 0, 1, 2
  const [lastRecommendation, setLastRecommendation] = useState<{
    number: number | null;
    color: string | null;
  } | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'partial' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Estado de análise
  const [previousResult, setPreviousResult] = useState<number | null>(null);

  // Detectar quando chega novo resultado
  useEffect(() => {
    if (lastResult !== null && lastResult !== previousResult) {
      // Novo resultado chegou!
      setIsAnalyzing(true);
      setPreviousResult(lastResult);
      
      // Mostrar "ANALISANDO" por 3 segundos
      const analyzeTimer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 3000);
      
      return () => clearTimeout(analyzeTimer);
    }
  }, [lastResult, previousResult]);

  // Verificar se acertou/errou quando novo resultado chega
  useEffect(() => {
    if (lastResult !== null && lastRecommendation && !isAnalyzing) {
      const resultColor = getNumberColor(lastResult);
      
      // Acertou o número exato
      if (lastResult === lastRecommendation.number) {
        setFeedback({
          type: 'success',
          message: `A I.A. ACERTOU! 🎉 Número ${lastResult} (${getColorName(resultColor)})`
        });
        setMartingaleLevel(0); // Zera Martingale
      }
      // Acertou a cor
      else if (resultColor === lastRecommendation.color) {
        setFeedback({
          type: 'partial',
          message: `ACERTOU A COR! 👍 ${getColorName(resultColor)}`
        });
        setMartingaleLevel(0); // Zera Martingale
      }
      // Errou
      else {
        setFeedback({
          type: 'error',
          message: `A I.A. ERROU ❌ Saiu: ${lastResult} (${getColorName(resultColor)})`
        });
        
        // Aumenta Martingale (máximo 2)
        if (martingaleLevel < 2) {
          setMartingaleLevel(prev => prev + 1);
        }
      }

      // Limpar feedback após 5 segundos
      const timer = setTimeout(() => {
        setFeedback({ type: null, message: '' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [lastResult]);

  // Atualizar última recomendação
  useEffect(() => {
    if (recommendation.hasSignal && recommendation.suggestedNumber) {
      setLastRecommendation({
        number: recommendation.suggestedNumber,
        color: recommendation.suggestedColor,
      });
    }
  }, [recommendation]);

  const getNumberColor = (num: number): string => {
    if (num === 0) return 'green';
    const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return RED_NUMBERS.includes(num) ? 'red' : 'black';
  };

  const getColorClass = (color: string | null) => {
    if (!color) return "bg-gray-600";
    const colorMap: Record<string, string> = {
      red: "bg-red-600",
      black: "bg-gray-900",
      green: "bg-green-600"
    };
    return colorMap[color.toLowerCase()] || "bg-gray-600";
  };

  const getColorName = (color: string | null) => {
    if (!color) return "Indefinido";
    const colorNames: Record<string, string> = {
      red: "Vermelho",
      black: "Preto",
      green: "Verde"
    };
    return colorNames[color.toLowerCase()] || "Indefinido";
  };

  const calculateMartingaleBet = (baseValue: number, level: number) => {
    return baseValue * Math.pow(2, level);
  };

  // Se está analisando, mostrar mensagem de análise
  if (isAnalyzing) {
    return (
      <div className="space-y-4">
        {/* Mensagem de Análise */}
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-8 border border-blue-500/30 shadow-xl text-center">
          <Loader className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-2xl font-bold text-white mb-3">
            🔍 ANALISANDO PADRÕES...
          </h3>
          <p className="text-blue-200 text-lg mb-4">
            🤖 Criando a melhor entrada para você!
          </p>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              💡 Aguarde alguns instantes...
            </p>
          </div>
        </div>

        {/* Feedback (se houver) */}
        {feedback.type && (
          <FeedbackCard feedback={feedback} martingaleLevel={martingaleLevel} />
        )}
      </div>
    );
  }

  // Se não há sinal, mostrar mensagem de aguardo
  if (!recommendation.hasSignal) {
    return (
      <div className="space-y-4">
        {/* Mensagem de Aguardo */}
        <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-8 border border-yellow-500/30 shadow-xl text-center">
          <Loader className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-2xl font-bold text-white mb-3">
            ⏳ AGUARDANDO ENTRADA CERTEIRA
          </h3>
          <p className="text-yellow-200 text-lg mb-4">
            🤖 O Robô I.A. está analisando padrões...
          </p>
          <div className="bg-black/30 rounded-lg p-4 space-y-2">
            <p className="text-gray-300 text-sm">
              💡 Ainda não há confluência suficiente entre as estratégias
            </p>
            <p className="text-gray-400 text-xs">
              {recommendation.analysis.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </p>
          </div>
          <p className="text-yellow-300 font-semibold mt-4">
            ⚠️ Aguarde a próxima oportunidade!
          </p>
        </div>

        {/* Feedback (se houver) */}
        {feedback.type && (
          <FeedbackCard feedback={feedback} martingaleLevel={martingaleLevel} />
        )}
      </div>
    );
  }

  // Se há sinal, mostrar recomendação simplificada
  return (
    <div className="space-y-4">
      {/* Card de Recomendação Simplificado */}
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-xl p-6 border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">
            🤖 RECOMENDAÇÃO I.A.
          </h3>
          <span className="ml-auto px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
            SINAL CONFIRMADO
          </span>
        </div>

        {/* Informações da Aposta */}
        <div className="bg-black/30 rounded-lg p-6 mb-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Número */}
            <div className="text-center col-span-2">
              <p className="text-gray-400 text-sm mb-2">🎯 Número:</p>
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className={`${getColorClass(recommendation.suggestedColor)} w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                  {recommendation.suggestedNumber}
                </div>
              </div>
            </div>
            
            {/* Cor */}
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">🎨 Cor:</p>
              <p className="text-white text-lg font-bold">
                {getColorName(recommendation.suggestedColor)}
              </p>
            </div>

            {/* Par/Ímpar */}
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">🔢 Par/Ímpar:</p>
              <p className="text-white text-lg font-bold">
                {recommendation.suggestedNumber && recommendation.suggestedNumber % 2 === 0 ? 'Par' : 'Ímpar'}
              </p>
            </div>

            {/* Dúzia */}
            <div className="text-center col-span-2">
              <p className="text-gray-400 text-xs mb-1">📊 Dúzia:</p>
              <p className="text-white text-lg font-bold">
                {recommendation.suggestedNumber && recommendation.suggestedNumber <= 12 
                  ? '1ª (1-12)' 
                  : recommendation.suggestedNumber && recommendation.suggestedNumber <= 24
                  ? '2ª (13-24)'
                  : '3ª (25-36)'}
              </p>
            </div>
          </div>
        </div>

        {/* Análise */}
        <div className="bg-black/20 rounded-lg p-4 mb-4">
          <p className="text-gray-400 text-xs mb-2">📊 ANÁLISE:</p>
          <div className="space-y-1">
            {recommendation.analysis.slice(0, 3).map((line, i) => (
              <p key={i} className="text-gray-300 text-sm">• {line}</p>
            ))}
          </div>
          <p className="text-purple-300 text-xs mt-2">
            ✅ {recommendation.confluenceScore}/5 estratégias concordam
          </p>
        </div>

        {/* Aviso */}
        <p className="text-yellow-300 text-xs text-center">
          ⚠️ Lembre-se: A roleta é um jogo de sorte. Jogue com responsabilidade!
        </p>
      </div>

      {/* Feedback e Martingale */}
      {feedback.type && (
        <FeedbackCard feedback={feedback} martingaleLevel={martingaleLevel} />
      )}

      {/* Card Martingale (sempre visível) */}
      <MartingaleCard martingaleLevel={martingaleLevel} />
    </div>
  );
}

// Componente de Feedback
function FeedbackCard({ feedback, martingaleLevel }: { 
  feedback: { type: 'success' | 'partial' | 'error' | null; message: string };
  martingaleLevel: number;
}) {
  if (!feedback.type) return null;

  const bgColor = feedback.type === 'success' 
    ? 'from-green-900/40 to-emerald-900/40 border-green-500/30'
    : feedback.type === 'partial'
    ? 'from-yellow-900/40 to-amber-900/40 border-yellow-500/30'
    : 'from-red-900/40 to-rose-900/40 border-red-500/30';

  const Icon = feedback.type === 'success' 
    ? CheckCircle 
    : feedback.type === 'partial'
    ? AlertTriangle
    : XCircle;

  const iconColor = feedback.type === 'success'
    ? 'text-green-400'
    : feedback.type === 'partial'
    ? 'text-yellow-400'
    : 'text-red-400';

  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-xl p-6 border shadow-xl`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <p className="text-white text-lg font-bold">{feedback.message}</p>
      </div>

      {feedback.type === 'success' && (
        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-green-300 font-semibold">💰 MARTINGALE</p>
          <p className="text-white">✅ Lucro confirmado!</p>
          <p className="text-gray-300 text-sm">🔄 Próxima aposta: Valor inicial</p>
          <p className="text-green-200 text-sm mt-2">🎉 Parabéns! Reinicie o ciclo!</p>
        </div>
      )}

      {feedback.type === 'partial' && (
        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-yellow-300 font-semibold">💰 MARTINGALE</p>
          <p className="text-white">✅ Cor certa = Lucro!</p>
          <p className="text-gray-300 text-sm">🔄 Reinicie o ciclo</p>
        </div>
      )}

      {feedback.type === 'error' && martingaleLevel < 2 && (
        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-red-300 font-semibold">💰 MARTINGALE - GALE {martingaleLevel}</p>
          <p className="text-white">⚠️ Dobre o valor na próxima aposta</p>
          <p className="text-gray-300 text-sm">🎯 Aguarde nova recomendação</p>
          <p className="text-yellow-200 text-sm mt-2">💡 Recuperação em andamento...</p>
        </div>
      )}

      {feedback.type === 'error' && martingaleLevel >= 2 && (
        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-red-300 font-semibold">💰 MARTINGALE - GALE {martingaleLevel}</p>
          <p className="text-red-400 font-bold">🛑 ATENÇÃO: Limite de recuperação!</p>
          <p className="text-white">⛔ NÃO faça mais gales!</p>
          <p className="text-gray-300 text-sm mt-2">💡 Aguarde novo sinal para recomeçar</p>
        </div>
      )}
    </div>
  );
}

// Componente de Martingale
function MartingaleCard({ martingaleLevel }: { martingaleLevel: number }) {
  const baseValue = 10; // R$ 10

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-500/30 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-6 h-6 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">
          💰 CALCULADORA MARTINGALE
        </h3>
      </div>

      <div className="bg-black/30 rounded-lg p-4 space-y-2">
        <p className="text-gray-400 text-sm">Valor inicial: R$ {baseValue.toFixed(2)}</p>
        
        <div className="space-y-1">
          <p className={`text-sm ${martingaleLevel === 0 ? 'text-white font-bold' : 'text-gray-400'}`}>
            Gale 0: R$ {baseValue.toFixed(2)} {martingaleLevel === 0 && '← ATUAL'}
          </p>
          <p className={`text-sm ${martingaleLevel === 1 ? 'text-yellow-300 font-bold' : 'text-gray-400'}`}>
            Gale 1: R$ {(baseValue * 2).toFixed(2)} (recupera + R$ {baseValue.toFixed(2)}) {martingaleLevel === 1 && '← ATUAL'}
          </p>
          <p className={`text-sm ${martingaleLevel === 2 ? 'text-red-300 font-bold' : 'text-gray-400'}`}>
            Gale 2: R$ {(baseValue * 4).toFixed(2)} (recupera + R$ {baseValue.toFixed(2)}) {martingaleLevel === 2 && '← ATUAL (LIMITE!)'}
          </p>
        </div>

        <div className="border-t border-gray-600 pt-2 mt-2">
          <p className="text-yellow-300 text-sm">⚠️ Total em risco: R$ {(baseValue * 7).toFixed(2)}</p>
          <p className="text-green-300 text-sm">✅ Lucro ao acertar: R$ {baseValue.toFixed(2)}</p>
        </div>

        <p className="text-gray-400 text-xs mt-3">
          💡 Recomendado: Máximo 2 gales para gestão de banca segura
        </p>
      </div>
    </div>
  );
}
