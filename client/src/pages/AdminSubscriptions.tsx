import { useState } from "react";
import Layout from "@/components/Layout";

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Users, Calendar, AlertCircle, Info } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function AdminSubscriptions() {
  const user = { role: "admin", id: 1 }; // Mock user as admin for public access

  // Queries
  const usersQuery = trpc.admin.listUsers.useQuery();
  const users = usersQuery.data || [];

  // Verificar se o usuário é admin
  if (false) { // Painel de Admin desativado


  const [location] = useLocation();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-yellow-400">Gerenciar Usuários</h1>
          </div>
          <p className="text-gray-200">Sistema 100% Gratuito - Todos os usuários têm acesso completo</p>
          
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
                <Info className="inline h-4 w-4 mr-2" />
                Informações
              </a>
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-green-900/20 to-transparent border-green-700/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6 text-green-400" />
                <CardTitle className="text-white">Sistema 100% Gratuito</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-200">
                O RoboRoleta é um sistema completamente gratuito! Todos os usuários cadastrados têm acesso ilimitado a todas as funcionalidades sem qualquer custo.
              </p>
              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-2">✅ Recursos Inclusos:</h3>
                <ul className="text-gray-200 space-y-1 text-sm">
                  <li>• Análise de Roleta com Inteligência Artificial</li>
                  <li>• Sinais Inteligentes em Tempo Real</li>
                  <li>• Estatísticas Avançadas</li>
                  <li>• Gerenciamento de Banca</li>
                  <li>• Sistema de Indicação</li>
                  <li>• Acesso ao Blog com Estratégias</li>
                  <li>• Suporte via Chat</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="max-w-6xl mx-auto mt-8">
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-red-400" />
                <CardTitle className="text-white">Todos os Usuários ({users.length})</CardTitle>
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
                      <th className="text-left py-3 px-4 text-gray-300">Status</th>
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
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                            Acesso Completo
                          </span>
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
