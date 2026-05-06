import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { auditRouter } from "./auditRouter";
import { adminRouter } from "./adminRouter";
import { stripeRouter } from "./stripeRouter";
import { decisionsRouter } from "./decisionsRouter";
import { reportRouter } from "./reportRouter";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  audit: auditRouter,
  admin: adminRouter,
  stripe: stripeRouter,
  decisions: decisionsRouter,
  reports: reportRouter,
});

export type AppRouter = typeof appRouter;
