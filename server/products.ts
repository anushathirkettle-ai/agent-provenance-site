/**
 * Agent Provenance — Stripe product/price constants
 *
 * STRIPE_PRO_PRICE_ID must be set in environment variables.
 * Create the price in Stripe dashboard or via API:
 *   - Product: "Agent Provenance Pro"
 *   - Price: $49/month recurring
 */
export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? "";

export const PRODUCTS = {
  pro: {
    name: "Agent Provenance Pro",
    priceId: STRIPE_PRO_PRICE_ID,
    amount: 4900, // $49.00 in cents
    currency: "usd",
    interval: "month" as const,
  },
} as const;
