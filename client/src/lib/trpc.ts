import { createTRPCReact } from "@trpc/react-query";
import { getBaseUrl } from "./utils";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();
