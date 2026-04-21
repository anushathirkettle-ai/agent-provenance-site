# Agent Provenance — New Manus Conversation Context Brief

## What to do first

Clone the existing codebase from GitHub, then continue building:

```bash
gh repo clone anushathirkettle-ai/agent-provenance-site
cd agent-provenance-site
```

This is a **Manus webdev project** (React 19 + Tailwind 4 + Express + tRPC 11 + MySQL). Run `pnpm install` and `pnpm db:push` after cloning.

---

## Who I am

**Anusha Su Thirkettle** — VP AI Growth Innovation at Sage (9 years), previously EA Sports, Microsoft (named Surface), Nexmo. Cambridge AI Partnerships speaker. British Business Awards winner. Based in UK.

I have three interconnected projects:
- **agentprovenance.io** — the product (this codebase)
- **haatconsulting.com** — my fractional CPO/AI consulting firm
- **anushasu.com** — my personal brand site

---

## The Origin Story — Why We Built This

This is not a product that started with a market gap analysis. It started with a specific, repeated frustration that Anusha lived inside Sage for nine years.

**The core problem she kept hitting:** When an AI agent made a bad decision — gave a customer wrong financial advice, flagged the wrong invoice, misclassified a transaction — no one could explain why. Not the engineers who built it. Not the legal team who needed to defend it. Not the regulators who were starting to ask questions. The data trail simply didn't exist. You could see the output. You couldn't see the reasoning, the data it used, or whether that data was any good.

**The Sage context:** Anusha spent nine years building the AI product organisation at Sage from scratch. She was VP AI Growth Innovation — which in practice meant she was the person who had to answer the question "why did the AI do that?" when things went wrong. She shipped Sage Copilot features, rebuilt ones that didn't land, and was in the room when the company figured out what agentic finance actually meant. She gave a talk at Cambridge's Institute for Manufacturing on AI partnerships (with Microsoft and Amazon). She won the British Business Awards for Accountancy Software. She knows this space from the inside.

**The EU AI Act catalyst:** In 2024-2025, the EU AI Act started coming into force. Suddenly "why did the AI do that?" wasn't just an internal question — it was a legal requirement. CV screening, credit scoring, medical triage, benefits decisions: all HIGH RISK under Annex III. Companies deploying agents in these categories need audit trails. They need to prove data quality. They need to show the chain of reasoning. Most of them have no idea how to do this.

**The 78%/14% gap:** 78% of businesses have AI pilots. Only 14% have moved them into production. The number one reason cited is lack of trust and governance tooling. Companies are stuck in pilot purgatory not because the AI doesn't work, but because they can't prove it works safely enough to deploy at scale. Agent Provenance is the tool that closes that gap.

**Why open source:** Anusha's instinct — shaped by watching enterprise software vendor lock-in at Sage — was that compliance infrastructure should be a public good. If you make the audit trail proprietary, you're just creating a new dependency. The SDK is MIT licensed. The SaaS is how the lights stay on. This is the same model as Sentry, PostHog, Grafana.

**The personal stakes:** Anusha has a daughter in school. UK private school fees for 2026 average £16,000–£20,000/year for day pupils, up to £40,000+ for senior years. She is building this to generate real income — not as a side project, not as a portfolio piece. The HAAT Consulting firm (haatconsulting.com) is the near-term cashflow vehicle (fractional CPO engagements, agent audits at £1,000–£5,000 each). Agent Provenance is the long-term equity vehicle. Both need to work.

**The Precisely connection:** Before Agent Provenance, Anusha built a mock product called "Precisely" — a data quality platform for AI agents positioned at the data layer ("Your agents are ready. Is your data?"). Precisely was a PLG mock site built to test messaging and show to advisors like Walid. Agent Provenance is the evolved, more focused version — same problem, sharper positioning, compliance-first rather than data-quality-first. The Precisely site still exists at preciselyplg-gywycfgx.manus.space for Walid to reference.

**The name:** "Agent Provenance" — provenance means the documented history of an object's origins and custody. In the art world, provenance is what makes a painting worth millions or worthless. In AI, provenance is what makes an agent decision defensible or indefensible. The name is deliberate.

