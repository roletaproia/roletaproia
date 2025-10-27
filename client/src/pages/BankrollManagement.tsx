import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function BankrollManagement() {
  const { data: bankroll, isLoading, refetch } = trpc.bankroll.get.useQuery();
  const updateMutation = trpc.bankroll.update.useMutation();
  const { data: betHistory } = trpc.bankroll.getBetHistory.useQuery({ limit: 100 });

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    stopLoss: "",
    stopWin: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        stopLoss: formData.stopLoss ? parseInt(formData.stopLoss) * 100 : undefined,
        stopWin: formData.stopWin ? parseInt(formData.stopWin) * 100 : undefined,
      });

      setFormData({ stopLoss: "", stopWin: "" });
      setOpen(false);
      refetch();
    } catch (error) {
      console.error("Erro ao atualizar banca:", error);
    }
  };

  const formatCurrency = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2)}`;
  };

  const calculateProfit = () => {
    if (!bankroll) return 0;
    return bankroll.currentBalance - bankroll.initialBalance;
  };

  const profit = calculateProfit();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-yellow-400">Gerenciamento de Banca</h1>
          <p className="text-gray-200">Acompanhe seu saldo, ganhos e perdas em tempo real</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">Configurar Limites</Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-red-700/30">
            <DialogHeader>
              <DialogTitle>Configurar Limites de Banca</DialogTitle>
              <DialogDescription>Defina limites de perda e ganho para proteção</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Stop Loss (R$)</label>
                <Input
                  type="number"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                  placeholder="Limite de perda"
                  className="mt-1 bg-slate-800 border-red-700/30"
                  min="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Stop Win (R$)</label>
                <Input
                  type="number"
                  value={formData.stopWin}
                  onChange={(e) => setFormData({ ...formData, stopWin: e.target.value })}
                  placeholder="Limite de ganho"
                  className="mt-1 bg-slate-800 border-red-700/30"
                  min="0"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-red-600 hover:bg-red-700 flex-1">
                  Salvar Limites
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-6 space-y-8">
        {/* Main Stats */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Saldo Atual */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader>
              <CardTitle className="text-gray-200">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-2">
                {isLoading ? "..." : formatCurrency(bankroll?.currentBalance || 0)}
              </div>
              <p className="text-sm text-gray-200">
                Inicial: {isLoading ? "..." : formatCurrency(bankroll?.initialBalance || 0)}
              </p>
            </CardContent>
          </Card>

          {/* Lucro/Prejuízo */}
          <Card className={`bg-gradient-to-br ${profit >= 0 ? "from-green-900/20" : "from-red-900/20"} to-transparent ${profit >= 0 ? "border-green-700/30" : "border-red-700/30"}`}>
            <CardHeader>
              <CardTitle className="text-gray-200">Lucro/Prejuízo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold mb-2 flex items-center ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {isLoading ? "..." : formatCurrency(profit)}
                {profit >= 0 ? <TrendingUp className="ml-2 h-8 w-8" /> : <TrendingDown className="ml-2 h-8 w-8" />}
              </div>
              <p className="text-sm text-gray-200">
                {profit >= 0 ? "Ganho" : "Perda"} acumulado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-900/20 to-transparent border-green-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200">Total de Ganhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {isLoading ? "..." : formatCurrency(bankroll?.totalWins || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200">Total de Perdas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {isLoading ? "..." : formatCurrency(bankroll?.totalLosses || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-transparent border-blue-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200">Total de Apostas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {isLoading ? "..." : bankroll?.totalBets || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200">Taxa de Vitória</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {isLoading ? "..." : `${bankroll?.winRate || "0"}%`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Limites */}
        {bankroll && (bankroll.stopLoss || bankroll.stopWin) && (
          <Card className="bg-gradient-to-br from-yellow-900/20 to-transparent border-yellow-700/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <CardTitle className="text-white">Limites Configurados</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {bankroll.stopLoss && (
                  <div>
                    <p className="text-sm text-gray-200">Stop Loss</p>
                    <p className="text-lg font-bold text-yellow-400">{formatCurrency(bankroll.stopLoss)}</p>
                  </div>
                )}
                {bankroll.stopWin && (
                  <div>
                    <p className="text-sm text-gray-200">Stop Win</p>
                    <p className="text-lg font-bold text-yellow-400">{formatCurrency(bankroll.stopWin)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico de Apostas */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-transparent border-purple-700/30">
          <CardHeader>
            <CardTitle className="text-white">Histórico de Apostas Recentes</CardTitle>
            <CardDescription>Últimas 10 apostas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {betHistory && betHistory.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {betHistory.slice(0, 10).map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg">
                    <div>
                      <p className="font-medium">{formatCurrency(bet.betAmount)}</p>
                      <p className="text-sm text-gray-200">{new Date(bet.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bet.result === "win" ? "bg-green-900/30 text-green-400" : 
                      bet.result === "loss" ? "bg-red-900/30 text-red-400" :
                      "bg-yellow-900/30 text-yellow-400"
                    }`}>
                      {bet.result === "win" ? "✓ Ganho" : bet.result === "loss" ? "✗ Perda" : "⏳ Pendente"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-200">Nenhuma aposta realizada ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

