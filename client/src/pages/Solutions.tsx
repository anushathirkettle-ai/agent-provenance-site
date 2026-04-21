/**
 * PRECISELY — Solutions Page
 * CIO / CFO / CMO persona narratives, use cases, ROI framing
 * Design: Editorial Precision — warm stone sections, dark ink callouts
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Shield, Users, Zap, Globe, Database, CheckCircle2, AlertTriangle, BarChart3 } from "lucide-react";

const personas = [
  {
    id: "cio",
    role: "CIO",
    title: "Chief Information Officer",
    headline: "Your AI strategy is only as good as your data foundation",
    subhead: "87% of leaders say they're AI-ready. 43% admit data is the obstacle.",
    color: "oklch(0.62 0.20 264)",
    icon: Shield,
    challenge: "You're deploying AI agents across every business function. But each agent amplifies the quality of the data it acts on — for better or worse. Bad address data doesn't just waste a stamp. It fails a delivery, triggers a customer complaint, and cascades into your CRM, your billing, and your agent's next decision.",
    solution: "Precisely gives you a unified data integrity layer — across all 7 modules — that sits beneath every agent you deploy. One platform, one governance model, one audit trail. FedRAMP Authorized for government workloads. SOC 2 Type II for enterprise.",
    outcomes: [
      { metric: "100%", label: "Compliance on data governance programs", customer: "NZ Super Fund" },
      { metric: "40%", label: "Reduction in data remediation costs", customer: "Barclays" },
      { metric: "3x", label: "Faster AI initiative deployment", customer: "Aetna" },
    ],
    useCases: [
      { title: "AI Readiness Assessment", desc: "Score your entire data estate before committing to AI initiatives. Know exactly where the gaps are." },
      { title: "Governance at Scale", desc: "FedRAMP Authorized data governance with automated PII detection, lineage tracking, and policy enforcement." },
      { title: "Mainframe Modernization", desc: "Real-time CDC from IBM i and mainframe to cloud — without disrupting production systems." },
    ],
    modules: ["Data Governance", "Data Observability", "Data Integration", "Data Quality"],
  },
  {
    id: "cfo",
    role: "CFO",
    title: "Chief Financial Officer",
    headline: "Data quality debt is your biggest hidden AI cost",
    subhead: "Every bad record costs money. AI agents multiply these errors at machine speed.",
    color: "oklch(0.72 0.18 162)",
    icon: TrendingUp,
    challenge: "The average enterprise loses $12.9M annually to poor data quality (Gartner). That was before AI agents. Now every agent decision — a collection attempt, a delivery route, a credit decision — is made at machine speed, at scale. One bad address field doesn't fail one transaction. It fails thousands per hour.",
    solution: "Precisely quantifies your data quality debt and gives you a clear ROI on fixing it. The Agent Readiness Score tells you exactly which dimensions are costing you money. Each module maps to a specific cost center: Geo Addressing fixes failed deliveries, Data Enrichment improves collections, Data Quality reduces compliance risk.",
    outcomes: [
      { metric: "$2.4M", label: "Annual savings from address validation", customer: "FedEx" },
      { metric: "28%", label: "Improvement in collections success rate", customer: "Nationwide" },
      { metric: "60%", label: "Reduction in compliance audit costs", customer: "Belfius" },
    ],
    useCases: [
      { title: "Data Quality ROI Calculator", desc: "Quantify the cost of your current data quality gaps across every business process." },
      { title: "Collections Optimization", desc: "Verified addresses and enriched contact data improve first-contact resolution rates significantly." },
      { title: "Compliance Cost Reduction", desc: "Automated governance and audit trails reduce the cost of regulatory compliance by up to 60%." },
    ],
    modules: ["Data Quality", "Geo Addressing", "Data Governance", "Data Enrichment"],
  },
  {
    id: "cmo",
    role: "CMO",
    title: "Chief Marketing Officer",
    headline: "Your personalization agents need real-world context",
    subhead: "Your CRM data is 18 months stale. Your agents are personalizing based on guesses.",
    color: "oklch(0.78 0.18 85)",
    icon: Users,
    challenge: "You've invested in AI-powered personalization. Your agents are making decisions about which message to send, which offer to show, which channel to use. But they're working with CRM data that's 18 months out of date, missing demographic context, and full of duplicate records. The result: personalization that feels generic at best, and offensive at worst.",
    solution: "Precisely's Data Enrichment APIs add real-world context to every customer record — demographics, firmographics, lifestyle data, location intelligence. 500+ curated, pre-linked datasets. The PreciselyID links every record to a real-world entity, eliminating duplicates and enabling true 1:1 personalization.",
    outcomes: [
      { metric: "34%", label: "Improvement in campaign response rates", customer: "Pfizer" },
      { metric: "22%", label: "Reduction in customer acquisition cost", customer: "Walmart" },
      { metric: "2.1x", label: "Increase in personalization accuracy", customer: "Aetna" },
    ],
    useCases: [
      { title: "Customer Data Enrichment", desc: "Add demographics, firmographics, and lifestyle context to every customer record automatically." },
      { title: "Duplicate Resolution", desc: "PreciselyID creates a single, persistent identifier for every real-world entity across all your systems." },
      { title: "Location Intelligence", desc: "Understand your customers' real-world context — neighborhood, commute patterns, local business density." },
    ],
    modules: ["Data Enrichment", "Data Quality", "Geo Addressing", "Spatial Analytics"],
  },
];

const industryUseCases = [
  {
    industry: "Financial Services",
    icon: TrendingUp,
    cases: ["KYC/AML address verification", "Collections contact optimization", "Fraud detection data enrichment", "Regulatory compliance automation"],
  },
  {
    industry: "Healthcare & Life Sciences",
    icon: Shield,
    cases: ["Patient address validation", "Provider data quality", "Claims processing accuracy", "HIPAA-compliant governance"],
  },
  {
    industry: "Retail & E-commerce",
    icon: Globe,
    cases: ["Delivery address verification", "Customer 360 enrichment", "Location-based personalization", "Supply chain data quality"],
  },
  {
    industry: "Government & Public Sector",
    icon: Database,
    cases: ["FedRAMP-authorized data governance", "Constituent address validation", "Benefits eligibility verification", "Geospatial analytics"],
  },
];

export default function Solutions() {
  const [activePersona, setActivePersona] = useState("cio");
  const persona = personas.find(p => p.id === activePersona)!;
  const Icon = persona.icon;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.004_80)]" style={{ fontFamily: "var(--font-sans-body)" }}>

      {/* Header */}
      <section className="pt-32 pb-16 bg-[oklch(0.10_0.012_260)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(ellipse 70% 60% at 30% 50%, oklch(0.62 0.20 264) 0%, transparent 60%)"
        }} />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <div className="text-xs font-mono-data text-[oklch(0.62_0.20_264)] uppercase tracking-widest mb-4">Solutions</div>
            <h1 className="font-serif-display text-4xl sm:text-5xl text-white mb-6">
              Every leader has a data problem.<br />
              <span className="text-white/50">We solve all of them.</span>
            </h1>
            <p className="text-white/60 leading-relaxed">
              The agentic AI revolution is here. Whether you're a CIO building the foundation, a CFO measuring the ROI, or a CMO deploying personalization at scale — your agents are only as good as the data they act on.
            </p>
          </div>
        </div>
      </section>

      {/* Persona selector */}
      <section className="sticky top-16 z-30 bg-[oklch(0.97_0.004_80)] border-b border-[oklch(0.88_0.006_80)] overflow-x-auto">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex gap-1 py-2 min-w-max sm:min-w-0">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activePersona === p.id
                    ? "bg-[oklch(0.14_0.010_260)] text-white"
                    : "text-[oklch(0.50_0.010_260)] hover:bg-[oklch(0.92_0.004_80)]"
                }`}
              >
                {p.role}
                <span className={`ml-2 text-xs hidden sm:inline ${activePersona === p.id ? "text-white/50" : "text-[oklch(0.65_0.010_260)]"}`}>
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Persona content */}
      <section className="py-20 bg-[oklch(0.97_0.004_80)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          {/* Hero */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16 lg:mb-20">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono-data font-medium mb-6"
                style={{ backgroundColor: `${persona.color.replace(')', ' / 0.10)')}`, color: persona.color }}
              >
                <Icon size={12} />
                {persona.role} — {persona.title}
              </div>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-[oklch(0.14_0.012_260)] leading-tight mb-4">
                {persona.headline}
              </h2>
              <p className="text-[oklch(0.50_0.010_260)] text-lg mb-6 leading-relaxed">{persona.subhead}</p>
              <div className="p-5 bg-[oklch(0.14_0.010_260)] rounded-xl border-l-2 mb-6" style={{ borderColor: persona.color }}>
                <p className="text-sm text-white/70 leading-relaxed">{persona.challenge}</p>
              </div>
              <p className="text-sm text-[oklch(0.45_0.010_260)] leading-relaxed">{persona.solution}</p>
            </div>

            {/* Outcomes */}
            <div className="space-y-4">
              <div className="text-xs font-mono-data text-[oklch(0.60_0.010_260)] uppercase tracking-widest mb-6">Proven outcomes</div>
              {persona.outcomes.map((outcome) => (
                <div key={outcome.metric} className="flex gap-5 p-5 bg-white border border-[oklch(0.88_0.006_80)] rounded-xl">
                  <div className="font-serif-display text-3xl leading-none shrink-0" style={{ color: persona.color }}>
                    {outcome.metric}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[oklch(0.20_0.012_260)] mb-1">{outcome.label}</div>
                    <div className="text-xs text-[oklch(0.60_0.010_260)] font-mono-data">{outcome.customer}</div>
                  </div>
                </div>
              ))}

              {/* Modules used */}
              <div className="p-5 bg-[oklch(0.14_0.010_260)] rounded-xl">
                <div className="text-xs font-mono-data text-white/40 uppercase tracking-widest mb-3">Modules used</div>
                <div className="flex flex-wrap gap-2">
                  {persona.modules.map((mod) => (
                    <span key={mod} className="px-3 py-1 bg-white/8 border border-white/10 rounded-full text-xs text-white/70 font-medium">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Use cases */}
          <div>
            <div className="text-xs font-mono-data text-[oklch(0.50_0.22_264)] uppercase tracking-widest mb-8">Use Cases</div>
            <div className="grid md:grid-cols-3 gap-6">
              {persona.useCases.map((uc) => (
                <div key={uc.title} className="p-6 bg-white border border-[oklch(0.88_0.006_80)] rounded-2xl hover:shadow-lg hover:border-[oklch(0.50_0.22_264)/30] transition-all">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${persona.color.replace(')', ' / 0.10)')}` }}>
                    <Zap size={16} style={{ color: persona.color }} />
                  </div>
                  <h3 className="font-semibold text-[oklch(0.14_0.012_260)] mb-2">{uc.title}</h3>
                  <p className="text-sm text-[oklch(0.50_0.010_260)] leading-relaxed">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry solutions */}
      <section className="py-20 bg-[oklch(0.14_0.010_260)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-mono-data text-[oklch(0.62_0.20_264)] uppercase tracking-widest mb-4">By Industry</div>
            <h2 className="font-serif-display text-3xl text-white">Built for regulated, complex industries</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryUseCases.map((ind) => {
              const IndIcon = ind.icon;
              return (
                <div key={ind.industry} className="p-6 bg-white/4 border border-white/8 rounded-2xl">
                  <IndIcon size={20} className="text-[oklch(0.62_0.20_264)] mb-4" />
                  <h3 className="font-semibold text-white mb-4">{ind.industry}</h3>
                  <ul className="space-y-2">
                    {ind.cases.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-xs text-white/60">
                        <CheckCircle2 size={11} className="text-[oklch(0.72_0.18_162)] shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Lebow Report */}
      <section className="py-20 bg-[oklch(0.97_0.004_80)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono-data text-[oklch(0.50_0.22_264)] uppercase tracking-widest mb-4">Research</div>
              <h2 className="font-serif-display text-3xl text-[oklch(0.14_0.012_260)] mb-4">
                The 2026 State of Data Integrity & AI Readiness
              </h2>
              <p className="text-[oklch(0.50_0.010_260)] leading-relaxed mb-6">
                The annual Lebow Report surveyed 900+ data and analytics leaders. The findings are clear: the gap between perceived AI readiness and actual data quality is widening — and it's the single biggest risk to enterprise AI initiatives.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { stat: "87%", desc: "of leaders believe their organization is AI-ready" },
                  { stat: "43%", desc: "cite data quality as their biggest AI obstacle" },
                  { stat: "67%", desc: "have experienced AI failures due to data issues" },
                ].map((item) => (
                  <div key={item.stat} className="flex items-center gap-4">
                    <div className="font-serif-display text-2xl text-[oklch(0.50_0.22_264)] w-16 shrink-0">{item.stat}</div>
                    <div className="text-sm text-[oklch(0.45_0.010_260)]">{item.desc}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => window.open("https://www.precisely.com/resource-center/analystreports/2026-state-of-data-integrity-and-ai-readiness/", "_blank")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[oklch(0.14_0.010_260)] text-white text-sm font-semibold rounded-lg hover:bg-[oklch(0.20_0.010_260)] transition-colors"
              >
                Download the report
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="bg-[oklch(0.14_0.010_260)] rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-8">
                <AlertTriangle size={20} className="text-[oklch(0.78_0.18_85)] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-white mb-2">The AI Readiness Gap</div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Organizations that score themselves as "AI-ready" are 3x more likely to experience AI failures due to data quality issues than those who have formally assessed their data.
                  </p>
                </div>
              </div>

              {/* Visual gap chart */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-white/50 mb-2">
                    <span>Perceived AI readiness</span>
                    <span className="font-mono-data">87%</span>
                  </div>
                  <div className="h-3 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full w-[87%] bg-[oklch(0.62_0.20_264)] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/50 mb-2">
                    <span>Actual data quality score (avg)</span>
                    <span className="font-mono-data text-[oklch(0.68_0.20_25)]">52%</span>
                  </div>
                  <div className="h-3 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full w-[52%] bg-[oklch(0.68_0.20_25)] rounded-full" />
                  </div>
                </div>
                <div className="pt-2 text-xs text-white/30 font-mono-data text-center">
                  35-point gap = your AI risk exposure
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[oklch(0.10_0.012_260)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif-display text-4xl text-white mb-6">
            Ready to close the gap?
          </h2>
          <p className="text-white/60 max-w-lg mx-auto mb-10">
            Start with a free Agent Readiness Score. Know exactly where your data gaps are before your agents find them the hard way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sandbox" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo text-white font-semibold rounded-lg hover:bg-[oklch(0.46_0.22_264)] transition-colors">
              Score your data free
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => window.open("https://www.precisely.com/get-in-touch", "_blank")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/8 border border-white/15 text-white font-medium rounded-lg hover:bg-white/12 transition-colors"
            >
              Talk to enterprise sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