---

## What Agent Provenance is

**Agent Provenance** is an open-source SDK + SaaS that attaches compliance-ready audit trails to AI agent decisions. Every agent output is linked to data quality scores, PII flags, and EU AI Act risk levels.

**Positioning:** "The missing compliance layer for AI agents."

**Target buyers:** CTOs, Legal, Compliance, and Ops teams at companies deploying AI agents in regulated industries (Finance, Health, Law, HR).

**PLG model:**
- Free: Run one audit per day, basic scoring, 3 issues shown
- Pro ($49/month): Unlimited audits, full issue list, recommendations, SDK install command, PDF export
- Enterprise (custom): On-prem, custom integrations, SLA

**The EU AI Act angle:** CV/resume screening, credit scoring, medical triage = HIGH RISK under Annex III. Regulators require audit trails. Agent Provenance generates them automatically.

---

## What's already built (in the GitHub repo)

### Pages
- **Home** (`client/src/pages/Home.tsx`) — dark editorial design, "The missing compliance layer for AI agents" hero, Agent Readiness Score widget with animated rings, 5 dimensions (Completeness/Accuracy/Consistency/Freshness/Context), CSV upload for scoring, countdown timer, Gio™ AI chat
- **AuditTool** (`client/src/pages/AuditTool.tsx`) — free compliance auditor, 4 input fields (agent name, framework, use case, data sources), runs scoring, shows EU AI Act risk badge (HIGH/LIMITED/MINIMAL), scores for EU AI Act / Data Quality / PII / Audit Trail, shows top 3 issues free, PLG gate ("Sign in to unlock full report" with Pro upsell)
- **Pricing** (`client/src/pages/Pricing.tsx`) — Free / Pro ($49/mo) / Enterprise tiers, Pro waitlist modal (needs Stripe checkout wired up — see below), Enterprise inquiry modal with owner notification
- **Developers** (`client/src/pages/Developers.tsx`) — SDK quickstart, code examples, API reference
- **Solutions** (`client/src/pages/Solutions.tsx`) — use cases by industry

### Backend routers
- `server/auditRouter.ts` — scoring logic for EU AI Act / data quality / PII / audit trail, returns scores 0-100 with issues and recommendations
- `server/gioRouter.ts` — Gio™ AI chat using built-in LLM
- `server/scoreRouter.ts` — CSV upload scoring endpoint
- `server/demoRouter.ts` — Book a Demo form with owner notification

### Design system
- **Dark ink background** (`oklch(0.08 0.01 264)`)
- **Electric indigo accent** (`oklch(0.62 0.20 264)`)
- **Teal secondary** (`oklch(0.72 0.18 180)`)
- **Amber warning** (`oklch(0.78 0.18 85)`)
- **Fonts:** Space Grotesk (headings), Inter (body)
- **Editorial ruled lines** as section dividers
- **EU AI Act compliance banner** in Nav

### Nav links
Home, Audit, Pricing, Developers — plus GitHub icon link

---

## What still needs to be built

### Priority 1 — About page
Create `client/src/pages/About.tsx` and add `/about` route in `client/src/App.tsx`.

**Content for About page:**

**Hero:** "We built the tool we wish existed."

**Anusha's story (first person):**
"I spent nine years at Sage building the AI product organisation from scratch. I shipped Copilot features that didn't land, rebuilt them, and eventually helped define what agentic finance actually looks like. Along the way, I kept hitting the same wall: when an AI agent made a bad decision, no one could prove why. Not the engineers, not the legal team, not the regulators. The data trail just didn't exist.

Agent Provenance is the answer to that question. It's open source, self-hostable, and designed to be invisible until you need it — and then it's the most important thing in the room."

**Mission:** "Make AI agent decisions auditable by default."

**Open source ethos:** "We believe compliance infrastructure should be a public good, not a vendor lock-in play. The core SDK is MIT licensed. The SaaS is how we keep the lights on."

**Team:** Anusha Su Thirkettle — Founder. (Solo founder for now, hiring ML engineer and DevRel.)

