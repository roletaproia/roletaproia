import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Trash2, Plus, Edit2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StrategyForm from "@/components/StrategyForm";
import type { StrategyType } from "@shared/types";

const StrategyTypeLabels: Record<StrategyType, string> = {
  flatBetting: "💰 Aposta Fixa",
  fibonacci: "🔢 Fibonacci",
  martingale: "📈 Martingale",
  reverseMartingale: "🔄 Reverse Martingale",
  dalembert: "⚖️ D'Alembert",
  labouchere: "📊 Labouchère",
  custom: "⚙️ Customizada",
};

export default function Strategies() {
  const { data: strategies, isLoading, refetch } = trpc.strategies.list.useQuery();
  const createMutation = trpc.strategies.create.useMutation();
  const deleteMutation = trpc.strategies.delete.useMutation();
  const updateMutation = trpc.strategies.update.useMutation();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (formData: {
    name: string;
    type: StrategyType;
    baseBetAmount: number;
    config: string;
  }) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          name: formData.name,
          type: formData.type,
          baseBetAmount: formData.baseBetAmount,
          config: formData.config,
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          type: formData.type,
          baseBetAmount: formData.baseBetAmount,
          config: formData.config,
        });
      }

      setEditingId(null);
      setOpen(false);
      refetch();
    } catch (error) {
      console.error("Erro ao salvar estratégia:", error);
      alert("Erro ao salvar estratégia. Verifique os dados e tente novamente.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta estratégia?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        refetch();
      } catch (error) {
        console.error("Erro ao deletar estratégia:", error);
        alert("Erro ao deletar estratégia.");
      }
    }
  };

  const handleEdit = (strategy: any) => {
    setEditingId(strategy.id);
    setOpen(true);
  };

  const selectedStrategy = strategies?.find((s) => s.id === editingId);

  return (
    <Layout>
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-red-900/30 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-yellow-400">Estratégias de Apostas</h1>
          <p className="text-gray-200">Crie e gerencie suas estratégias de apostas automáticas</p>
        </div>
        <Dialog open={open} onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) {
            setEditingId(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Estratégia
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-red-700/30 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar" : "Criar"} Estratégia</DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Atualize os parâmetros da sua estratégia"
                  : "Configure sua estratégia de apostas de forma simples e intuitiva"}
              </DialogDescription>
            </DialogHeader>
            <StrategyForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setOpen(false);
                setEditingId(null);
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
              initialData={
                selectedStrategy
                  ? {
                      name: selectedStrategy.name,
                      type: selectedStrategy.type as StrategyType,
                      baseBetAmount: selectedStrategy.baseBetAmount,
                      config: selectedStrategy.config || "{}",
                    }
                  : undefined
              }
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="text-gray-200 ml-4">Carregando estratégias...</p>
          </div>
        ) : strategies && strategies.length > 0 ? (
          <div className="grid gap-4">
            {strategies.map((strategy) => (
              <Card
                key={strategy.id}
                className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30 hover:border-red-700/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-white">
                        {strategy.name}
                      </CardTitle>
                      <CardDescription className="mt-2 space-y-1">
                        <div>
                          Tipo: <span className="text-yellow-400 font-semibold">
                            {StrategyTypeLabels[strategy.type as StrategyType]}
                          </span>
                        </div>
                        <div>
                          Aposta Base: <span className="text-green-400 font-semibold">
                            R$ {(strategy.baseBetAmount / 100).toFixed(2)}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          strategy.isActive
                            ? "bg-green-900/30 text-green-400 border border-green-700/50"
                            : "bg-gray-900/30 text-gray-200 border border-gray-700/50"
                        }`}
                      >
                        {strategy.isActive ? "✓ Ativa" : "○ Inativa"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(strategy)}
                      className="flex-1 border-purple-700/30 hover:bg-purple-900/20"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(strategy.id)}
                      className="flex-1"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 text-5xl">🎯</div>
              <p className="text-gray-200 mb-4">Você ainda não criou nenhuma estratégia.</p>
              <p className="text-gray-500 text-sm mb-6">
                Comece criando sua primeira estratégia de apostas. Escolha entre Fibonacci, Martingale,
                D'Alembert, Labouchère ou crie uma customizada!
              </p>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Estratégia
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Informações sobre Estratégias */}
      <div className="p-6 border-t border-red-900/30">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">📚 Conheça as Estratégias</h2>
        <p className="text-gray-200 mb-6">
          Antes de configurar, entenda como cada estratégia funciona, seus prós e contras.
        </p>

        <div className="grid grid-cols-1 gap-6">
          {/* Aposta Fixa */}
          <Card className="bg-slate-800/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-white">💰 Aposta Fixa (Flat Betting)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <h3 className="font-semibold text-base text-yellow-400 mb-1">Como Funciona:</h3>
              <p className="text-gray-200 mb-3">
                Você aposta sempre o mesmo valor, independentemente de ganhar ou perder. Não há progressão de apostas.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Prós:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Muito mais simples e menos arriscada.</li>
                    <li>Melhor para jogadores que querem apenas diversão.</li>
                    <li>Evita grandes perdas rápidas.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Contras:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Lucro potencial menor.</li>
                    <li>Não altera a vantagem da casa.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fibonacci */}
          <Card className="bg-slate-800/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-white">🔢 Sistema Fibonacci</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <h3 className="font-semibold text-base text-yellow-400 mb-1">Como Funciona:</h3>
              <p className="text-gray-200 mb-3">
                Usa a sequência de Fibonacci (1, 1, 2, 3, 5, 8, 13...). Se perder, avança na sequência. Se ganhar, retrocede dois passos.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Prós:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Mais "moderado" do que o Martingale (as apostas aumentam mais devagar).</li>
                    <li>Dá uma estrutura ao jogo, ajudando a controlar o bankroll.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Contras:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Ainda pode levar a perdas grandes se houver muitas derrotas consecutivas.</li>
                    <li>O progresso e lucro tendem a ser mais lentos.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Martingale */}
          <Card className="bg-slate-800/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-white">📈 Sistema Martingale</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <h3 className="font-semibold text-base text-yellow-400 mb-1">Como Funciona:</h3>
              <p className="text-gray-200 mb-3">
                Se perder, dobra a aposta na rodada seguinte. Se ganhar, volta à aposta inicial. O objetivo é recuperar todas as perdas e obter lucro igual à aposta inicial.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Prós:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Muito simples de entender.</li>
                    <li>Pode dar lucro rápido se evitar uma sequência longa de perdas.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Contras:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Requer bankroll muito grande se surgir uma sequência de perdas.</li>
                    <li>Há limites máximos de aposta na mesa.</li>
                    <li>Aumenta o risco sem alterar a vantagem da casa.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reverse Martingale (Paroli) */}
          <Card className="bg-slate-800/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-white">🔄 Reverse Martingale (Paroli)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <h3 className="font-semibold text-base text-yellow-400 mb-1">Como Funciona:</h3>
              <p className="text-gray-200 mb-3">
                Inverte a lógica do Martingale: você aumenta a aposta após cada vitória. Após uma perda, volta à aposta inicial.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Prós:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Menor risco de "escalar" apostas após muitas perdas.</li>
                    <li>Permite aproveitar possíveis "rachas" de vitórias.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Contras:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Depende de uma sequência de vitórias, que são mais raras no longo prazo.</li>
                    <li>Se a sequência acabar, pode perder o ganho acumulado.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* D'Alembert */}
          <Card className="bg-slate-800/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-white">⚖️ Sistema D'Alembert</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <h3 className="font-semibold text-base text-yellow-400 mb-1">Como Funciona:</h3>
              <p className="text-gray-200 mb-3">
                Aumenta a aposta em 1 unidade após uma perda e reduz em 1 unidade após uma vitória. É uma progressão negativa mais suave.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Prós:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Menor escalada de risco comparado ao Martingale.</li>
                    <li>Mais "seguro" para quem quer algo mais conservador.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Contras:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Ainda não elimina a vantagem da casa.</li>
                    <li>Em longas sequências de perdas, o sistema pode implicar perdas significativas.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Labouchère */}
          <Card className="bg-slate-800/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-white">📊 Sistema Labouchère</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <h3 className="font-semibold text-base text-yellow-400 mb-1">Como Funciona:</h3>
              <p className="text-gray-200 mb-3">
                Usa uma sequência de números. A aposta é a soma do primeiro e do último número da sequência. Se ganhar, risca os dois. Se perder, adiciona o valor apostado ao final.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Prós:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Pode dar maior senso de controle, definindo o objetivo de lucro.</li>
                    <li>Estrutura mais personalizada.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Contras:</h4>
                  <ul className="list-disc list-inside text-gray-200 ml-2 space-y-1">
                    <li>Pode escalar rápido em perdas – o risco aumenta bastante.</li>
                    <li>Complexidade maior.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </Layout>
  );
}

