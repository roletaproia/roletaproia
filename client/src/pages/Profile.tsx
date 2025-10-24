import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, Upload, Save } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Aqui você implementaria a lógica para salvar o perfil
      // await updateProfileMutation.mutateAsync({ ...formData, avatar: avatarFile });
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-gray-400">Gerencie suas informações pessoais e configurações de conta</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Avatar Section */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-red-600 flex items-center justify-center text-3xl font-bold">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Fazer Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                {avatarFile && (
                  <p className="text-sm text-gray-400 mt-2">
                    Arquivo selecionado: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  className="bg-slate-800 border-red-700/30 text-white placeholder-gray-500 pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu.email@exemplo.com"
                  className="bg-slate-800 border-red-700/30 text-white placeholder-gray-500 pl-10"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Tipo de Conta</label>
              <div className="px-4 py-2 bg-slate-800 border border-red-700/30 rounded-lg text-white">
                {user?.role === "admin" ? "👑 Administrador" : user?.role === "sub-admin" ? "🔐 Sub-Administrador" : "👤 Usuário Regular"}
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-6"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">ID da Conta:</span>
              <span className="text-white font-mono">{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Membro desde:</span>
              <span className="text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Último acesso:</span>
              <span className="text-white">
                {user?.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString("pt-BR") : "-"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

