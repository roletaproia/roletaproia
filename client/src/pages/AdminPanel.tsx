import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, TrendingUp, AlertCircle, Crown, UserMinus, CreditCard } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function AdminPanel() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Queries
  const usersQuery = trpc.admin.listUsers.useQuery();
  const statsQuery = trpc.admin.getSystemStats.useQuery();

  // Mutations
  const promoteSubAdminMutation = trpc.admin.promoteToSubAdmin.useMutation();
  const demoteAdminMutation = trpc.admin.demoteFromAdmin.useMutation();

  const users = usersQuery.data || [];
  const stats = statsQuery.data;

  // Verificar se o usuário é admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white p-6 flex items-center justify-center">
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30 max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold">Acesso Negado</h2>
            <p className="text-gray-200">Apenas administradores podem acessar este painel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePromoteSubAdmin = async (userId: number) => {
    try {
      await promoteSubAdminMutation.mutateAsync({ userId });
      usersQuery.refetch();
      alert("Usuário promovido a sub-admin com sucesso!");
    } catch (error) {
      alert("Erro ao promover usuário");
    }
  };

  const handleDemoteAdmin = async (userId: number) => {
    if (window.confirm("Tem certeza que deseja remover as permissões de admin deste usuário?")) {
      try {
        await demoteAdminMutation.mutateAsync({ userId });
        usersQuery.refetch();
        alert("Permissões de admin removidas com sucesso!");
      } catch (error) {
        alert("Erro ao remover permissões de admin");
      }
    }
  };

  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-yellow-400">Painel de Administração</h1>
        </div>
        <p className="text-gray-200">Gerencie usuários, admins e configure o sistema</p>
        
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

      <div className="p-6 space-y-8">
        {/* Statistics */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-4">
            {/* Total Users */}
            <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 text-sm">Total de Usuários</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            {/* Admins */}
            <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 text-sm">Administradores</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.adminCount}</p>
                  </div>
                  <Crown className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            {/* Regular Users */}
            <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 text-sm">Usuários Regulares</p>
                    <p className="text-3xl font-bold text-green-400 mt-1">{stats.userCount}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Management */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <CardTitle className="text-white">Gerenciar Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {usersQuery.isLoading ? (
              <p className="text-gray-200 text-center py-8">Carregando usuários...</p>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-red-700/30">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">ID</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-700/20">
                    {users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-red-900/10 transition-colors">
                        <td className="py-3 px-4 text-gray-300">{u.id}</td>
                        <td className="py-3 px-4 text-white font-medium">{u.name || "-"}</td>
                        <td className="py-3 px-4 text-gray-200">{u.email || "-"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              u.role === "admin"
                                ? "bg-yellow-900/30 text-yellow-300"
                                : u.role === "sub-admin"
                                ? "bg-orange-900/30 text-orange-300"
                                : "bg-gray-900/30 text-gray-300"
                            }`}
                          >
                            {u.role === "admin" ? "👑 Admin" : u.role === "sub-admin" ? "🔐 Sub-Admin" : "👤 Usuário"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {(u.role === "admin" || u.role === "sub-admin") && u.id !== user?.id ? (
                              <Button
                                onClick={() => handleDemoteAdmin(u.id)}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white text-xs"
                              >
                                <UserMinus className="h-3 w-3 mr-1" />
                                Remover
                              </Button>
                            ) : u.role === "user" ? (
                              <Button
                                onClick={() => handlePromoteSubAdmin(u.id)}
                                size="sm"
                                className="bg-yellow-600 hover:bg-yellow-700 text-black text-xs font-semibold"
                              >
                                <Crown className="h-3 w-3 mr-1" />
                                Promover Sub-Admin
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-200 text-center py-8">Nenhum usuário encontrado.</p>
            )}
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-blue-900/20 border-blue-700/30">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-300">
              💡 <strong>Dica:</strong> Promova usuários a <strong>Sub-Admin</strong> para ajudar a moderar o chat. Apenas você (Admin) pode promover/remover sub-admins. Sub-admins tém acesso a moderação mas não podem gerenciar outros admins.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

