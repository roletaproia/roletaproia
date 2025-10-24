import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { authRouter } from "./routers/auth";
import { strategiesRouter } from "./routers/strategies";
import { bankrollRouter } from "./routers/bankroll";
import { betsRouter } from "./routers/bets";
import { chatRouter } from "./routers/chat";
import { adminRouter } from "./routers/admin";
import { profileRouter } from "./routers/profile";
import { bookmakerRouter } from "./routers/bookmaker";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  strategies: strategiesRouter,
  bankroll: bankrollRouter,
  bets: betsRouter,
  chat: chatRouter,
  admin: adminRouter,
  profile: profileRouter,
  bookmaker: bookmakerRouter,
});

export type AppRouter = typeof appRouter;

