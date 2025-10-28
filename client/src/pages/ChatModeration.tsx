import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Shield, Ban, AlertTriangle, Trash2, Plus, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ChatModeration() {
  const { data: bans, refetch: refetchBans } = trpc.moderation.listBans.useQuery();
  const { data: bannedWords, refetch: refetchWords } = trpc.moderation.listBannedWords.useQuery();
  const { data: rules, refetch: refetchRules } = trpc.moderation.listRules.useQuery();
  const { data: deletedMessages } = trpc.moderation.getDeletedMessages.useQuery();

  const banUserMutation = trpc.moderation.banUser.useMutation();
  const unbanUserMutation = trpc.moderation.unbanUser.useMutation();
  const addWordMutation = trpc.moderation.addBannedWord.useMutation();
  const removeWordMutation = trpc.moderation.removeBannedWord.useMutation();
  const createRuleMutation = trpc.moderation.createRule.useMutation();
  const deleteRuleMutation = trpc.moderation.deleteRule.useMutation();

  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [wordDialogOpen, setWordDialogOpen] = useState(false);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);

  const [banForm, setBanForm] = useState({
    userId: "",
    reason: "",
    duration: "",
  });

  const [wordForm, setWordForm] = useState({
    word: "",
    severity: "medium" as "low" | "medium" | "high",
  });

  const [ruleForm, setRuleForm] = useState({
    name: "",
    description: "",
  });

  const handleBanUser = async () => {
    try {
      await banUserMutation.mutateAsync({
        userId: parseInt(banForm.userId),
        reason: banForm.reason,
        duration: banForm.duration ? parseInt(banForm.duration) : undefined,
      });
      alert("Usuário banido com sucesso!");
      setBanDialogOpen(false);
      setBanForm({ userId: "", reason: "", duration: "" });
      refetchBans();
    } catch (error: any) {
      alert(error.message || "Erro ao banir usuário");
    }
  };

  const handleUnban = async (userId: number) => {
    if (!confirm("Tem certeza que deseja remover o ban deste usuário?")) return;
    
    try {
      await unbanUserMutation.mutateAsync({ userId });
      alert("Ban removido com sucesso!");
      refetchBans();
    } catch (error: any) {
      alert(error.message || "Erro ao remover ban");
    }
  };

  const handleAddWord = async () => {
    try {
      await addWordMutation.mutateAsync(wordForm);
      alert("Palavra adicionada à lista de proibidas!");
      setWordDialogOpen(false);
      setWordForm({ word: "", severity: "medium" });
      refetchWords();
    } catch (error: any) {
      alert(error.message || "Erro ao adicionar palavra");
    }
  };

  const handleRemoveWord = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover esta palavra?")) return;
    
    try {
      await removeWordMutation.mutateAsync({ id });
      alert("Palavra removida!");
      refetchWords();
    } catch (error: any) {
      alert(error.message || "Erro ao remover palavra");
    }
  };

  const handleCreateRule = async () => {
    try {
      await createRuleMutation.mutateAsync(ruleForm);
      alert("Regra criada com sucesso!");
      setRuleDialogOpen(false);
      setRuleForm({ name: "", description: "" });
      refetchRules();
    } catch (error: any) {
      alert(error.message || "Erro ao criar regra");
    }
  };

  const handleDeleteRule = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta regra?")) return;
    
    try {
      await deleteRuleMutation.mutateAsync({ id });
      alert("Regra deletada!");
      refetchRules();
    } catch (error: any) {
      alert(error.message || "Erro ao deletar regra");
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-yellow-400 flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Moderação do Chat
          </h1>
          <p className="text-gray-200">Gerencie regras, bans, palavras proibidas e moderação do chat</p>
        </div>

        <div className="grid gap-6">
          {/* Usuários Banidos */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Ban className="h-5 w-5" />
                    Usuários Banidos
                  </CardTitle>
                  <CardDescription>Lista de usuários banidos do chat</CardDescription>
                </div>
                <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Banir Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-red-700/30">
                    <DialogHeader>
                      <DialogTitle className="text-white">Banir Usuário do Chat</DialogTitle>
                      <DialogDescription>
                        Preencha os dados para banir um usuário
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="userId" className="text-white">ID do Usuário</Label>
                        <Input
                          id="userId"
                          type="number"
                          value={banForm.userId}
                          onChange={(e) => setBanForm({ ...banForm, userId: e.target.value })}
                          placeholder="Ex: 123"
                          className="mt-2 bg-slate-800 border-purple-700/30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reason" className="text-white">Motivo do Ban</Label>
                        <Textarea
                          id="reason"
                          value={banForm.reason}
                          onChange={(e) => setBanForm({ ...banForm, reason: e.target.value })}
                          placeholder="Descreva o motivo do banimento..."
                          className="mt-2 bg-slate-800 border-purple-700/30"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration" className="text-white">Duração (horas)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={banForm.duration}
                          onChange={(e) => setBanForm({ ...banForm, duration: e.target.value })}
                          placeholder="Deixe vazio para ban permanente"
                          className="mt-2 bg-slate-800 border-purple-700/30"
                        />
                        <p className="text-xs text-gray-400 mt-1">Deixe vazio para ban permanente</p>
                      </div>
                      <Button
                        onClick={handleBanUser}
                        disabled={banUserMutation.isPending}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        {banUserMutation.isPending ? "Banindo..." : "Confirmar Ban"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {bans && bans.length > 0 ? (
                <div className="space-y-3">
                  {bans.map((ban) => (
                    <div
                      key={ban.id}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-red-700/30"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">Usuário ID: {ban.userId}</p>
                        <p className="text-sm text-gray-400">Motivo: {ban.reason}</p>
                        <p className="text-xs text-gray-500">
                          {ban.expiresAt
                            ? `Expira em: ${new Date(ban.expiresAt).toLocaleString('pt-BR')}`
                            : "Ban permanente"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnban(ban.userId)}
                        className="border-green-700/30 hover:bg-green-900/20"
                      >
                        Remover Ban
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Nenhum usuário banido</p>
              )}
            </CardContent>
          </Card>

          {/* Palavras Proibidas */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Palavras Proibidas
                  </CardTitle>
                  <CardDescription>Palavras que não podem ser enviadas no chat</CardDescription>
                </div>
                <Dialog open={wordDialogOpen} onOpenChange={setWordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Palavra
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-red-700/30">
                    <DialogHeader>
                      <DialogTitle className="text-white">Adicionar Palavra Proibida</DialogTitle>
                      <DialogDescription>
                        Adicione uma palavra à lista de proibidas
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="word" className="text-white">Palavra</Label>
                        <Input
                          id="word"
                          value={wordForm.word}
                          onChange={(e) => setWordForm({ ...wordForm, word: e.target.value })}
                          placeholder="Digite a palavra..."
                          className="mt-2 bg-slate-800 border-purple-700/30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="severity" className="text-white">Severidade</Label>
                        <Select
                          value={wordForm.severity}
                          onValueChange={(value: any) => setWordForm({ ...wordForm, severity: value })}
                        >
                          <SelectTrigger className="mt-2 bg-slate-800 border-purple-700/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-purple-700/30">
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleAddWord}
                        disabled={addWordMutation.isPending}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        {addWordMutation.isPending ? "Adicionando..." : "Adicionar"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {bannedWords && bannedWords.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {bannedWords.map((word) => (
                    <div
                      key={word.id}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-red-700/30"
                    >
                      <div>
                        <p className="text-white font-medium">{word.word}</p>
                        <p className="text-xs text-gray-400">
                          Severidade: {word.severity === "high" ? "Alta" : word.severity === "medium" ? "Média" : "Baixa"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveWord(word.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Nenhuma palavra proibida cadastrada</p>
              )}
            </CardContent>
          </Card>

          {/* Regras do Chat */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Regras do Chat</CardTitle>
                  <CardDescription>Regras que os usuários devem seguir</CardDescription>
                </div>
                <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Regra
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-red-700/30">
                    <DialogHeader>
                      <DialogTitle className="text-white">Criar Nova Regra</DialogTitle>
                      <DialogDescription>
                        Adicione uma nova regra ao chat
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ruleName" className="text-white">Nome da Regra</Label>
                        <Input
                          id="ruleName"
                          value={ruleForm.name}
                          onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                          placeholder="Ex: Respeito Mútuo"
                          className="mt-2 bg-slate-800 border-purple-700/30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ruleDesc" className="text-white">Descrição</Label>
                        <Textarea
                          id="ruleDesc"
                          value={ruleForm.description}
                          onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                          placeholder="Descreva a regra..."
                          className="mt-2 bg-slate-800 border-purple-700/30"
                          rows={3}
                        />
                      </div>
                      <Button
                        onClick={handleCreateRule}
                        disabled={createRuleMutation.isPending}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        {createRuleMutation.isPending ? "Criando..." : "Criar Regra"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {rules && rules.length > 0 ? (
                <div className="space-y-3">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-start justify-between p-3 bg-slate-800/50 rounded-lg border border-red-700/30"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{rule.name}</p>
                        <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Nenhuma regra cadastrada</p>
              )}
            </CardContent>
          </Card>

          {/* Log de Mensagens Deletadas */}
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Log de Mensagens Deletadas
              </CardTitle>
              <CardDescription>Histórico de mensagens removidas pela moderação</CardDescription>
            </CardHeader>
            <CardContent>
              {deletedMessages && deletedMessages.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {deletedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 bg-slate-800/50 rounded-lg border border-red-700/30"
                    >
                      <p className="text-white text-sm">{msg.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Usuário ID: {msg.userId} | Deletado por: Admin ID {msg.deletedBy}
                      </p>
                      <p className="text-xs text-gray-500">Motivo: {msg.reason}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(msg.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Nenhuma mensagem deletada</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

