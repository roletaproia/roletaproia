import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-yellow-400">
            <SettingsIcon className="h-8 w-8 text-yellow-400" />
            Configurações
          </h1>
          <p className="text-gray-200">Gerencie suas preferências e configurações da conta</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Perfil */}
          <Card className="bg-slate-900/50 border-red-900/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-red-400" />
                Informações do Perfil
              </CardTitle>
              <CardDescription className="text-gray-200">
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-200">Nome</Label>
                <Input
                  id="name"
                  defaultValue={user?.name}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email}
                  className="bg-slate-800 border-slate-700 text-white"
                  disabled
                />
                <p className="text-xs text-gray-200 mt-1">O email não pode ser alterado</p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card className="bg-slate-900/50 border-red-900/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-400" />
                Notificações
              </CardTitle>
              <CardDescription className="text-gray-200">
                Configure como você quer receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">Em desenvolvimento...</p>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="bg-slate-900/50 border-red-900/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-400" />
                Segurança
              </CardTitle>
              <CardDescription className="text-gray-200">
                Altere sua senha e gerencie a segurança da conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password" className="text-gray-200">Senha Atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="new-password" className="text-gray-200">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password" className="text-gray-200">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          {/* Aparência */}
          <Card className="bg-slate-900/50 border-red-900/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-red-400" />
                Aparência
              </CardTitle>
              <CardDescription className="text-gray-200">
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

