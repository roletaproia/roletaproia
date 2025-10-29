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
import { moderationRouter } from "./routers/moderation";
import { robotRouter } from "./routers/robot";
import { subscriptionRouter } from "./routers/subscription";
import { referralRouter } from "./routers/referral";

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
  moderation: moderationRouter,
  robot: robotRouter,
  subscription: subscriptionRouter,
  referral: referralRouter,
});

export type AppRouter = typeof appRouter;

