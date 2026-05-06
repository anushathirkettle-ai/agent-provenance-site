import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { notifyOwner } from "./_core/notification";

export function registerStripeWebhook(app: Express) {
  // MUST use express.raw() BEFORE express.json() for webhook signature verification
  app.post(
    "/api/stripe/webhook",
    // express.raw is applied at the route level via the raw body in req
    async (req: Request, res: Response) => {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!stripeKey || !webhookSecret) {
        console.warn("[Stripe Webhook] Missing keys, skipping");
        return res.json({ received: true });
      }

      const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });
      const sig = req.headers["stripe-signature"];

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
      } catch (err) {
        console.error("[Stripe Webhook] Signature verification failed:", err);
        return res.status(400).json({ error: "Webhook signature verification failed" });
      }

      // ⚠️ CRITICAL: Test events must return verified:true
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Event: ${event.type} (${event.id})`);

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.user_id;
          const email = session.metadata?.customer_email;
          const name = session.metadata?.customer_name;
          const productId = session.metadata?.product_id;
          const billing = session.metadata?.billing;

          console.log(`[Stripe] New subscription: user=${userId}, product=${productId}, billing=${billing}`);

          try {
            await notifyOwner({
              title: `New subscription: ${name ?? email}`,
              content: `**User ID:** ${userId}\n**Email:** ${email}\n**Product:** ${productId}\n**Billing:** ${billing}\n**Session:** ${session.id}`,
            });
          } catch {
            // Non-fatal
          }
          break;
        }

        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription;
          console.log(`[Stripe] Subscription cancelled: ${sub.id}`);
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          console.log(`[Stripe] Payment failed: ${invoice.id}`);
          break;
        }

        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }

      return res.json({ received: true });
    }
  );
}
