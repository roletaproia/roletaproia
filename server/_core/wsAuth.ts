import type { IncomingMessage } from "http";
import { sdk } from "./sdk";
import type { User } from "../../drizzle/schema";

export async function authenticateWebSocket(req: IncomingMessage): Promise<null> {
  // Autenticação removida, pois o sistema não possui login de usuário.
  return null;
}

