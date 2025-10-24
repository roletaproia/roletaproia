import { WebSocketServer, WebSocket } from "ws";
import type { Server as HTTPServer } from "http";
import type { User } from "../../drizzle/schema";

export interface WebSocketMessage {
  type: "message" | "user-joined" | "user-left" | "system";
  data: {
    id?: number;
    userId: string;
    userName: string;
    userAvatar?: string;
    message: string;
    timestamp: string;
    isSystemMessage?: boolean;
  };
}

interface ClientConnection {
  ws: WebSocket;
  user: User;
  isAlive: boolean;
}

export class ChatWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();

  constructor(httpServer: HTTPServer) {
    this.wss = new WebSocketServer({ 
      server: httpServer,
      path: "/ws/chat",
      perMessageDeflate: false, // Disable compression for better performance
    });

    this.setupHeartbeat();
    this.setupConnectionHandler();
  }

  private setupHeartbeat() {
    const interval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (!client.isAlive) {
          client.ws.terminate();
          this.clients.delete(clientId);
          return;
        }

        client.isAlive = false;
        client.ws.ping();
      });
    }, 30000); // 30 seconds

    this.wss.on("close", () => {
      clearInterval(interval);
    });
  }

  private setupConnectionHandler() {
    this.wss.on("connection", (ws: WebSocket) => {
      // Extract user from query params or headers
      // This should be handled by authentication middleware
      
      ws.on("pong", () => {
        const clientId = Array.from(this.clients.entries()).find(
          ([_, client]) => client.ws === ws
        )?.[0];
        if (clientId) {
          const client = this.clients.get(clientId);
          if (client) {
            client.isAlive = true;
          }
        }
      });

      ws.on("message", (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as WebSocketMessage;
          this.handleMessage(ws, message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          ws.send(JSON.stringify({ 
            type: "error", 
            error: "Invalid message format" 
          }));
        }
      });

      ws.on("close", () => {
        const clientId = Array.from(this.clients.entries()).find(
          ([_, client]) => client.ws === ws
        )?.[0];
        if (clientId) {
          const client = this.clients.get(clientId);
          if (client) {
            this.broadcastMessage({
              type: "user-left",
              data: {
                userId: client.user.id,
                userName: client.user.name,
                message: `${client.user.name} saiu do chat`,
                timestamp: new Date().toISOString(),
              },
            });
          }
          this.clients.delete(clientId);
        }
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });
  }

  private handleMessage(ws: WebSocket, message: WebSocketMessage) {
    // Find the client connection
    const clientId = Array.from(this.clients.entries()).find(
      ([_, client]) => client.ws === ws
    )?.[0];

    if (!clientId) {
      ws.send(JSON.stringify({ 
        type: "error", 
        error: "Not authenticated" 
      }));
      return;
    }

    const client = this.clients.get(clientId);
    if (!client) return;

    // Handle different message types
    switch (message.type) {
      case "message":
        this.broadcastMessage({
          type: "message",
          data: {
            userId: client.user.id,
            userName: client.user.name,
            userAvatar: client.user.avatarUrl,
            message: message.data.message,
            timestamp: new Date().toISOString(),
          },
        });
        break;

      case "system":
        // Only admins can send system messages
        if (client.user.role === "admin") {
          this.broadcastMessage({
            type: "system",
            data: {
              userId: client.user.id,
              userName: "Sistema",
              message: message.data.message,
              timestamp: new Date().toISOString(),
              isSystemMessage: true,
            },
          });
        }
        break;
    }
  }

  public registerClient(clientId: string, user: User, ws: WebSocket) {
    this.clients.set(clientId, { ws, user, isAlive: true });
    
    // Notify others that a new user joined
    this.broadcastMessage({
      type: "user-joined",
      data: {
        userId: user.id,
        userName: user.name,
        message: `${user.name} entrou no chat`,
        timestamp: new Date().toISOString(),
      },
    });
  }

  public broadcastMessage(message: WebSocketMessage) {
    const payload = JSON.stringify(message);
    
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
      }
    });
  }

  public getConnectedUsers() {
    return Array.from(this.clients.values()).map((client) => ({
      id: client.user.id,
      name: client.user.name,
      avatarUrl: client.user.avatarUrl,
    }));
  }

  public getClientCount() {
    return this.clients.size;
  }
}