**Logos/credibility:** Sage, Cambridge IfM, Microsoft, EA Sports, British Business Awards

**CTA:** "Try the free audit" → /audit

### Priority 2 — Stripe integration
A Stripe product and price were already created in the sandbox. The price ID needs to be wired up.

**What to do:**
1. Run `webdev_add_feature` with `stripe` to get Stripe scaffolding
2. Create `server/stripeRouter.ts` with:
   - `createCheckoutSession` procedure (protectedProcedure) — creates Stripe checkout session for Pro tier
   - Webhook handler at `/api/stripe/webhook` — handles `checkout.session.completed`, updates user subscription status
3. Add `stripe_customer_id` and `stripe_subscription_id` to users table in `drizzle/schema.ts`
4. Create `server/products.ts` with Pro price ID
5. Update `client/src/pages/Pricing.tsx` Pro CTA to call `trpc.stripe.createCheckoutSession.useMutation()` instead of showing waitlist modal
6. Use `webdev_request_secrets` to set `STRIPE_PRO_PRICE_ID`

**Stripe test card:** 4242 4242 4242 4242

### Priority 3 — Push to GitHub (public repo for SDK)
The `agent-provenance-site` repo is currently private. When ready to launch:
- Make it public: `gh repo edit anushathirkettle-ai/agent-provenance-site --visibility public`
- Add a proper README with SDK install instructions: `pip install agent-provenance`

### Priority 4 — haatconsulting.com Free Audit CTA
The haatconsulting.com site (static HTML at `/home/ubuntu/haatconsulting-site/`) has a "Free Agent Audit" section. The CTA button should link to `https://agentprovenance.io/audit` once the domain is live.

---

## GTM Strategy (already written, for reference)

**Week 1 (this week):**
- Publish Precisely at preciselyplg-gywycfgx.manus.space (Walid's link)
- Launch Agent Provenance at agentprovenance.io
- Post LinkedIn launch article (EU AI Act angle)

**Month 1:**
- HAAT Consulting: 2 free agent audits as lead gen → convert to £500-£2000/month retainers
- Agent Provenance: Target 100 free tier signups from developer communities (HN, Reddit r/MachineLearning, EU AI Act Slack groups)
- Content: "Your LangChain agent is probably non-compliant. Here's how to check." blog post

**Month 2-3:**
- Agent Provenance Pro: Target 10 paying customers at $49/month = $490 MRR
- HAAT: 2-3 fractional engagements = £3,000-£6,000/month
- Outreach to EU AI Act compliance consultancies as channel partners

**School fees target (Gemini analysis):**
- HAAT "Token Leak Audits" at £1,000-£5,000 each: 4-8 per year covers primary school fees
- Agent Provenance Pro at $49/month: 100 customers = $4,900 MRR covers senior school fees

---

## Domain binding (to do after publishing)

- `agentprovenance.io` → bind to Manus project via Settings → Domains
- `anushasu.com` → GitHub Pages (repo: anushathirkettle-ai/anushasu-site)
- `haatconsulting.com` → GitHub Pages (repo: anushathirkettle-ai/haatconsulting-site)

---

## Key files to know

```
client/src/pages/Home.tsx          ← Main landing page
client/src/pages/AuditTool.tsx     ← Free compliance auditor (PLG core)
client/src/pages/Pricing.tsx       ← Pricing tiers (needs Stripe)
client/src/pages/Developers.tsx    ← SDK docs
client/src/App.tsx                 ← Routes (add /about here)
client/src/components/Nav.tsx      ← Nav links (add About here)
server/auditRouter.ts              ← Scoring logic
server/routers.ts                  ← tRPC router registration
drizzle/schema.ts                  ← DB schema (add stripe fields)
```

---

## Tests
23 tests passing at last checkpoint. Run `pnpm test` to verify.

---

## Manus project secrets already configured
- `STRIPE_SECRET_KEY` (sk_test_...)
- `VITE_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- `STRIPE_WEBHOOK_SECRET`
- All Manus OAuth secrets
- `STRIPE_PRO_PRICE_ID` — needs to be set (create via Stripe API or dashboard)
