import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "../lib/trpc";
import { useToast } from "@/hooks/use-toast";

export default function MakeAdmin() {
  const [email, setEmail] = useState("felipefaria2019cps@gmail.com");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const makeAdminMutation = trpc.admin.makeAdmin.useMutation({
    onSuccess: (data) => {
      toast({
        title: "✅ Sucesso!",
        description: data.message,
      });
      setLoading(false);
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
    makeAdminMutation.mutate({ email, secret });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-red-600">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-yellow-400">
            🔐 Tornar Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="secret" className="text-white">
                Senha Secreta
              </Label>
              <Input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
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
              {loading ? "Processando..." : "🚀 Tornar Admin"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">
              <strong className="text-yellow-400">⚠️ Atenção:</strong>
              <br />
              Este é um endpoint temporário para tornar sua conta Admin.
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

