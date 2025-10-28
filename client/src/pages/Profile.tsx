import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, Upload, Save, Trash2 } from "lucide-react";

export default function Profile() {
  const { user, refetchUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [isSaving, setIsSaving] = useState(false);

  const updateProfileMutation = trpc.profile.updateProfile.useMutation();
  const deleteAvatarMutation = trpc.profile.deleteAvatar.useMutation();

  // Atualizar form quando user mudar
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Imagem muito grande! Máximo 2MB.");
        return;
      }

      // Validar tipo
      if (!file.type.startsWith("image/")) {
        alert("Apenas imagens são permitidas!");
        return;
      }

      // Converter para base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Tem certeza que deseja remover sua foto de perfil?")) {
      return;
    }

    try {
      await deleteAvatarMutation.mutateAsync();
      setAvatarPreview(null);
      await refetchUser();
      alert("Foto removida com sucesso!");
    } catch (error: any) {
      console.error("Erro ao remover foto:", error);
      alert(error.message || "Erro ao remover foto");
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {};

      // Adicionar campos que mudaram
      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }
      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      if (avatarPreview && avatarPreview !== user?.avatarUrl) {
        updateData.avatarUrl = avatarPreview;
      }

      if (Object.keys(updateData).length === 0) {
        alert("Nenhuma alteração para salvar!");
        return;
      }

      await updateProfileMutation.mutateAsync(updateData);
      await refetchUser();
      alert("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      alert(error.message || "Erro ao salvar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-yellow-400">Meu Perfil</h1>
        <p className="text-gray-200">Gerencie suas informações pessoais e configurações de conta</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Avatar Section */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <CardTitle className="text-white">Foto de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-red-600 flex items-center justify-center text-3xl font-bold">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition-colors w-fit">
                  <Upload className="h-4 w-4" />
                  <span>Fazer Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                
                {avatarPreview && (
                  <Button
                    onClick={handleDeleteAvatar}
                    variant="outline"
                    size="sm"
                    className="border-red-700/50 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover Foto
                  </Button>
                )}
                
                <p className="text-xs text-gray-400">
                  Formatos aceitos: JPG, PNG, GIF (máx. 2MB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <CardTitle className="text-white">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Nome</label>
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
              <label className="text-sm font-medium text-white mb-2 block">Email</label>
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
              <label className="text-sm font-medium text-white mb-2 block">Tipo de Conta</label>
              <div className="px-4 py-2 bg-slate-800 border border-red-700/30 rounded-lg text-white">
                {user?.role === "admin" ? "👑 Administrador" : user?.role === "sub-admin" ? "🔐 Sub-Administrador" : "👤 Usuário Regular"}
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving || updateProfileMutation.isPending}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-6"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving || updateProfileMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
          <CardHeader>
            <CardTitle className="text-white">Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-200">ID da Conta:</span>
              <span className="text-white font-mono">{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-200">Membro desde:</span>
              <span className="text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-200">Último acesso:</span>
              <span className="text-white">
                {user?.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString("pt-BR") : "-"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </Layout>
  );
}

