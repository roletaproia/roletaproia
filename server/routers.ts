import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";

import { strategiesRouter } from "./routers/strategies";
import { bankrollRouter } from "./routers/bankroll";
import { betsRouter } from "./routers/bets";

import { adminRouter } from "./routers/admin";

import { bookmakerRouter } from "./routers/bookmaker";

import { robotRouter } from "./routers/robot";
import { subscriptionRouter } from "./routers/subscription";

import { signalsRouter } from "./routers/signals";


export const appRouter = router({
  system: systemRouter,

  strategies: strategiesRouter,
  bankroll: bankrollRouter,
  bets: betsRouter,

  admin: adminRouter,

  bookmaker: bookmakerRouter,

  robot: robotRouter,
  subscription: subscriptionRouter,

  signals: signalsRouter,

});

export type AppRouter = typeof appRouter;

