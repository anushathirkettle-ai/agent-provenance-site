import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Database,
  Shield,
  Eye,
  GitMerge,
  MapPin,
  BarChart3,
  Layers,
  Zap,
  CheckCircle2,
  Code2,
  Lock,
  Workflow,
  BookOpen,
  Cpu,
  Network,
  ChevronRight,
} from "lucide-react";

// ─── Module Data ─────────────────────────────────────────────────────────────

const modules = [
  {
    id: "data-quality",
    name: "Data Quality",
    tagline: "Validate, cleanse, standardise",
    businessOutcome: "Stop AI agents acting on bad data — before it costs you",
    agent: "Data Quality Agent",
    icon: CheckCircle2,
    color: "oklch(0.68 0.20 25)",
    colorBg: "oklch(0.68 0.20 25 / 0.12)",
    colorBorder: "oklch(0.68 0.20 25 / 0.30)",
    colorText: "oklch(0.85 0.12 25)",
    description:
      "Detect, measure, and remediate data quality issues at scale. Profile, cleanse, standardise, and monitor data quality across every source — automatically.",
    capabilities: [
      "Automated data profiling & scoring",
      "Rule-based and AI-driven cleansing",
      "Duplicate detection & resolution",
      "Standardisation across formats",
      "Continuous quality monitoring",
    ],
    apis: ["Data Quality Score API", "Cleanse API", "Profile API", "Match API"],
    useCase:
      "A retail bank reduced failed AI credit decisions by 67% after deploying Data Quality Agents to continuously validate customer records before they reached the model.",
  },
  {
    id: "data-governance",
    name: "Data Governance",
    tagline: "Catalog, lineage, policy",
    businessOutcome: "Demonstrate GDPR, CCPA, and FCA compliance without manual effort",
    agent: "Data Governance Agent",
    icon: Shield,
    color: "oklch(0.62 0.20 264)",
    colorBg: "oklch(0.62 0.20 264 / 0.12)",
    colorBorder: "oklch(0.62 0.20 264 / 0.30)",
    colorText: "oklch(0.80 0.12 264)",
    description:
      "Define, enforce, and audit data policies across your entire estate. Lineage, stewardship, and compliance — all in one governed layer.",
    capabilities: [
      "Data lineage & impact analysis",
      "Policy definition & enforcement",
      "Data stewardship workflows",
      "Regulatory compliance (GDPR, CCPA)",
      "FedRAMP authorized",
    ],
    apis: ["Lineage API", "Policy API", "Catalog API", "Audit API"],
    useCase:
      "A global insurer achieved GDPR compliance across 14 jurisdictions in 90 days using Data Governance Agents to automate policy enforcement and lineage tracking.",
  },
  {
    id: "data-observability",
    name: "Data Observability",
    tagline: "Monitor, detect, alert",
    businessOutcome: "Know when a pipeline breaks before your business does",
    agent: "Data Observability Agent",
    icon: Eye,
    color: "oklch(0.78 0.18 85)",
    colorBg: "oklch(0.78 0.18 85 / 0.12)",
    colorBorder: "oklch(0.78 0.18 85 / 0.30)",
    colorText: "oklch(0.88 0.12 85)",
    description:
      "Monitor data pipelines and detect anomalies before they reach your agents. Real-time freshness, volume, and schema drift detection.",
    capabilities: [
      "Pipeline health monitoring",
      "Anomaly & drift detection",
      "Schema change alerts",
      "Freshness & volume tracking",
      "Root cause analysis",
    ],
    apis: ["Health API", "Anomaly API", "Freshness API", "Schema API"],
    useCase:
      "An e-commerce platform caught a critical data pipeline failure 4 hours before Black Friday using Observability Agents — preventing $2.3M in misdirected ad spend.",
  },
  {
    id: "data-integration",
    name: "Data Integration",
    tagline: "Connect, transform, replicate",
    businessOutcome: "Connect any system — cloud, on-prem, or mainframe — without custom code",
    agent: "Data Integration Agent",
    icon: GitMerge,
    color: "oklch(0.72 0.18 162)",
    colorBg: "oklch(0.72 0.18 162 / 0.12)",
    colorBorder: "oklch(0.72 0.18 162 / 0.30)",
    colorText: "oklch(0.85 0.12 162)",
    description:
      "Connect, transform, and replicate data across any source or target — cloud, on-prem, or mainframe. CDC, batch, and real-time streaming.",
    capabilities: [
      "500+ pre-built connectors",
      "Change Data Capture (CDC)",
      "Real-time & batch pipelines",
      "IBM i / Mainframe support",
      "SAP process automation",
    ],
    apis: ["Connect API", "Transform API", "Replicate API", "CDC API"],
    useCase:
      "A healthcare network unified 23 disparate EHR systems into a single trusted data layer in 6 weeks — enabling AI triage agents to operate with full patient context.",
  },
  {
    id: "geo-addressing",
    name: "Geo Addressing",
    tagline: "Verify, geocode, standardise",
    businessOutcome: "Eliminate failed deliveries, wasted mail, and wrong-address risk",
    agent: "Geo Addressing Agent",
    icon: MapPin,
    color: "oklch(0.75 0.16 45)",
    colorBg: "oklch(0.75 0.16 45 / 0.12)",
    colorBorder: "oklch(0.75 0.16 45 / 0.30)",
    colorText: "oklch(0.88 0.10 45)",
    description:
      "Validate, standardise, and geocode addresses globally. 250+ countries, 99.9% accuracy, real-time or batch — the gold standard for location data.",
    capabilities: [
      "Global address validation (250+ countries)",
      "Geocoding & reverse geocoding",
      "Address standardisation",
      "Rooftop-level precision",
      "USPS CASS & SERP certified",
    ],
    apis: ["Geocode API", "Address Verify API", "Reverse Geocode API", "Autocomplete API"],
    useCase:
      "A logistics company reduced failed deliveries by 34% and cut address correction costs by $1.2M annually using Geo Addressing Agents on their order management pipeline.",
  },
  {
    id: "data-enrichment",
    name: "Data Enrichment",
    tagline: "Enrich, connect, contextualise",
    businessOutcome: "Give your agents the real-world context your CRM doesn't have",
    agent: "Data Enrichment Agent",
    icon: Layers,
    color: "oklch(0.60 0.15 300)",
    colorBg: "oklch(0.60 0.15 300 / 0.12)",
    colorBorder: "oklch(0.60 0.15 300 / 0.30)",
    colorText: "oklch(0.80 0.10 300)",
    description:
      "Add context your agents need to act intelligently. 500+ curated datasets — demographics, firmographics, property, risk, and more — appended in real time.",
    capabilities: [
      "500+ curated enrichment datasets",
      "Consumer & business demographics",
      "Property & risk data",
      "Points of interest (POI)",
      "Real-time append APIs",
    ],
    apis: ["Demographics API", "Firmographics API", "Property API", "Risk API", "POI API"],
    useCase:
      "A CMO reduced CRM staleness from 18 months to 48 hours using Data Enrichment Agents — their personalisation AI went from 34% to 71% relevance score overnight.",
  },
  {
    id: "spatial-analytics",
    name: "Spatial Analytics",
    tagline: "Visualise, discover, act",
    businessOutcome: "Find untapped revenue in your territory before a competitor does",
    agent: "Spatial Analytics Agent",
    icon: BarChart3,
    color: "oklch(0.65 0.18 200)",
    colorBg: "oklch(0.65 0.18 200 / 0.12)",
    colorBorder: "oklch(0.65 0.18 200 / 0.30)",
    colorText: "oklch(0.82 0.12 200)",
    description:
      "Unlock location intelligence at scale. Territory planning, market analysis, and spatial queries — all powered by the world's most trusted location data.",
    capabilities: [
      "Territory & zone management",
      "Market & site analysis",
      "Spatial queries & clustering",
      "Drive-time & isochrone analysis",
      "Boundary & demographic overlays",
    ],
    apis: ["Spatial Query API", "Territory API", "Isochrone API", "Boundary API"],
    useCase:
      "A national retailer optimised 2,400 store territories using Spatial Analytics Agents — identifying $180M in untapped revenue opportunity within 72 hours.",
  },
];

