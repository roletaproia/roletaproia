import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Image as ImageIcon, Save, Trash2, ExternalLink } from "lucide-react";

export default function Profile() {
  const { user, refetchUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const updateProfileMutation = trpc.profile.updateProfile.useMutation();
  const deleteAvatarMutation = trpc.profile.deleteAvatar.useMutation();

  // Atualizar form quando user mudar
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Reset error quando mudar URL
    if (name === "avatarUrl") {
      setImageError(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Tem certeza que deseja remover sua foto de perfil?")) {
      return;
    }

    try {
      await deleteAvatarMutation.mutateAsync();
      setFormData((prev) => ({ ...prev, avatarUrl: "" }));
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
      if (formData.avatarUrl !== user?.avatarUrl) {
        updateData.avatarUrl = formData.avatarUrl;
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
        {/* Avatar Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Foto de Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview da foto */}
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-yellow-500 flex items-center justify-center overflow-hidden">
                {formData.avatarUrl && !imageError ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-500" />
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="avatarUrl" className="text-white">
                  URL da Imagem
                </Label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  value={formData.avatarUrl}
                  onChange={handleInputChange}
                  placeholder="https://imgur.com/sua-foto.jpg"
                  className="bg-gray-700 text-white border-gray-600"
                />
                <p className="text-sm text-gray-400">
                  Cole o link direto da sua foto hospedada em Imgur, ImgBB, etc.
                </p>
                
                {imageError && formData.avatarUrl && (
                  <p className="text-sm text-red-400">
                    ⚠️ Não foi possível carregar a imagem. Verifique a URL.
                  </p>
                )}
              </div>
            </div>

            {/* Serviços recomendados */}
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-2 font-semibold">
                📸 Onde hospedar sua foto:
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://imgur.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full flex items-center gap-1"
                >
                  Imgur <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://imgbb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full flex items-center gap-1"
                >
                  ImgBB <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://postimages.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full flex items-center gap-1"
                >
                  PostImages <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {formData.avatarUrl && (
              <Button
                onClick={handleDeleteAvatar}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover Foto
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações da Conta */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">ID da Conta:</span>
              <span className="text-white font-mono">{user?.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Membro desde:</span>
              <span className="text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Último acesso:</span>
              <span className="text-white">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString("pt-BR") : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 text-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
    </Layout>
  );
}

