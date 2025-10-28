import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Trash2, Shield, AlertCircle, Info, Eraser } from "lucide-react";
import Layout from "@/components/Layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [messageState, setMessageState] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMutation = trpc.chat.send.useMutation();
  const messagesQuery = trpc.chat.getMessages.useQuery({ limit: 100 });
  const deleteMessageMutation = trpc.chat.deleteMessage.useMutation();
  const clearAllMessagesMutation = trpc.moderation.clearAllMessages.useMutation();
  const { data: banStatus } = trpc.moderation.checkBan.useQuery();
  const { data: rules } = trpc.moderation.listRules.useQuery();

  const messages = messagesQuery.data || [];
  const isLoading = messagesQuery.isLoading;
  const isBanned = banStatus?.isBanned || false;

  // Função para scroll automático para o final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll ao carregar mensagens pela primeira vez
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  // Auto-refresh mensagens a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      messagesQuery.refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageState.trim()) return;
    
    setError("");

    try {
      await sendMutation.mutateAsync({ message: messageState });
      setMessageState("");
      await messagesQuery.refetch();
      // Scroll para a nova mensagem
      setTimeout(scrollToBottom, 100);
    } catch (error: any) {
      setError(error.message || "Erro ao enviar mensagem");
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm("Tem certeza que deseja deletar esta mensagem?")) {
      try {
        await deleteMessageMutation.mutateAsync({ messageId });
        messagesQuery.refetch();
      } catch (error: any) {
        alert(error.message || "Erro ao deletar mensagem");
        console.error("Erro ao deletar mensagem:", error);
      }
    }
  };

  const handleClearAllMessages = async () => {
    if (window.confirm("⚠️ ATENÇÃO! Tem certeza que deseja LIMPAR TODAS AS MENSAGENS do chat? Esta ação não pode ser desfeita!")) {
      try {
        const result = await clearAllMessagesMutation.mutateAsync();
        alert(result.message);
        messagesQuery.refetch();
      } catch (error: any) {
        alert(error.message || "Erro ao limpar chat");
        console.error("Erro ao limpar chat:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-yellow-400">Chat da Comunidade</h1>
          <p className="text-gray-200">Converse com outros usuários, compartilhe estratégias e aprenda juntos</p>
        </div>

        {/* Aviso de Ban */}
        {isBanned && (
          <Alert className="mb-4 bg-red-900/20 border-red-700/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-red-400">Você está banido do chat</AlertTitle>
            <AlertDescription className="text-gray-300">
              <p><strong>Motivo:</strong> {banStatus?.reason}</p>
              {banStatus?.expiresAt ? (
                <p><strong>Expira em:</strong> {new Date(banStatus.expiresAt).toLocaleString('pt-BR')}</p>
              ) : (
                <p><strong>Duração:</strong> Permanente</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Regras do Chat */}
        {rules && rules.length > 0 && (
          <Card className="mb-4 bg-gradient-to-br from-blue-900/20 to-transparent border-blue-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Info className="h-5 w-5" />
                Regras do Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rules.map((rule, index) => (
                  <div key={rule.id} className="flex gap-2">
                    <span className="text-yellow-400 font-bold">{index + 1}.</span>
                    <div>
                      <p className="text-white font-medium">{rule.name}</p>
                      <p className="text-sm text-gray-400">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Card */}
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30 h-[600px] flex flex-col">
          {/* Header com botão Limpar Chat (Admin only) */}
          {user?.role === "admin" && (
            <div className="border-b border-red-700/30 p-3 flex justify-between items-center">
              <h3 className="text-yellow-400 font-semibold">Mensagens</h3>
              <Button
                onClick={handleClearAllMessages}
                disabled={clearAllMessagesMutation.isPending || messages.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 h-auto"
                title="Limpar todas as mensagens do chat"
              >
                <Eraser className="h-4 w-4 mr-1" />
                Limpar Chat
              </Button>
            </div>
          )}
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <p className="text-gray-200 text-center py-8">Carregando mensagens...</p>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`rounded-lg p-3 border transition-all group ${
                      msg.isSystemMessage
                        ? "bg-blue-900/30 border-blue-700/50"
                        : "bg-slate-800/50 border-red-700/20 hover:border-red-700/50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* User Info */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              msg.isSystemMessage
                                ? "bg-blue-600"
                                : "bg-gradient-to-br from-yellow-400 to-red-600"
                            }`}>
                              {msg.isSystemMessage ? "🤖" : (msg.userName || `U${msg.userId}`)[0].toUpperCase()}
                            </div>
                            <p className={`text-sm font-semibold ${
                              msg.isSystemMessage ? "text-blue-300" : "text-yellow-400"
                            }`}>
                              {msg.isSystemMessage ? "Sistema" : (msg.userName || `Usuário ${msg.userId}`)}
                            </p>
                          </div>
                          {msg.userRole === "admin" && !msg.isSystemMessage && (
                            <span className="flex items-center gap-1 text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full">
                              <Shield className="h-3 w-3" />
                              Admin
                            </span>
                          )}
                          {msg.userRole === "sub-admin" && !msg.isSystemMessage && (
                            <span className="flex items-center gap-1 text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">
                              <Shield className="h-3 w-3" />
                              Moderador
                            </span>
                          )}
                        </div>

                        {/* Message Content */}
                        <p className="text-white break-words">{msg.message}</p>

                        {/* Timestamp */}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(msg.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>

                      {/* Delete Button */}
                      {!msg.isSystemMessage && (msg.isOwnMessage || user?.role === "admin" || user?.role === "sub-admin") && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded"
                          title={msg.isOwnMessage ? "Deletar sua mensagem" : "Deletar mensagem (Admin)"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {/* Elemento invisível para scroll automático */}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <p className="text-gray-200 text-center py-8">Nenhuma mensagem ainda. Seja o primeiro a falar!</p>
            )}
          </CardContent>

          {/* Input Area */}
          <div className="border-t border-red-700/30 p-4">
            {error && (
              <Alert className="mb-3 bg-red-900/20 border-red-700/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={messageState}
                onChange={(e) => setMessageState(e.target.value)}
                placeholder={isBanned ? "Você está banido do chat" : "Digite sua mensagem..."}
                className="bg-slate-800 border-red-700/30 text-white placeholder-gray-500"
                disabled={sendMutation.isPending || isBanned}
              />
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                disabled={sendMutation.isPending || !messageState.trim() || isBanned}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
            {!isAuthenticated && (
              <p className="text-xs text-yellow-400 mt-2">Você precisa estar autenticado para enviar mensagens.</p>
            )}
            
            {isAuthenticated && !isBanned && (
              <p className="text-xs text-gray-400 mt-2">
                ⚠️ Não envie links ou conteúdo ofensivo. Respeite as regras do chat.
              </p>
            )}
          </div>
        </Card>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 <strong>Dica:</strong> Você pode deletar suas próprias mensagens. Admins e moderadores podem deletar qualquer mensagem para manter o chat seguro e respeitoso.
          </p>
          <p className="text-sm text-blue-300 mt-2">
            🚫 <strong>Proibido:</strong> Links, spam, conteúdo ofensivo ou desrespeitoso. Violações podem resultar em ban.
          </p>
        </div>
      </div>
    </Layout>
  );
}

