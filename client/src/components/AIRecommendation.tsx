import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIRecommendationProps {
  recommendation: {
    suggestedNumber?: number;
    suggestedColor?: string;
    suggestedDozen?: number;
    suggestedColumn?: number;
    suggestedParity?: string;
    sector?: string;
    neighbors?: string;
    analysis?: string;
    confidence: number;
    betType: string;
    suggestedAmount: number;
    strategy: string;
  } | null;
}

export default function AIRecommendation({ recommendation }: AIRecommendationProps) {
  if (!recommendation) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-red-900/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            🤖 Recomendação da I.A.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-400">Aguardando recomendação...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Parse JSON fields
  let neighbors: number[] = [];
  let analysis: string[] = [];

  try {
    if (recommendation.neighbors) {
      neighbors = JSON.parse(recommendation.neighbors);
    }
    if (recommendation.analysis) {
      analysis = JSON.parse(recommendation.analysis);
    }
  } catch (e) {
    console.error("Error parsing recommendation data:", e);
  }

  // Traduzir setor
  const sectorTranslation: { [key: string]: string } = {
    vizinhos_zero: "Vizinhos do Zero",
    orfaos: "Órfãos",
    terceiro: "Terceiro da Roleta",
  };

  const sectorName = recommendation.sector
    ? sectorTranslation[recommendation.sector] || recommendation.sector
    : "N/A";

  // Cor do badge
  const getColorClass = (color: string) => {
    if (color === "red") return "bg-red-500 hover:bg-red-600";
    if (color === "black") return "bg-gray-900 hover:bg-gray-800";
    return "bg-green-500 hover:bg-green-600";
  };

  // Cor do texto de confiança
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-400";
    if (confidence >= 65) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900 border-purple-600/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span>Recomendação da I.A.</span>
          <Badge className="ml-auto bg-purple-600">AVANÇADA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aposta Principal */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-600/20">
          <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">
            🎯 Aposta Principal
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Número Sugerido */}
            {(recommendation.suggestedNumber !== undefined && recommendation.suggestedNumber !== null) && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 mb-1">📍 Número:</span>
                <div
                  className={`${getColorClass(
                    recommendation.suggestedColor || "red"
                  )} text-white font-bold text-2xl rounded-lg py-2 text-center`}
                >
                  {recommendation.suggestedNumber}
                </div>
              </div>
            )}

            {/* Cor */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">🎨 Cor:</span>
              <Badge
                className={`${getColorClass(
                  recommendation.suggestedColor || recommendation.betType
                )} text-white text-lg py-2 justify-center`}
              >
                {recommendation.suggestedColor === "red"
                  ? "VERMELHO"
                  : recommendation.suggestedColor === "black"
                  ? "PRETO"
                  : "VERDE"}
              </Badge>
            </div>

            {/* Dúzia */}
            {recommendation.suggestedDozen && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 mb-1">📊 Dúzia:</span>
                <div className="bg-blue-600 text-white font-semibold rounded-lg py-2 text-center">
                  {recommendation.suggestedDozen}ª Dúzia
                </div>
              </div>
            )}

            {/* Coluna */}
            {recommendation.suggestedColumn && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 mb-1">📐 Coluna:</span>
                <div className="bg-indigo-600 text-white font-semibold rounded-lg py-2 text-center">
                  {recommendation.suggestedColumn}ª Coluna
                </div>
              </div>
            )}

            {/* Par/Ímpar */}
            {recommendation.suggestedParity && (
              <div className="flex flex-col col-span-2">
                <span className="text-xs text-gray-400 mb-1">🔢 Paridade:</span>
                <div className="bg-cyan-600 text-white font-semibold rounded-lg py-2 text-center uppercase">
                  {recommendation.suggestedParity}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Setor da Roda */}
        {recommendation.sector && (
          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-600/20">
            <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">
              🎰 Setor da Roda
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">🎡 Setor:</span>
                <Badge className="bg-orange-600">{sectorName}</Badge>
              </div>
              {neighbors.length > 0 && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-2">
                    📍 Vizinhos na roda:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {neighbors.map((num, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-700 text-white px-3 py-1 rounded-md font-semibold text-sm"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Análise */}
        {analysis.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-600/20">
            <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">
              📈 Análise da I.A.
            </h3>
            <ul className="space-y-2">
              {analysis.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <span className="text-gray-300">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Confiança */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg p-4 border border-purple-500/30">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">💡 Confiança</p>
            <p
              className={`text-4xl font-bold ${getConfidenceColor(
                recommendation.confidence
              )}`}
            >
              {recommendation.confidence}%
            </p>
          </div>
        </div>

        {/* Aviso */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
          <p className="text-xs text-yellow-300 text-center">
            ⚠️ Lembre-se: A roleta é um jogo de sorte. Jogue com responsabilidade!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
