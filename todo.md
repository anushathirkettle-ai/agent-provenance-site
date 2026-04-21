
## New Features (Round 3)

- [x] Announcement banner in Nav (dismissible, "Gio™ AI + Agentic Fabric now GA")
- [x] CSV upload on home page Agent Readiness Score widget with real backend scoring
- [x] Book a Demo modal on Pricing page Enterprise CTA + Talk to Sales buttons with owner notification

## Bug Fixes

- [x] Fix auto-scroll-up on page visit (banner layout shift + missing scroll-to-top on route change)

## Bug Fixes (Round 2)

- [x] Page still jumps/scrolls on initial visit — fixed with 100svh instead of min-h-screen
- [x] Gio chat scrolls page to top when message is submitted — contained scroll using ref, not scrollIntoView

## New Features (Round 4)

- [x] Build /platform page with interactive architecture diagram (7 modules, Gio™, Agentic Fabric, API layer)
- [x] Fix scroll-jump on initial page visit (ScrollToTop firing on mount)
- [x] Fix Gio chat input causing page scroll-to-top on mobile when keyboard opens

## Agent Provenance Repurpose (Round 5)

- [x] Replace Precisely branding with Agent Provenance (Nav, index.html title/meta, dark teal theme)
- [x] Build Home.tsx — hero with compliance score widget, EU AI Act countdown, SDK install, acquisition story
- [x] Build AuditTool.tsx — free Agent Compliance Auditor with scored report and PLG signup gate
- [x] Build auditRouter.ts — scoring logic for EU AI Act, data quality, PII exposure, audit trail
- [x] Wire auditRouter into routers.ts
- [x] Update App.tsx routing for Agent Provenance pages (/audit, /developers, /pricing)
- [x] Write 18 vitest tests for audit scoring logic — all passing
- [x] Build /developers page (SDK docs, LangChain integration, code examples)
- [x] Build /pricing page (Free tier, Pro, Enterprise)
- [ ] Build anushasu.com site (separate Manus project or static page)
- [ ] Build haatconsulting.com site (separate Manus project or static page)
- [ ] Point agentprovenance.io Cloudflare DNS to Manus
- [ ] Publish agentprovenance.io site
- [ ] Fix /audit page blank content bug
- [x] Fix footer — replace Precisely branding with Agent Provenance
