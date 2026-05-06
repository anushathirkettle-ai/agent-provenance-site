import Stripe from "stripe";
import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { PRODUCTS } from "./products";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export const stripeRouter = router({
  /** Get available products/prices for the frontend */
  getProducts: protectedProcedure.query(() => {
    return Object.values(PRODUCTS).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      monthlyAmount: p.monthlyAmount,
      annualAmount: p.annualAmount,
      agentLimit: p.agentLimit,
      features: p.features,
    }));
  }),

  /** Create a Stripe Checkout session for a subscription */
  createCheckoutSession: protectedProcedure
    .input(z.object({
      productId: z.string(),
      billing: z.enum(["monthly", "annual"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const product = PRODUCTS[input.productId];
      if (!product) throw new Error("Invalid product");

      const priceId = input.billing === "annual" ? product.annualPriceId : product.monthlyPriceId;
      const origin = ctx.req.headers.origin as string ?? "https://agentprovenance.io";

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: ctx.user.email ?? undefined,
        allow_promotion_codes: true,
        line_items: [{ price: priceId, quantity: 1 }],
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email ?? "",
          customer_name: ctx.user.name ?? "",
          product_id: product.id,
          billing: input.billing,
        },
        success_url: `${origin}/pricing?checkout=success`,
        cancel_url: `${origin}/pricing?checkout=cancelled`,
      });

      return { url: session.url };
    }),
});
