interface AIRecommendationProps {
  recommendation: {
    suggestedNumber: number | null;
    suggestedColor: string;
    suggestedDozen: number | null;
    suggestedColumn: number | null;
    suggestedParity: string | null;
    sector: string | null;
    neighbors: string | null;
    analysis: string | null;
    confidence: number;
    betType: string;
  };
}

export default function AIRecommendation({ recommendation }: AIRecommendationProps) {
  // Parse JSON fields
  const neighbors = recommendation.neighbors ? JSON.parse(recommendation.neighbors) : [];
  const analysis = recommendation.analysis ? JSON.parse(recommendation.analysis) : [];

  // Helper functions
  const getColorClass = (color: string) => {
    if (color === "red") return "bg-red-600 text-white";
    if (color === "black") return "bg-gray-900 text-white";
    if (color === "green") return "bg-green-600 text-white";
    return "bg-gray-600 text-white";
  };

  const getColorName = (color: string) => {
    if (color === "red") return "Vermelho";
    if (color === "black") return "Preto";
    if (color === "green") return "Verde";
    return color;
  };

  const getDozenName = (dozen: number | null) => {
    if (dozen === 1) return "1ª (1-12)";
    if (dozen === 2) return "2ª (13-24)";
    if (dozen === 3) return "3ª (25-36)";
    return "N/A";
  };

  const getColumnName = (column: number | null) => {
    if (column === 1) return "1ª";
    if (column === 2) return "2ª";
    if (column === 3) return "3ª";
    return "N/A";
  };

  const getParityName = (parity: string | null) => {
    if (parity === "par") return "Par";
    if (parity === "impar") return "Ímpar";
    return "N/A";
  };

  const getSectorName = (sector: string | null) => {
    if (sector === "vizinhos_zero") return "Vizinhos do Zero";
    if (sector === "orfaos") return "Órfãos";
    if (sector === "terceiro") return "Terceiro da Roleta";
    return "N/A";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-400";
    if (confidence >= 60) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
          🤖 Recomendação da I.A.
        </h3>
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          AVANÇADA
        </span>
      </div>

      {/* Informações Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {/* Número Sugerido */}
        {(recommendation.suggestedNumber !== undefined && recommendation.suggestedNumber !== null) && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
            <p className="text-gray-400 text-xs mb-1">🎯 Número:</p>
            <p className="text-2xl font-bold text-white">{recommendation.suggestedNumber}</p>
          </div>
        )}

        {/* Cor */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
          <p className="text-gray-400 text-xs mb-1">🎨 Cor:</p>
          <span className={`inline-block px-3 py-1 rounded-md text-sm font-bold ${getColorClass(recommendation.suggestedColor)}`}>
            {getColorName(recommendation.suggestedColor)}
          </span>
        </div>

        {/* Dúzia */}
        {recommendation.suggestedDozen && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
            <p className="text-gray-400 text-xs mb-1">📊 Dúzia:</p>
            <p className="text-lg font-bold text-white">{getDozenName(recommendation.suggestedDozen)}</p>
          </div>
        )}

        {/* Coluna */}
        {recommendation.suggestedColumn && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
            <p className="text-gray-400 text-xs mb-1">📐 Coluna:</p>
            <p className="text-lg font-bold text-white">{getColumnName(recommendation.suggestedColumn)}</p>
          </div>
        )}

        {/* Par/Ímpar */}
        {recommendation.suggestedParity && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
            <p className="text-gray-400 text-xs mb-1">🔢 Par/Ímpar:</p>
            <p className="text-lg font-bold text-white">{getParityName(recommendation.suggestedParity)}</p>
          </div>
        )}

        {/* Setor */}
        {recommendation.sector && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
            <p className="text-gray-400 text-xs mb-1">🎰 Setor:</p>
            <p className="text-sm font-bold text-white">{getSectorName(recommendation.sector)}</p>
          </div>
        )}

        {/* Confiança */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
          <p className="text-gray-400 text-xs mb-1">✅ Confiança:</p>
          <p className={`text-2xl font-bold ${getConfidenceColor(recommendation.confidence)}`}>
            {recommendation.confidence}%
          </p>
        </div>
      </div>

      {/* Vizinhos */}
      {neighbors.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
          <p className="text-gray-400 text-xs mb-2">📍 Vizinhos na roda:</p>
          <div className="flex gap-2 flex-wrap">
            {neighbors.map((num: number, idx: number) => (
              <span key={idx} className="bg-purple-600/30 text-purple-200 px-3 py-1 rounded-md text-sm font-semibold">
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Análise */}
      {analysis.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
          <p className="text-gray-300 text-sm font-semibold mb-2">📈 Análise:</p>
          <ul className="space-y-1">
            {analysis.map((item: string, idx: number) => (
              <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Aviso */}
      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
        <p className="text-xs text-yellow-300 text-center">
          ⚠️ Lembre-se: A roleta é um jogo de sorte. Jogue com responsabilidade!
        </p>
      </div>
    </div>
  );
}
