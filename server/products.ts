/**
 * Agent Provenance — Stripe product/price definitions
 * These are the subscription tiers for the fleet compliance platform.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  monthlyPriceId: string; // Stripe Price ID (monthly)
  annualPriceId: string;  // Stripe Price ID (annual)
  monthlyAmount: number;  // in cents
  annualAmount: number;   // in cents (per month, billed annually)
  agentLimit: number | null; // null = unlimited
  features: string[];
}

/**
 * NOTE: These Stripe Price IDs must be created in your Stripe dashboard.
 * In test mode, create products and prices at https://dashboard.stripe.com/test/products
 * Replace the placeholder IDs below with your actual Stripe Price IDs.
 *
 * Recommended setup:
 *   Team Monthly: $199/mo
 *   Team Annual: $159/mo (billed as $1,908/yr)
 *   Scale Monthly: $799/mo
 *   Scale Annual: $639/mo (billed as $7,668/yr)
 */
export const PRODUCTS: Record<string, Product> = {
  team_monthly: {
    id: "team_monthly",
    name: "Team",
    description: "Up to 10 agents in your fleet",
    monthlyPriceId: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? "price_team_monthly",
    annualPriceId: process.env.STRIPE_PRICE_TEAM_ANNUAL ?? "price_team_annual",
    monthlyAmount: 19900,
    annualAmount: 15900,
    agentLimit: 10,
    features: [
      "Up to 10 agents",
      "Unlimited compliance audits",
      "Full EU AI Act compliance report",
      "PII detection (13 types)",
      "Decision trace (90 days)",
      "Multi-agent lineage (DAG)",
      "Fleet compliance dashboard",
      "Email support",
    ],
  },
  scale_monthly: {
    id: "scale_monthly",
    name: "Scale",
    description: "Up to 50 agents in your fleet",
    monthlyPriceId: process.env.STRIPE_PRICE_SCALE_MONTHLY ?? "price_scale_monthly",
    annualPriceId: process.env.STRIPE_PRICE_SCALE_ANNUAL ?? "price_scale_annual",
    monthlyAmount: 79900,
    annualAmount: 63900,
    agentLimit: 50,
    features: [
      "Up to 50 agents",
      "Unlimited compliance audits",
      "Lawyer-readable PDF reports",
      "Fleet-wide compliance dashboard",
      "Cross-agent lineage (full DAG)",
      "PII detection + auto-redaction",
      "Decision trace (1 year)",
      "Webhook alerts",
      "Priority support + SLA",
    ],
  },
};
