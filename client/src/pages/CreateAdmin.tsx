import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "../lib/trpc";
import { useToast } from "@/hooks/use-toast";

export default function CreateAdmin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    secret: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createAdminMutation = trpc.admin.createAdminUser.useMutation({
    onSuccess: (data) => {
      toast({
        title: "✅ Sucesso!",
        description: data.message,
      });
      setLoading(false);
      
      // Limpar formulário
      setFormData({
        email: "",
        password: "",
        name: "",
        secret: "",
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Erro",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    createAdminMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-red-600">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-yellow-400">
            🔐 Criar Conta Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Seu nome completo"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mínimo 6 caracteres"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="secret" className="text-white">
                Senha Secreta
              </Label>
              <Input
                id="secret"
                name="secret"
                type="password"
                value={formData.secret}
                onChange={handleChange}
                required
                placeholder="Digite a senha secreta"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              {loading ? "Criando..." : "🚀 Criar Conta Admin"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">
              <strong className="text-yellow-400">⚠️ Atenção:</strong>
              <br />
              Este endpoint cria uma conta com permissões de Administrador.
              <br />
              <br />
              <strong className="text-white">Senha secreta:</strong> roletaproia2025admin
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

