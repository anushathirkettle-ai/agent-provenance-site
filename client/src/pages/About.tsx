/**
 * About — Agent Provenance
 * Origin story, mission, open-source ethos, team, credibility logos, CTA
 */
import { Link } from "wouter";
import { ArrowRight, Github, Shield, BookOpen, Users, ExternalLink } from "lucide-react";

const credibilityItems = [
  {
    name: "Sage",
    detail: "9 years · VP AI Growth Innovation",
    icon: (
      <svg viewBox="0 0 60 24" width="52" height="21" fill="currentColor" className="text-white/50">
        <text x="0" y="19" fontFamily="sans-serif" fontWeight="700" fontSize="20">Sage</text>
      </svg>
    ),
  },
  {
    name: "Cambridge IfM",
    detail: "AI Partnerships speaker",
    icon: (
      <svg viewBox="0 0 120 24" width="100" height="21" fill="currentColor" className="text-white/50">
        <text x="0" y="19" fontFamily="sans-serif" fontWeight="600" fontSize="14">Cambridge IfM</text>
      </svg>
    ),
  },
  {
    name: "Microsoft",
    detail: "Named Surface",
    icon: (
      <svg viewBox="0 0 90 24" width="80" height="21" fill="currentColor" className="text-white/50">
        <text x="0" y="19" fontFamily="sans-serif" fontWeight="600" fontSize="14">Microsoft</text>
      </svg>
    ),
  },
  {
    name: "EA Sports",
    detail: "Gaming executive",
    icon: (
      <svg viewBox="0 0 80 24" width="70" height="21" fill="currentColor" className="text-white/50">
        <text x="0" y="19" fontFamily="sans-serif" fontWeight="600" fontSize="14">EA Sports</text>
      </svg>
    ),
  },
  {
    name: "British Business Awards",
    detail: "Accountancy Software winner",
    icon: (
      <svg viewBox="0 0 160 24" width="140" height="21" fill="currentColor" className="text-white/50">
        <text x="0" y="19" fontFamily="sans-serif" fontWeight="600" fontSize="13">British Business Awards</text>
      </svg>
    ),
  },
];

const values = [
  {
    icon: Shield,
    title: "Compliance by default",
    body: "Audit trails shouldn't be an afterthought. Every agent decision should be explainable — not just to engineers, but to legal teams and regulators.",
  },
  {
    icon: BookOpen,
    title: "Open source as infrastructure",
    body: "Compliance infrastructure should be a public good. The core SDK is MIT licensed. Vendor lock-in on audit trails is the wrong model.",
  },
  {
    icon: Github,
    title: "Transparent by design",
    body: "If we're building tools to make AI decisions auditable, we should hold ourselves to the same standard. Everything we build is inspectable.",
  },
  {
    icon: Users,
    title: "Built for the people in the room",
    body: "CTOs, legal, compliance, ops. The people who have to answer 'why did the AI do that?' when things go wrong. We build for them.",
  },
];

