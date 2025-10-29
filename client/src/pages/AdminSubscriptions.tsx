import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Users, Calendar, Crown, AlertCircle, Plus, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";

export default function AdminSubscriptions() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [daysToAdd, setDaysToAdd] = useState<number>(7);
  const [planToConvert, setPlanToConvert] = useState<"monthly" | "quarterly" | "annual">("monthly");

  // Queries
  const usersQuery = trpc.admin.listUsers.useQuery();
  const users = usersQuery.data || [];

  // Mutations
  const addDaysMutation = trpc.subscription.addExtraDays.useMutation();
  const convertToPremiumMutation = trpc.subscription.convertToPremium.useMutation();

  // Verificar se o usuário é admin
  if (user?.role !== "admin") {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white p-6 flex items-center justify-center">
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30 max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
              <h2 className="text-xl font-bold">Acesso Negado</h2>
              <p className="text-gray-200">Apenas administradores podem acessar este painel.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleAddDays = async () => {
    if (!selectedUserId || daysToAdd <= 0) {
      alert("Selecione um usuário e informe a quantidade de dias");
      return;
    }

    try {
      await addDaysMutation.mutateAsync({
        userId: selectedUserId,
        days: daysToAdd,
      });
      alert(`${daysToAdd} dias adicionados com sucesso!`);
      usersQuery.refetch();
      setSelectedUserId(null);
      setDaysToAdd(7);
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleConvertToPremium = async () => {
    if (!selectedUserId) {
      alert("Selecione um usuário");
      return;
    }

    if (!confirm(`Tem certeza que deseja converter este usuário para o plano ${planToConvert}?`)) {
      return;
    }

    try {
      await convertToPremiumMutation.mutateAsync({
        userId: selectedUserId,
        plan: planToConvert,
      });
      alert("Usuário convertido para premium com sucesso!");
      usersQuery.refetch();
      setSelectedUserId(null);
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const [location] = useLocation();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-yellow-400">Gerenciar Assinaturas</h1>
          </div>
          <p className="text-gray-200">Adicione dias extras ou converta usuários para premium</p>
          
          {/* Menu de Navegação */}
          <div className="flex gap-2 mt-4">
            <Link href="/admin">
              <a className={`px-4 py-2 rounded-lg transition-all ${
                location === "/admin" 
                  ? "bg-red-600 text-white" 
                  : "bg-red-900/20 text-gray-300 hover:bg-red-900/40"
              }`}>
                <Users className="inline h-4 w-4 mr-2" />
                Usuários
              </a>
            </Link>
            <Link href="/admin/subscriptions">
              <a className={`px-4 py-2 rounded-lg transition-all ${
                location === "/admin/subscriptions" 
                  ? "bg-red-600 text-white" 
                  : "bg-red-900/20 text-gray-300 hover:bg-red-900/40"
              }`}>
                <CreditCard className="inline h-4 w-4 mr-2" />
                Assinaturas
              </a>
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Add Extra Days */}
          <Card className="bg-gradient-to-br from-green-900/20 to-transparent border-green-700/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-green-400" />
                <CardTitle className="text-white">Adicionar Dias Extras</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Selecionar Usuário</label>
                <Select
                  value={selectedUserId?.toString() || ""}
                  onValueChange={(value) => setSelectedUserId(parseInt(value))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-green-700/30 text-white">
                    <SelectValue placeholder="Escolha um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Quantidade de Dias</label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={daysToAdd}
                  onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)}
                  className="bg-slate-900/50 border-green-700/30 text-white"
                />
              </div>

              <Button
                onClick={handleAddDays}
                disabled={!selectedUserId || daysToAdd <= 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar {daysToAdd} Dias
              </Button>
            </CardContent>
          </Card>

          {/* Convert to Premium */}
          <Card className="bg-gradient-to-br from-yellow-900/20 to-transparent border-yellow-700/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-yellow-400" />
                <CardTitle className="text-white">Converter para Premium</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Selecionar Usuário</label>
                <Select
                  value={selectedUserId?.toString() || ""}
                  onValueChange={(value) => setSelectedUserId(parseInt(value))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-yellow-700/30 text-white">
                    <SelectValue placeholder="Escolha um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Plano Premium</label>
                <Select
                  value={planToConvert}
                  onValueChange={(value: any) => setPlanToConvert(value)}
                >
                  <SelectTrigger className="bg-slate-900/50 border-yellow-700/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensal (R$ 79,90)</SelectItem>
                    <SelectItem value="quarterly">Trimestral (R$ 149,90)</SelectItem>
                    <SelectItem value="annual">Anual (R$ 359,00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleConvertToPremium}
                disabled={!selectedUserId}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
              >
                <Crown className="h-4 w-4 mr-2" />
                Converter para Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="max-w-6xl mx-auto mt-8">
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-red-400" />
                <CardTitle className="text-white">Todos os Usuários</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-red-700/30">
                      <th className="text-left py-3 px-4 text-gray-300">ID</th>
                      <th className="text-left py-3 px-4 text-gray-300">Nome</th>
                      <th className="text-left py-3 px-4 text-gray-300">Email</th>
                      <th className="text-left py-3 px-4 text-gray-300">Role</th>
                      <th className="text-left py-3 px-4 text-gray-300">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-red-700/10 hover:bg-red-900/10">
                        <td className="py-3 px-4 text-white">{u.id}</td>
                        <td className="py-3 px-4 text-white">{u.name}</td>
                        <td className="py-3 px-4 text-gray-300">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              u.role === "admin"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : u.role === "sub-admin"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

