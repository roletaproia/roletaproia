import { useState } from "react";
import { ExternalLink, Gift, CheckCircle, X } from "lucide-react";

export function Open1WinButton() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenRoulette = () => {
    // Abre direto a Lightning Roulette na 1Win
    window.open("https://1wyvrz.life/casino/play/v_evolution:lightningroulette?p=f5q8", "_blank");
    setShowModal(false);
  };

  const handleRegister = () => {
    // Abre página de cadastro com bônus
    window.open("https://1wyvrz.life/?open=register&p=f5q8", "_blank");
    setShowModal(false);
  };

  return (
    <>
      {/* Botão Principal */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 border-2 border-yellow-400 animate-pulse"
      >
        <span className="text-2xl">🎰</span>
        <span className="text-lg">CLIQUE AQUI E ABRA A ROLETA CORRETA!</span>
        <ExternalLink className="w-6 h-6" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-md w-full border-2 border-purple-500/50 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🎰</span>
                <h2 className="text-2xl font-bold text-white">Lightning Roulette</h2>
              </div>
              <p className="text-purple-100 text-sm">Evolution Gaming</p>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-6">
                <p className="text-white text-center text-lg mb-2">
                  Esta roleta é na <span className="font-bold text-yellow-400">1WIN</span>
                </p>
                <p className="text-gray-300 text-center text-sm">
                  Casa de apostas que recomendamos!
                </p>
              </div>

              <p className="text-white text-center text-xl font-bold mb-6">
                Você já tem cadastro nela?
              </p>

              {/* Botões */}
              <div className="space-y-3">
                {/* SIM - Já tenho cadastro */}
                <button
                  onClick={handleOpenRoulette}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 border-2 border-green-400"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg">SIM, JÁ TENHO CADASTRO</span>
                  <ExternalLink className="w-5 h-5" />
                </button>

                {/* NÃO - Quero cadastrar */}
                <button
                  onClick={handleRegister}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 border-2 border-yellow-400"
                >
                  <Gift className="w-6 h-6" />
                  <div className="flex flex-col items-start">
                    <span className="text-lg">NÃO, QUERO CADASTRAR</span>
                    <span className="text-xs text-yellow-200">Com bônus de boas-vindas!</span>
                  </div>
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>

              {/* Info adicional */}
              <div className="mt-6 bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
                <p className="text-purple-200 text-xs text-center">
                  💡 <span className="font-bold">Dica:</span> Use nosso link para garantir o melhor bônus!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