export default function About() {
  return (
    <div className="bg-[oklch(0.10_0.015_240)] text-white min-h-screen">

      {/* ── HERO ── */}
      <section
        className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 0%, oklch(0.18 0.04 200 / 0.30) 0%, transparent 70%), oklch(0.10 0.015 240)",
        }}
      >
        {/* grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/8 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
              <span className="text-xs font-medium text-teal-300">Our story</span>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-[3.5rem] text-white leading-[1.08] mb-6">
              We built the tool<br />
              <span className="italic" style={{ color: "oklch(0.65 0.18 185)" }}>we wish existed.</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
              Agent Provenance started not with a market gap analysis, but with a specific, repeated
              frustration — the moment when an AI agent made a bad decision and no one could explain why.
            </p>
          </div>
        </div>
      </section>

      {/* ── RULED DIVIDER ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="h-px bg-white/8" />
      </div>

      {/* ── ANUSHA'S STORY ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">

            {/* Left — founder card */}
            <div className="lg:sticky lg:top-28">
              <div className="bg-[oklch(0.12_0.015_240)] border border-white/10 rounded-xl p-6">
                {/* Avatar placeholder — initials */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4"
                  style={{ background: "oklch(0.62 0.20 264)" }}
                >
                  AS
                </div>
                <div className="mb-1">
                  <span className="text-sm font-semibold text-white">Anusha Su Thirkettle</span>
                </div>
                <div className="text-xs text-teal-400 font-medium mb-3">Founder, Agent Provenance</div>
                <div className="space-y-1.5 text-xs text-white/45 mb-4">
                  <div>VP AI Growth Innovation · Sage (9 yrs)</div>
                  <div>Cambridge IfM · AI Partnerships speaker</div>
                  <div>British Business Awards winner</div>
                  <div>Microsoft Surface · EA Sports · Nexmo</div>
                </div>
                <div className="h-px bg-white/8 my-4" />
                <div className="text-xs text-white/30 leading-relaxed">
                  Solo founder. Hiring ML engineer and DevRel.
                </div>
                <a
                  href="https://www.linkedin.com/in/anushasu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                >
                  LinkedIn <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Right — story */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">The wall I kept hitting</h2>
                <div className="space-y-4 text-white/65 leading-relaxed">
                  <p>
                    I spent nine years at Sage building the AI product organisation from scratch. I shipped
                    Copilot features that didn't land, rebuilt them, and eventually helped define what agentic
                    finance actually looks like. Along the way, I kept hitting the same wall: when an AI agent
                    made a bad decision, no one could prove why.
                  </p>
                  <p>
                    Not the engineers who built it. Not the legal team who needed to defend it. Not the
                    regulators who were starting to ask questions. The data trail simply didn't exist. You
                    could see the output. You couldn't see the reasoning, the data it used, or whether that
                    data was any good.
                  </p>
                  <p>
                    Agent Provenance is the answer to that question. It's open source, self-hostable, and
                    designed to be invisible until you need it — and then it's the most important thing in
                    the room.
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/8" />

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">The EU AI Act catalyst</h2>
                <div className="space-y-4 text-white/65 leading-relaxed">
                  <p>
                    In 2024–2025, the EU AI Act started coming into force. Suddenly "why did the AI do
                    that?" wasn't just an internal question — it was a legal requirement. CV screening,
                    credit scoring, medical triage, benefits decisions: all HIGH RISK under Annex III.
                    Companies deploying agents in these categories need audit trails. They need to prove
                    data quality. They need to show the chain of reasoning.
                  </p>
                  <p>
                    Most of them have no idea how to do this.
                  </p>
                  <div
                    className="border-l-2 pl-5 py-1"
                    style={{ borderColor: "oklch(0.65 0.18 185)" }}
                  >
                    <p className="text-white/80 italic">
                      78% of businesses have AI pilots. Only 14% have moved them into production. The
                      number one reason cited is lack of trust and governance tooling.
                    </p>
                    <p className="text-xs text-white/35 mt-2">
                      Companies are stuck in pilot purgatory not because the AI doesn't work, but because
                      they can't prove it works safely enough to deploy at scale.
                    </p>
                  </div>
                  <p>
                    Agent Provenance is the tool that closes that gap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RULED DIVIDER ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="h-px bg-white/8" />
      </div>

      {/* ── MISSION ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Mission</p>
            <h2 className="text-3xl lg:text-4xl font-serif text-white leading-tight">
              Make AI agent decisions{" "}
              <span className="italic" style={{ color: "oklch(0.65 0.18 185)" }}>
                auditable by default.
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-[oklch(0.12_0.015_240)] border border-white/8 rounded-xl p-6 hover:border-teal-500/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-500/12 border border-teal-500/20 flex items-center justify-center mb-4">
                  <Icon size={16} className="text-teal-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RULED DIVIDER ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="h-px bg-white/8" />
      </div>

      {/* ── OPEN SOURCE ETHOS ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
                Open source
              </p>
              <h2 className="text-3xl lg:text-4xl font-serif text-white leading-tight mb-6">
                Compliance infrastructure<br />
                <span className="italic" style={{ color: "oklch(0.65 0.18 185)" }}>
                  should be a public good.
                </span>
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed mb-8">
                <p>
                  Watching enterprise software vendor lock-in at Sage for nine years taught me one
                  thing: if you make the audit trail proprietary, you're just creating a new
                  dependency. That's the wrong model.
                </p>
                <p>
                  The SDK is MIT licensed. Self-hostable. Inspectable. The SaaS is how the lights
                  stay on — the same model as Sentry, PostHog, and Grafana. Open core, not open
                  washing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://github.com/anushathirkettle-ai/agent-provenance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 text-sm font-medium text-white/80 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Github size={15} />
                  View on GitHub
                </a>
                <Link
                  href="/developers"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 text-sm font-medium text-white/80 hover:text-white hover:border-white/30 transition-colors"
                >
                  SDK docs <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Code snippet */}
            <div className="bg-[oklch(0.08_0.015_240)] border border-white/10 rounded-xl p-6 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-white/25 text-xs ml-2">agent_audit.py</span>
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-teal-400">from</span>
                  <span className="text-white"> agent_provenance </span>
                  <span className="text-teal-400">import</span>
                  <span className="text-yellow-300"> ProvenanceTracer</span>
                </div>
                <div className="text-white/25">&nbsp;</div>
                <div>
                  <span className="text-white">tracer </span>
                  <span className="text-white/40">= </span>
                  <span className="text-yellow-300">ProvenanceTracer</span>
                  <span className="text-white/40">(</span>
                </div>
                <div className="pl-4">
                  <span className="text-green-400">api_key</span>
                  <span className="text-white/40">=</span>
                  <span className="text-orange-300">"your-key"</span>
                  <span className="text-white/40">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-green-400">eu_ai_act_risk</span>
                  <span className="text-white/40">=</span>
                  <span className="text-orange-300">"HIGH"</span>
                </div>
                <div><span className="text-white/40">)</span></div>
                <div className="text-white/25">&nbsp;</div>
                <div className="text-white/35">
                  <span className="text-white/25"># </span>
                  Wrap your agent — zero changes to logic
                </div>
                <div>
                  <span className="text-white/40">@</span>
                  <span className="text-yellow-300">tracer.trace</span>
                </div>
                <div>
                  <span className="text-teal-400">def</span>
                  <span className="text-yellow-300"> run_agent</span>
                  <span className="text-white/40">(input):</span>
                </div>
                <div className="pl-4 text-white/50">...</div>
                <div className="text-white/25">&nbsp;</div>
                <div className="text-white/35">
                  <span className="text-white/25"># </span>
                  Audit trail, data quality + PII scores auto-attached
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RULED DIVIDER ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="h-px bg-white/8" />
      </div>

      {/* ── CREDIBILITY LOGOS ── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/25 text-center mb-10">
            Founder background
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {credibilityItems.map(({ name, detail }) => (
              <div key={name} className="flex flex-col items-center gap-1.5 group">
                <span className="text-base font-semibold text-white/40 group-hover:text-white/70 transition-colors tracking-tight">
                  {name}
                </span>
                <span className="text-[10px] text-white/25 group-hover:text-white/40 transition-colors">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RULED DIVIDER ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="h-px bg-white/8" />
      </div>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif text-white mb-4">
            See it in action.
          </h2>
          <p className="text-white/55 mb-8 max-w-md mx-auto">
            Run a free compliance audit on your agent in under two minutes. No sign-up required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/audit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
              style={{
                background: "oklch(0.72 0.18 180)",
                color: "oklch(0.08 0.015 240)",
              }}
            >
              Try the free audit <ArrowRight size={15} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
