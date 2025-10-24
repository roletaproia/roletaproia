import type { IncomingMessage } from "http";
import { sdk } from "./sdk";
import type { User } from "../../drizzle/schema";

export async function authenticateWebSocket(req: IncomingMessage): Promise<User | null> {
  try {
    // Try to authenticate the request using the existing SDK method
    const user = await sdk.authenticateRequest(req as any);
    return user;
  } catch (error) {
    console.error("WebSocket authentication error:", error);
    return null;
  }
}

