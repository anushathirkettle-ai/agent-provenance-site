/**
 * AGENT PROVENANCE — Precisely Integration Case Study
 * Shows how Agent Provenance + Precisely MCP Server = complete agentic governance.
 * The "Agentic-Ready Data" + "Audit-Ready Decisions" narrative.
 */
import { useState } from "react";
import { ArrowRight, CheckCircle2, Database, Shield, FileText, Zap, Globe, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";

const CODE_PRECISELY_MCP = `import os
from langchain_mcp import MCPClient
import agentprovenance
from agentprovenance import trace

# Step 1: Connect to Precisely MCP Server
# Precisely provides agentic-ready data via their hosted MCP Server
precisely_mcp = MCPClient(
    server_url="https://mcp.precisely.com/v1",
    api_key=os.environ["PRECISELY_API_KEY"]
)

# Step 2: Initialise Agent Provenance (once at startup)
agentprovenance.init(api_key=os.environ["AGENTPROVENANCE_API_KEY"])

# Step 3: Your agent — fully traced, fully governed
@trace(
    agent_id="credit-risk-agent-v2",
    agent_version="2.1.0",
    use_case="Credit risk assessment",
    subject_id_arg="customer_id",
    subject_type="customer",
    data_sources=["precisely-mcp/financial-profile", "precisely-mcp/address-verify"],
    model_name="gpt-4o",
    risk_classification="HIGH",  # EU AI Act classification
)
def assess_credit_risk(customer_id: str) -> dict:
    # Precisely MCP provides verified, enriched customer data
    customer_data = precisely_mcp.call(
        tool="data_enrichment",
        params={"entity_id": customer_id, "dataset": "financial_profile"}
    )

    # Your agent logic runs here — completely unchanged
    risk_score = run_risk_model(customer_data)

    return {
        "customer_id": customer_id,
        "risk_score": risk_score,
        "recommendation": "APPROVE" if risk_score < 0.4 else "REVIEW",
    }

# Every call to assess_credit_risk() is now:
# ✓ Traced end-to-end with full context
# ✓ Data sources recorded (Precisely MCP)
# ✓ Decision stored with cryptographic input hash
# ✓ EU AI Act Article 12 compliant`;

const CODE_AUDIT_QUERY = `# When a regulator asks: "Show me what your agent decided on customer X"
# You have the answer in seconds.

# Option A: Dashboard — navigate to agentprovenance.io/decisions
# Filter by agent ID, subject ID, date range, or risk level.
# Click any row to see the full trace. Click the PDF icon to export.

# Option B: REST API — query programmatically
import requests

API_KEY = "ap_live_..."
BASE    = "https://agentprovenance.io"

# Retrieve a specific decision trace
resp = requests.get(
    f"{BASE}/api/v1/decisions/ap_7f3a9b2c",
    headers={"Authorization": f"Bearer {API_KEY}"}
)
decision = resp.json()

print(f"Agent:        {decision['agentId']} v{decision['agentVersion']}")
print(f"Decision:     {decision['outputSummary']}")
print(f"Data sources: {decision['dataSources']}")
print(f"Risk:         {decision['riskClassification']}")
print(f"Timestamp:    {decision['decidedAt']}")

# Output:
# Agent:        credit-risk-agent-v2 v2.1.0
# Decision:     APPROVE — risk score 0.31, below threshold 0.40
# Data sources: ['precisely-mcp/financial-profile', 'precisely-mcp/address-verify']
# Risk:         HIGH
# Timestamp:    1746518062000

# Option C: One-click PDF report
# Navigate to /report/decision/<decisionId> in the dashboard
# Click "Print / Save as PDF" — done.`;

const steps = [
  {
    number: "01",
    title: "Precisely MCP Server provides agentic-ready data",
    description: "Your AI agent calls Precisely's hosted MCP Server to access verified, enriched, governed data — addresses, financial profiles, entity resolution, data quality scores. The data going in is clean.",
    icon: Database,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    number: "02",
    title: "Agent Provenance SDK traces every decision",
    description: "A single @trace decorator on your agent function captures the full decision context — what data was used, what the agent decided, which model ran, how confident it was, and when it happened.",
    icon: Zap,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
  },
  {
    number: "03",
    title: "Every decision is stored and queryable",
    description: "Decision traces are stored with cryptographic input hashing. Any decision can be retrieved in milliseconds — by decision ID, agent ID, subject ID, date range, or risk level.",
    icon: Shield,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    number: "04",
    title: "One-click compliance reports",
    description: "When a regulator asks 'show me what your agent decided on customer X on March 14th', you generate a PDF report in seconds. Decision ID, data sources, model identity, confidence score, timestamp — all there.",
    icon: FileText,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

const outcomes = [
  { metric: "< 60s", label: "Time to answer any regulator query" },
  { metric: "100%", label: "Decision traceability across your fleet" },
  { metric: "Article 12", label: "EU AI Act record-keeping compliance" },
  { metric: "Zero", label: "Custom integration code required" },
];

const faqs = [
  {
    q: "Does Agent Provenance store the raw data from Precisely?",
    a: "No. Agent Provenance stores a SHA-256 hash of the input data and a human-readable summary. The actual data stays in Precisely's systems. This is intentional — it keeps your data governance clean and avoids duplicating sensitive customer data.",
  },
  {
    q: "Does this work with Precisely's existing APIs, not just the MCP Server?",
    a: "Yes. The Agent Provenance @trace decorator works with any agent that calls any data source — Precisely MCP Server, Precisely REST APIs, or any other data provider. The MCP Server integration is the recommended path for new deployments because it provides richer data lineage metadata.",
  },
  {
    q: "What EU AI Act articles does this address?",
    a: "Together, Precisely + Agent Provenance addresses Article 9 (Risk management systems), Article 12 (Record-keeping — automatic logging of events), Article 13 (Transparency — information to deployers), and Article 14 (Human oversight — providing the data needed for human review of high-risk decisions).",
  },
  {
    q: "Can this be used without Precisely?",
    a: "Absolutely. Agent Provenance works with any agent and any data source — LangChain, CrewAI, AutoGen, custom agents, OpenAI Assistants. The Precisely integration is a specific pattern that provides the strongest end-to-end governance story, but it's not a requirement.",
  },
  {
    q: "Is this available as an enterprise integration?",
    a: "We're working with a small number of design partners to build out the enterprise integration. If you're a Precisely customer interested in piloting this, get in touch via the waitlist.",
  },
];

export default function PreciselyIntegration() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.015_240)] text-white">

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Integration Case Study</span>
          <span className="text-white/15">·</span>
          <span className="text-xs font-mono text-teal-400">Precisely × Agent Provenance</span>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
          Agentic-Ready Data.<br />
          <span className="text-teal-400">Audit-Ready Decisions.</span>
        </h1>

        <p className="text-lg text-white/60 max-w-2xl leading-relaxed mb-8">
          Precisely's MCP Server ensures the data going into your AI agents is clean, verified, and governed.
          Agent Provenance ensures every decision your agents make is traceable, explainable, and compliant.
          Together, they close the loop on enterprise AI accountability.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/audit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors text-sm">
            Try the free audit tool <ArrowRight size={15} />
          </Link>
          <Link href="/developers" className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/15 text-white/70 rounded hover:border-white/30 hover:text-white transition-colors text-sm">
            View SDK docs
          </Link>
        </div>
      </section>

      {/* The problem */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-white/6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">The problem</div>
            <h2 className="font-serif text-2xl text-white mb-4">Half the story isn't enough</h2>
            <p className="text-white/55 leading-relaxed mb-4">
              Precisely solves the data quality problem: your agents get clean, enriched, verified data.
              But when a regulator asks <em className="text-white/80">"what did your agent decide on customer X, and why?"</em> — the data quality story doesn't answer that question.
            </p>
            <p className="text-white/55 leading-relaxed">
              And when Agent Provenance records a decision without knowing where the data came from, the audit trail is incomplete. You need both sides of the story.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { label: "Data quality", precisely: true, ap: false, desc: "Precisely ✓" },
              { label: "Data lineage", precisely: true, ap: false, desc: "Precisely ✓" },
              { label: "Decision traceability", precisely: false, ap: true, desc: "Agent Provenance ✓" },
              { label: "Model identity recording", precisely: false, ap: true, desc: "Agent Provenance ✓" },
              { label: "EU AI Act Article 12 compliance", precisely: false, ap: true, desc: "Agent Provenance ✓" },
              { label: "End-to-end audit trail", precisely: false, ap: false, desc: "Both required ✓", both: true },
            ].map((row) => (
              <div key={row.label} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${row.both ? "border-teal-500/30 bg-teal-500/8" : "border-white/8 bg-white/3"}`}>
                <span className="text-sm text-white/70">{row.label}</span>
                <span className={`text-xs font-mono ${row.both ? "text-teal-400" : row.precisely ? "text-indigo-400" : "text-violet-400"}`}>
                  {row.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-white/6">
        <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">How it works</div>
        <h2 className="font-serif text-2xl text-white mb-10">Four steps to complete agentic governance</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div key={step.number} className={`p-6 rounded-xl border ${step.border} ${step.bg}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${step.bg} border ${step.border}`}>
                  <step.icon size={18} className={step.color} />
                </div>
                <div>
                  <div className={`text-xs font-mono ${step.color} mb-1`}>{step.number}</div>
                  <h3 className="font-semibold text-white text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code example */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-white/6">
        <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Code example</div>
        <h2 className="font-serif text-2xl text-white mb-2">Credit risk agent with full governance</h2>
        <p className="text-white/50 text-sm mb-8">A real-world pattern: Precisely MCP Server provides verified financial data, Agent Provenance records every decision.</p>

        <div className="rounded-xl border border-white/10 overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/8">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs font-mono text-white/30">credit_risk_agent.py</span>
          </div>
          <pre className="p-5 text-xs font-mono text-teal-300/90 bg-[oklch(0.08_0.015_240)] overflow-x-auto leading-relaxed">
            {CODE_PRECISELY_MCP}
          </pre>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/8">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs font-mono text-white/30">audit_query.py</span>
          </div>
          <pre className="p-5 text-xs font-mono text-teal-300/90 bg-[oklch(0.08_0.015_240)] overflow-x-auto leading-relaxed">
            {CODE_AUDIT_QUERY}
          </pre>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-white/6">
        <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-10 text-center">What this delivers</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {outcomes.map((o) => (
            <div key={o.metric} className="text-center p-6 rounded-xl border border-white/8 bg-white/3">
              <div className="font-serif text-3xl text-teal-400 mb-2">{o.metric}</div>
              <div className="text-xs text-white/50 leading-relaxed">{o.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The strategic narrative */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-white/6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">The governance stack</div>
            <h2 className="font-serif text-2xl text-white mb-4">Two products. One complete story.</h2>
            <p className="text-white/55 leading-relaxed mb-4">
              Precisely's vision of "Agentic-Ready Data" addresses the input side of enterprise AI: making sure the data your agents work from is accurate, consistent, and governed.
            </p>
            <p className="text-white/55 leading-relaxed mb-4">
              Agent Provenance addresses the output side: making sure every decision your agents make is traceable, explainable, and defensible to regulators, auditors, and boards.
            </p>
            <p className="text-white/55 leading-relaxed">
              Together they represent the complete governance layer that enterprise AI deployments require — especially under the EU AI Act, which comes into full force in August 2026.
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-indigo-500/25 bg-indigo-500/8">
              <div className="flex items-center gap-3 mb-3">
                <Database size={16} className="text-indigo-400" />
                <span className="text-sm font-semibold text-white">Precisely</span>
                <span className="text-xs font-mono text-indigo-400 ml-auto">Input layer</span>
              </div>
              <ul className="space-y-1.5">
                {["Agentic-Ready Data", "MCP Server for agent data access", "Data Integration Agent", "Data Quality APIs", "Entity resolution & enrichment"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/55">
                    <CheckCircle2 size={11} className="text-indigo-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-teal-500/25 bg-teal-500/8">
              <div className="flex items-center gap-3 mb-3">
                <Shield size={16} className="text-teal-400" />
                <span className="text-sm font-semibold text-white">Agent Provenance</span>
                <span className="text-xs font-mono text-teal-400 ml-auto">Output layer</span>
              </div>
              <ul className="space-y-1.5">
                {["Decision traceability SDK", "Fleet-wide compliance dashboard", "EU AI Act audit reports", "Risk classification & scoring", "One-click PDF compliance reports"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/55">
                    <CheckCircle2 size={11} className="text-teal-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-white/15 bg-white/5 text-center">
              <div className="text-xs font-mono text-white/40 mb-1">Together</div>
              <div className="text-sm font-semibold text-white">Complete agentic governance</div>
              <div className="text-xs text-white/40 mt-1">Data in → Agent decides → Decision recorded → Audit trail complete</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto border-t border-white/6">
        <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-8">Questions</div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/8 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm text-white/80 font-medium pr-4">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={15} className="text-white/30 shrink-0" /> : <ChevronDown size={15} className="text-white/30 shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed border-t border-white/6 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 max-w-3xl mx-auto border-t border-white/6 text-center">
        <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">Get started</div>
        <h2 className="font-serif text-2xl text-white mb-4">Ready to close the governance loop?</h2>
        <p className="text-white/50 text-sm mb-8 max-w-xl mx-auto">
          Run a free audit of your agent fleet, or get early access to the SDK and start recording decisions today.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/audit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors text-sm">
            Free fleet audit <ArrowRight size={15} />
          </Link>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/15 text-white/70 rounded hover:border-white/30 hover:text-white transition-colors text-sm">
            View pricing
          </Link>
        </div>
      </section>

    </div>
  );
}
