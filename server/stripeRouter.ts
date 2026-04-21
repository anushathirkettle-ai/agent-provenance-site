/**
 * Agent Provenance — Stripe Router
 *
 * Procedures:
 *   - createCheckoutSession (protectedProcedure) — creates a Stripe Checkout
 *     session for the Pro tier and returns the session URL.
 *   - getSubscriptionStatus (protectedProcedure) — returns the current user's
 *     subscription tier and expiry.
 *
 * Webhook (registered in server/_core/index.ts):
 *   POST /api/stripe/webhook — handles checkout.session.completed and
 *   customer.subscription.deleted events.
 */

import Stripe from "stripe";
import { z } from "zod";
import { eq } from "drizzle-orm";
import type { Express, Request, Response } from "express";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { PRODUCTS } from "./products";

// ── Stripe client ──────────────────────────────────────────────────────────

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

// ── tRPC router ────────────────────────────────────────────────────────────

export const stripeRouter = router({
  /**
   * Create a Stripe Checkout session for the Pro plan.
   * Returns { url } — the client should redirect to this URL.
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripeClient();
      const priceId = PRODUCTS.pro.priceId;

      if (!priceId) {
        throw new Error(
          "STRIPE_PRO_PRICE_ID is not configured. Set it via webdev_request_secrets."
        );
      }

      const db = await getDb();
      let customerId = ctx.user.stripeCustomerId ?? undefined;

      // Create or reuse Stripe customer
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: ctx.user.email ?? undefined,
          name: ctx.user.name ?? undefined,
          metadata: { openId: ctx.user.openId },
        });
        customerId = customer.id;

        if (db) {
          await db
            .update(users)
            .set({ stripeCustomerId: customerId })
            .where(eq(users.id, ctx.user.id));
        }
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        subscription_data: {
          metadata: { openId: ctx.user.openId, userId: String(ctx.user.id) },
        },
        allow_promotion_codes: true,
      });

      return { url: session.url };
    }),

  /**
   * Return the current user's subscription status.
   */
  getSubscriptionStatus: protectedProcedure.query(({ ctx }) => {
    return {
      tier: ctx.user.subscriptionTier ?? "free",
      endsAt: ctx.user.subscriptionEndsAt ?? null,
      customerId: ctx.user.stripeCustomerId ?? null,
    };
  }),
});

// ── Webhook handler (registered as raw Express route) ─────────────────────

export function registerStripeWebhookRoute(app: Express): void {
  app.post(
    "/api/stripe/webhook",
    // Raw body required for Stripe signature verification — must come before
    // the global express.json() middleware.
    (req: Request, res: Response, next) => {
      let data = "";
      req.setEncoding("utf8");
      req.on("data", (chunk: string) => { data += chunk; });
      req.on("end", () => {
        (req as Request & { rawBody?: string }).rawBody = data;
        next();
      });
    },
    async (req: Request & { rawBody?: string }, res: Response) => {
      const stripe = getStripeClient();
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.warn("[Stripe] STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
      }

      let event: Stripe.Event;
      try {
        if (webhookSecret && req.rawBody) {
          const sig = req.headers["stripe-signature"] as string;
          event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
        } else {
          event = req.body as Stripe.Event;
        }
      } catch (err) {
        console.error("[Stripe] Webhook signature verification failed:", err);
        res.status(400).send(`Webhook Error: ${(err as Error).message}`);
        return;
      }

      const db = await getDb();
      if (!db) {
        console.warn("[Stripe] Database not available — webhook event not persisted");
        res.json({ received: true });
        return;
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            // openId is stored in session.metadata (set via subscription_data.metadata)
            // or directly in session.metadata
            const openId = (session.metadata as Record<string, string> | null)?.openId;
            const subscriptionId = typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id ?? null;

            if (openId && subscriptionId) {
              // Retrieve subscription to get the first item's period end
              const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
                expand: ["items"],
              });
              // In Stripe v22, current_period_end is on each SubscriptionItem
              const firstItem = subscription.items?.data?.[0];
              const periodEnd = firstItem?.current_period_end;
              const endsAt = periodEnd ? new Date(periodEnd * 1000) : null;

              await db
                .update(users)
                .set({
                  stripeSubscriptionId: subscriptionId,
                  subscriptionTier: "pro",
                  subscriptionEndsAt: endsAt,
                })
                .where(eq(users.openId, openId));

              console.log(`[Stripe] Pro subscription activated for openId=${openId}`);
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const openId = (subscription.metadata as Record<string, string> | null)?.openId;

            if (openId) {
              await db
                .update(users)
                .set({
                  subscriptionTier: "free",
                  stripeSubscriptionId: null,
                  subscriptionEndsAt: null,
                })
                .where(eq(users.openId, openId));

              console.log(`[Stripe] Subscription cancelled for openId=${openId}`);
            }
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const openId = (subscription.metadata as Record<string, string> | null)?.openId;

            if (openId) {
              const isActive = subscription.status === "active" || subscription.status === "trialing";
              const firstItem = subscription.items?.data?.[0];
              const periodEnd = firstItem?.current_period_end;
              const endsAt = periodEnd ? new Date(periodEnd * 1000) : null;

              await db
                .update(users)
                .set({
                  subscriptionTier: isActive ? "pro" : "free",
                  subscriptionEndsAt: isActive ? endsAt : null,
                })
                .where(eq(users.openId, openId));
            }
            break;
          }

          default:
            // Unhandled event type — not an error
            break;
        }
      } catch (err) {
        console.error("[Stripe] Error processing webhook event:", err);
        res.status(500).json({ error: "Internal webhook processing error" });
        return;
      }

      res.json({ received: true });
    }
  );
}
