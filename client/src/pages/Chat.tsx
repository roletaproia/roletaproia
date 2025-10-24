import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Trash2, Shield } from "lucide-react";

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [messageState, setMessageState] = useState("");

  const sendMutation = trpc.chat.send.useMutation();
  const messagesQuery = trpc.chat.getMessages.useQuery({ limit: 100 });
  const deleteMessageMutation = trpc.chat.deleteMessage.useMutation();

  const messages = messagesQuery.data || [];
  const isLoading = messagesQuery.isLoading;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageState.trim()) return;

    try {
      await sendMutation.mutateAsync({ message: messageState });
      setMessageState("");
      messagesQuery.refetch();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm("Tem certeza que deseja deletar esta mensagem?")) {
      try {
        await deleteMessageMutation.mutateAsync({ messageId });
        messagesQuery.refetch();
      } catch (error) {
        console.error("Erro ao deletar mensagem:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 p-6">
        <h1 className="text-3xl font-bold mb-2">Chat da Comunidade</h1>
        <p className="text-gray-400">Converse com outros usuários, compartilhe estratégias e aprenda juntos</p>
      </div>

      <div className="p-6">
        <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30 h-[600px] flex flex-col">
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <p className="text-gray-400 text-center py-8">Carregando mensagens...</p>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className="bg-slate-800/50 rounded-lg p-3 border border-red-700/20 hover:border-red-700/50 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* User Info */}
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-red-600 flex items-center justify-center text-xs font-bold">
                              {(msg.userName || `U${msg.userId}`)[0].toUpperCase()}
                            </div>
                            <p className="text-sm font-semibold text-yellow-400">
                              {msg.userName || `Usuário ${msg.userId}`}
                            </p>
                          </div>
                          {user?.role === "admin" && msg.userId !== user.id && (
                            <span className="flex items-center gap-1 text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">
                              <Shield className="h-3 w-3" />
                              Admin
                            </span>
                          )}
                          {msg.isSystemMessage && (
                            <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">
                              Sistema
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
                      {(msg.isOwnMessage || user?.role === "admin") && (
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
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Nenhuma mensagem ainda. Seja o primeiro a falar!</p>
            )}
          </CardContent>

          {/* Input Area */}
          <div className="border-t border-red-700/30 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={messageState}
                onChange={(e) => setMessageState(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="bg-slate-800 border-red-700/30 text-white placeholder-gray-500"
                disabled={sendMutation.isPending}
              />
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                disabled={sendMutation.isPending || !messageState.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {!isAuthenticated && (
              <p className="text-xs text-yellow-400 mt-2">Você precisa estar autenticado para enviar mensagens.</p>
            )}
          </div>
        </Card>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 <strong>Dica:</strong> Você pode deletar suas próprias mensagens. Admins podem deletar qualquer mensagem para manter o chat seguro e respeitoso.
          </p>
        </div>
      </div>
    </div>
  );
}

