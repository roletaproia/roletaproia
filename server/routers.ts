import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { strategiesRouter } from "./routers/strategies";
import { bankrollRouter } from "./routers/bankroll";
import { betsRouter } from "./routers/bets";
import { chatRouter } from "./routers/chat";
import { adminRouter } from "./routers/admin";
import { profileRouter } from "./routers/profile";
import { bookmakerRouter } from "./routers/bookmaker";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  strategies: strategiesRouter,
  bankroll: bankrollRouter,
  bets: betsRouter,
  chat: chatRouter,
  admin: adminRouter,
  profile: profileRouter,
  bookmaker: bookmakerRouter,
});

export type AppRouter = typeof appRouter;