const fabricLayers = [
  { icon: Network, label: "Connectors", desc: "500+ pre-built source & target connectors" },
  { icon: Cpu, label: "Execution Agents", desc: "Autonomous agents that run, monitor, and self-heal" },
  { icon: BookOpen, label: "Data Catalog", desc: "Unified metadata, lineage, and discovery layer" },
  { icon: Database, label: "Data ID Ecosystem", desc: "PreciselyID — a universal data identity layer" },
  { icon: Workflow, label: "Workflow", desc: "Orchestrate multi-step agentic pipelines" },
  { icon: Lock, label: "Security", desc: "FedRAMP, SOC 2 Type II, GDPR, HIPAA" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Platform() {
  const [activeModule, setActiveModule] = useState<string>(modules[0].id);
  const selected = modules.find((m) => m.id === activeModule) || modules[0];

  return (
    <div className="min-h-screen bg-ink text-white">

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-xs font-mono-data text-white/50 uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_162)] pulse-dot" />
          Platform Architecture
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-white mb-5 leading-tight">
          The Autonomous<br />
          <span className="text-gradient">Data Platform</span>
        </h1>
        <p className="text-lg text-white/55 max-w-2xl leading-relaxed mb-8">
          Seven integrated modules. Seven AI agents. One orchestration layer. Gio™ coordinates everything — so your enterprise agents always act on data that is accurate, contextual, and trustworthy.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/sandbox" className="btn-primary inline-flex items-center gap-2">
            Try the sandbox <ArrowRight size={16} />
          </Link>
          <Link href="/developers" className="btn-ghost inline-flex items-center gap-2">
            View API reference <Code2 size={16} />
          </Link>
        </div>
      </section>

      {/* ── Module Grid + Detail Panel ── */}
      <section className="px-6 max-w-6xl mx-auto pb-24">

        {/* Gio™ orchestration banner */}
        <div className="mb-8 rounded-2xl border border-[oklch(0.62_0.20_264_/_0.30)] bg-[oklch(0.62_0.20_264_/_0.07)] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[oklch(0.62_0.20_264_/_0.20)] border border-[oklch(0.62_0.20_264_/_0.40)] flex items-center justify-center shrink-0">
            <span className="text-[oklch(0.85_0.15_264)] font-display italic text-sm">G</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white mb-0.5">Gio™ AI Assistant orchestrates all 7 modules</div>
            <div className="text-xs text-white/45">Natural language interface · Autonomous task routing · Full auditability · Choice of LLM</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono-data text-[oklch(0.72_0.18_162)] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_162)] pulse-dot" />
            Active · 7 agents connected
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* ── Left: Module Card Grid ── */}
          <div className="w-full xl:w-[45%]">
            <div className="text-xs font-mono-data text-white/35 uppercase tracking-widest mb-4">Select a module</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
              {modules.map((m) => {
                const isActive = activeModule === m.id;
                const Icon = m.icon;
                return (
                  <motion.button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full text-left rounded-xl border px-4 py-3.5 transition-all cursor-pointer"
                    style={{
                      background: isActive ? m.colorBg : "oklch(1 0 0 / 0.03)",
                      borderColor: isActive ? m.color : "oklch(1 0 0 / 0.10)",
                      boxShadow: isActive ? `0 0 20px ${m.color}22` : "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                        style={{
                          background: isActive ? m.colorBg : "oklch(1 0 0 / 0.06)",
                          border: `1px solid ${isActive ? m.colorBorder : "oklch(1 0 0 / 0.10)"}`,
                        }}
                      >
                        <Icon size={15} style={{ color: isActive ? m.color : "oklch(0.60 0 0)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-medium leading-tight"
                          style={{ color: isActive ? "oklch(0.97 0 0)" : "oklch(0.75 0 0)" }}
                        >
                          {m.name}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: isActive ? m.colorText : "oklch(0.45 0 0)" }}
                        >
                          {isActive ? (m as any).businessOutcome : m.tagline}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="text-[10px] font-mono-data px-1.5 py-0.5 rounded-md border"
                          style={{
                            color: isActive ? m.colorText : "oklch(0.45 0 0)",
                            borderColor: isActive ? m.colorBorder : "oklch(1 0 0 / 0.08)",
                            background: isActive ? m.colorBg : "transparent",
                          }}
                        >
                          AI
                        </span>
                        <ChevronRight
                          size={14}
                          style={{ color: isActive ? m.color : "oklch(0.35 0 0)" }}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── Right: Module Detail Panel ── */}
          <div className="w-full xl:w-[55%] xl:sticky xl:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22 }}
                className="rounded-2xl border p-6 md:p-8"
                style={{
                  background: `linear-gradient(135deg, ${selected.colorBg}, oklch(0.12 0.010 260))`,
                  borderColor: selected.colorBorder,
                }}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: selected.colorBg, border: `1.5px solid ${selected.colorBorder}` }}
                  >
                    <selected.icon size={22} style={{ color: selected.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display text-white mb-1">{selected.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-mono-data" style={{ color: selected.colorText }}>
                      <Cpu size={10} />
                      {selected.agent}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-white/65 leading-relaxed mb-6">{selected.description}</p>

                {/* Capabilities */}
                <div className="mb-6">
                  <div className="text-xs font-mono-data text-white/35 uppercase tracking-widest mb-3">Capabilities</div>
                  <ul className="space-y-2.5">
                    {selected.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm text-white/70">
                        <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: selected.color }} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* APIs */}
                <div className="mb-6">
                  <div className="text-xs font-mono-data text-white/35 uppercase tracking-widest mb-3">APIs</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.apis.map((api) => (
                      <span
                        key={api}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono-data border"
                        style={{
                          background: selected.colorBg,
                          borderColor: selected.colorBorder,
                          color: selected.colorText,
                        }}
                      >
                        {api}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Use case */}
                <div className="rounded-xl p-4 bg-black/25 border border-white/8">
                  <div className="text-xs font-mono-data text-white/35 uppercase tracking-widest mb-2">Customer outcome</div>
                  <p className="text-sm text-white/65 leading-relaxed italic">"{selected.useCase}"</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── AI & Agentic Fabric ── */}
      <section className="px-6 py-20 border-t border-white/6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-mono-data text-white/35 uppercase tracking-widest mb-3">Foundation Layer</div>
            <h2 className="font-display text-4xl text-white mb-4">AI and Agentic Fabric</h2>
            <p className="text-white/50 max-w-xl mx-auto text-base">
              The infrastructure that powers every module and every agent — connectors, execution, catalog, identity, workflow, and security, all unified.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fabricLayers.map((layer) => (
              <div key={layer.label} className="rounded-xl border border-white/8 bg-white/2 p-5 hover:bg-white/4 transition-colors">
                <layer.icon size={20} className="text-[oklch(0.62_0.20_264)] mb-3" />
                <div className="text-sm font-medium text-white mb-1">{layer.label}</div>
                <div className="text-xs text-white/40 leading-relaxed">{layer.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gio™ Orchestration ── */}
      <section className="px-6 py-20 border-t border-white/6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono-data text-white/35 uppercase tracking-widest mb-4">Orchestration Layer</div>
              <h2 className="font-display text-4xl text-white mb-5">
                Gio™ AI Assistant<br />
                <span className="text-gradient">coordinates everything</span>
              </h2>
              <p className="text-white/55 text-base leading-relaxed mb-6">
                Gio™ sits at the centre of the Data Integrity Suite — orchestrating all 7 modules, routing data quality tasks to the right agent, and surfacing insights in natural language. Ask Gio™ why your data score dropped. Ask it to fix your address data. Ask it what's blocking your AI initiative.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Natural language interface to all 7 modules",
                  "Autonomous task routing to the right agent",
                  "Proactive anomaly alerts and remediation",
                  "Audit trail for every agent action",
                  "Accessible via API, UI, or embedded SDK",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/65">
                    <Zap size={14} className="text-[oklch(0.62_0.20_264)] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/" className="btn-ghost inline-flex items-center gap-2 text-sm">
                Try Gio™ on the home page <ArrowRight size={14} />
              </Link>
            </div>

            {/* Gio visual */}
            <div className="rounded-2xl border border-white/8 bg-[oklch(0.12_0.010_260)] p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/8">
                <div className="w-8 h-8 rounded-full bg-[oklch(0.62_0.20_264)] flex items-center justify-center text-white text-xs font-bold">G</div>
                <div>
                  <div className="text-sm font-medium text-white">Gio™ AI Assistant</div>
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_162)] pulse-dot" />
                    Orchestrating 7 agents
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { role: "user", text: "Why did my agent readiness score drop overnight?" },
                  { role: "gio", text: "I detected a schema drift in your customer_address table at 02:14 UTC. 340K records now have null postal codes — likely a pipeline change. The Data Quality Agent has flagged 3 remediation options. Want me to apply the safest one automatically?" },
                  { role: "user", text: "Yes, apply it and send me a report." },
                  { role: "gio", text: "Done. 338,412 records remediated. Readiness score restored to 91%. Audit log saved. Report sent to your email." },
                ].map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "gio" && (
                      <div className="w-6 h-6 rounded-full bg-[oklch(0.62_0.20_264)] flex items-center justify-center text-white text-xs shrink-0 font-bold mt-0.5">G</div>
                    )}
                    <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[oklch(0.62_0.20_264)] text-white rounded-tr-sm"
                        : "bg-[oklch(0.18_0.010_260)] text-white/75 rounded-tl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-xs shrink-0 mt-0.5">U</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 border-t border-white/6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl text-white mb-4">Ready to see it on your data?</h2>
          <p className="text-white/50 text-base mb-8">Upload a sample dataset and get your Agent Readiness Score in 60 seconds. No sales call. No credit card.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/sandbox" className="btn-primary inline-flex items-center gap-2">
              Start free <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="btn-ghost inline-flex items-center gap-2">
              View pricing <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
