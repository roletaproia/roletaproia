import { useEffect, useState } from "react";
import { Target, TrendingUp, Shield, Scale } from "lucide-react";

interface Recommendation {
  suggestedNumber: number;
  suggestedColor: string;
  suggestedDozen: number;
  suggestedColumn: number;
  suggestedParity: string;
  sector: string;
  neighbors: string;
  confidence: number;
  analysis: string;
}

interface AIRecommendationMultipleProps {
  recommendation: Recommendation;
}

export function AIRecommendationMultiple({ recommendation }: AIRecommendationMultipleProps) {
  const [isNew, setIsNew] = useState(false);
  const [lastRecommendation, setLastRecommendation] = useState<number | null>(null);

  useEffect(() => {
    if (recommendation.suggestedNumber !== lastRecommendation) {
      setIsNew(true);
      setLastRecommendation(recommendation.suggestedNumber);
      
      // Remove badge "NOVA!" após 5 segundos
      const timer = setTimeout(() => setIsNew(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [recommendation.suggestedNumber, lastRecommendation]);

  // IMPORTANTE: Tailwind precisa ver as classes COMPLETAS no código para incluí-las no build
  // NÃO usar template strings dinâmicas como `bg-${color}-600`
  const getColorClass = (color: string) => {
    // Validação: garantir que color nunca é undefined
    if (!color) {
      console.error("[AIRecommendationMultiple] Cor undefined recebida! Usando vermelho como fallback");
      return "bg-red-600";
    }
    
    // Mapa fixo de cores - Tailwind vai incluir todas essas classes no build
    const colorMap: Record<string, string> = {
      red: "bg-red-600",
      black: "bg-gray-900",
      green: "bg-green-600"
    };
    
    // Retornar classe do mapa ou fallback
    const colorClass = colorMap[color.toLowerCase()];
    if (!colorClass) {
      console.warn(`[AIRecommendationMultiple] Cor inválida: ${color}, usando vermelho como fallback`);
      return "bg-red-600";
    }
    
    return colorClass;
  };

  const getColorName = (color: string) => {
    if (!color) return "Vermelho"; // Fallback
    
    const colorNames: Record<string, string> = {
      red: "Vermelho",
      black: "Preto",
      green: "Verde"
    };
    
    return colorNames[color.toLowerCase()] || "Vermelho";
  };

  const getDozenName = (dozen: number) => {
    if (dozen === 1) return "1ª (1-12)";
    if (dozen === 2) return "2ª (13-24)";
    return "3ª (25-36)";
  };

  // Calcular valores sugeridos baseados na confiança
  const baseBet = 10; // R$ 10
  const numberBet = Math.round(baseBet * 0.5); // 50% para número (arriscado)
  const colorBet = Math.round(baseBet * 2); // 200% para cor (conservador)
  const dozenBet = Math.round(baseBet * 1.5); // 150% para dúzia (equilibrado)

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-xl p-6 border border-purple-500/30 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">
            🤖 Robô Inteligente - Escolha sua Estratégia
          </h3>
        </div>
        <div className="flex gap-2">
          {isNew && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
              NOVA!
            </span>
          )}
          <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
            AVANÇADA
          </span>
        </div>
      </div>

      {/* Múltiplas Opções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* OPÇÃO ARRISCADA - Número */}
        <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-lg p-4 border-2 border-red-500/50 hover:border-red-400 transition-all hover:scale-105">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-red-400" />
            <h4 className="text-sm font-bold text-red-300">OPÇÃO ARRISCADA</h4>
          </div>
          <p className="text-xs text-gray-400 mb-2">Alta Recompensa</p>
          
          <div className="bg-black/30 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-400 mb-1">Aposte no NÚMERO:</p>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-12 h-12 rounded-full ${getColorClass(recommendation.suggestedColor)} flex items-center justify-center shadow-lg border-2 border-white/50`}>
                <span className="text-2xl font-bold text-white">{recommendation.suggestedNumber}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Chance:</span>
              <span className="text-white font-bold">2.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pagamento:</span>
              <span className="text-green-400 font-bold">35:1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Valor sugerido:</span>
              <span className="text-yellow-400 font-bold">R$ {numberBet.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* OPÇÃO CONSERVADORA - Cor */}
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg p-4 border-2 border-green-500/50 hover:border-green-400 transition-all hover:scale-105">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-green-400" />
            <h4 className="text-sm font-bold text-green-300">OPÇÃO CONSERVADORA</h4>
          </div>
          <p className="text-xs text-gray-400 mb-2">Mais Segura</p>
          
          <div className="bg-black/30 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-400 mb-1">Aposte na COR:</p>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-8 h-8 rounded-full ${getColorClass(recommendation.suggestedColor)} border-2 border-white/50`}></div>
              <span className="text-xl font-bold text-white">
                {getColorName(recommendation.suggestedColor)}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Chance:</span>
              <span className="text-white font-bold">48.6%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pagamento:</span>
              <span className="text-green-400 font-bold">1:1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Valor sugerido:</span>
              <span className="text-yellow-400 font-bold">R$ {colorBet.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* OPÇÃO EQUILIBRADA - Dúzia */}
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-4 border-2 border-blue-500/50 hover:border-blue-400 transition-all hover:scale-105">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-bold text-blue-300">OPÇÃO EQUILIBRADA</h4>
          </div>
          <p className="text-xs text-gray-400 mb-2">Risco Médio</p>
          
          <div className="bg-black/30 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-400 mb-1">Aposte na DÚZIA:</p>
            <div className="flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {getDozenName(recommendation.suggestedDozen)}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Chance:</span>
              <span className="text-white font-bold">32.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pagamento:</span>
              <span className="text-green-400 font-bold">2:1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Valor sugerido:</span>
              <span className="text-yellow-400 font-bold">R$ {dozenBet.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-800/50 rounded-lg p-2 border border-purple-500/20">
          <p className="text-gray-400 text-xs mb-1">📐 Coluna:</p>
          <p className="text-white text-sm font-bold">{recommendation.suggestedColumn}ª</p>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-2 border border-purple-500/20">
          <p className="text-gray-400 text-xs mb-1">🔢 Par/Ímpar:</p>
          <p className="text-white text-sm font-bold capitalize">{recommendation.suggestedParity}</p>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-2 border border-purple-500/20">
          <p className="text-gray-400 text-xs mb-1">🎰 Setor:</p>
          <p className="text-white text-sm font-bold">{recommendation.sector.replace(/_/g, " ")}</p>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-2 border border-purple-500/20">
          <p className="text-gray-400 text-xs mb-1">✅ Confiança:</p>
          <p className="text-green-400 text-sm font-bold">{recommendation.confidence}%</p>
        </div>
      </div>

      {/* Vizinhos */}
      {recommendation.neighbors && (
        <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20 mb-4">
          <p className="text-gray-400 text-xs mb-2">📍 Vizinhos na roda:</p>
          <div className="flex gap-2 flex-wrap">
            {JSON.parse(recommendation.neighbors).map((num: number, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-purple-600/30 text-white text-sm rounded border border-purple-500/50">
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Análise */}
      {recommendation.analysis && (
        <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
          <p className="text-gray-400 text-xs mb-2">📈 Análise:</p>
          <ul className="space-y-1">
            {JSON.parse(recommendation.analysis).map((item: string, idx: number) => (
              <li key={idx} className="text-white text-sm flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Aviso */}
      <div className="mt-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3">
        <p className="text-yellow-200 text-xs">
          ⚠️ Lembre-se: A roleta é um jogo de sorte. Jogue com responsabilidade!
        </p>
      </div>
    </div>
  );
}
