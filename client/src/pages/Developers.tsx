/**
 * AGENT PROVENANCE — Developers Page
 * SDK documentation, LangChain integration, code examples, GitHub CTA
 * Design: Dark terminal aesthetic, teal accent
 */
import { useState } from "react";
import { CheckCircle2, Copy, Terminal, Package, Zap, Shield, Database, GitMerge, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const copy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  };
  return (
    <div className="relative group rounded-lg bg-[oklch(0.06_0.01_240)] border border-white/8 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/8">
        <span className="text-xs font-mono text-white/40">{language}</span>
        <button onClick={copy} className="text-white/40 hover:text-white/80 transition-colors p-1">
          <Copy size={13} />
        </button>
      </div>
      <pre className="px-4 py-4 text-sm font-mono text-white/85 overflow-x-auto leading-relaxed whitespace-pre">{code}</pre>
    </div>
  );
}

const INSTALL_CODE = `pip install agent-provenance`;

const QUICKSTART_CODE = `from agent_provenance import ProvenanceTracer, DataAssetRef

tracer = ProvenanceTracer(api_key="your-api-key")

# Wrap your agent decision
with tracer.trace("loan-approval-agent") as decision:
    decision.add_data_asset(DataAssetRef(
        asset_id="credit-bureau-api",
        source_uri="https://api.creditbureau.com/v2",
        quality_score=0.91,
        record_count=1,
        pii_detected=True,
        eu_ai_act_category="high_risk"
    ))
    
    result = your_agent.run(applicant_data)
    decision.set_output(result, model_name="gpt-4o")

# decision.record is now a compliance-ready audit trail`;

const LANGCHAIN_CODE = `from agent_provenance.integrations.langchain import ProvenanceCallbackHandler
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain

tracer = ProvenanceTracer(api_key="your-api-key")
handler = ProvenanceCallbackHandler(tracer=tracer)

llm = ChatOpenAI(callbacks=[handler])
chain = LLMChain(llm=llm, prompt=your_prompt)

# Every chain.run() call now generates a provenance record
result = chain.run(input_data)`;

const MULTIAGENT_CODE = `# Track multi-agent chains with parent_decision_id
with tracer.trace("orchestrator-agent") as parent:
    parent.add_data_asset(DataAssetRef(
        asset_id="customer-db",
        quality_score=0.88
    ))
    
    # Child agent inherits lineage
    with tracer.trace("cv-screening-agent", 
                      parent_decision_id=parent.record.decision_id) as child:
        child.add_data_asset(DataAssetRef(
            asset_id="cv-parser-api",
            source_agent_id=parent.record.decision_id,  # data came from parent
            quality_score=0.74
        ))
        child.set_output(screening_result)`;

const REPORT_CODE = `# Export compliance report (PDF or JSON)
from agent_provenance import ComplianceReporter

reporter = ComplianceReporter(api_key="your-api-key")

# Get all decisions for a session
report = reporter.generate(
    session_id="session-abc123",
    format="pdf",  # or "json"
    regulation="eu_ai_act"  # or "gdpr", "ccpa"
)

# report.url — downloadable PDF
# report.risk_level — HIGH / LIMITED / MINIMAL
# report.issues — list of compliance gaps`;

const sections = [
  {
    id: "install",
    label: "Install",
    icon: Package,
  },
  {
    id: "quickstart",
    label: "Quickstart",
    icon: Zap,
  },
  {
    id: "langchain",
    label: "LangChain",
    icon: GitMerge,
  },
  {
    id: "multiagent",
    label: "Multi-agent",
    icon: Database,
  },
  {
    id: "reports",
    label: "Reports",
    icon: Shield,
  },
];

export default function Developers() {
  const [activeSection, setActiveSection] = useState("install");

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.015_240)] text-white">
      {/* Header */}
      <div className="pt-28 pb-12 px-6 max-w-[1100px] mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={16} className="text-teal-400" />
          <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">Documentation</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Developer Reference</h1>
        <p className="text-lg text-white/60 max-w-2xl">
          Agent Provenance is open source. The SDK is MIT-licensed. Instrument your agent in 2 lines of code — no infrastructure required.
        </p>
        <div className="flex items-center gap-4 mt-6">
          <a
            href="https://github.com/anushathirkettle-ai/agent-provenance"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/8 hover:bg-white/12 text-white text-sm font-medium rounded border border-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
            View on GitHub
            <ExternalLink size={12} className="text-white/40" />
          </a>
          <span className="text-xs font-mono text-white/30 bg-white/5 px-3 py-1.5 rounded border border-white/8">v0.2.0</span>
          <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded border border-teal-500/20">MIT License</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6 pb-24 flex gap-10">
        {/* Sidebar */}
        <nav className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-24 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded transition-colors text-left ${
                  activeSection === s.id
                    ? "bg-teal-500/15 text-teal-300 border border-teal-500/20"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <s.icon size={14} />
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-12">

          {/* Install */}
          <section id="install">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <Package size={18} className="text-teal-400" /> Installation
            </h2>
            <p className="text-white/55 mb-4 text-sm">Requires Python 3.9+. No external infrastructure needed for local use.</p>
            <CodeBlock code={INSTALL_CODE} language="bash" />
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Python 3.9+", ok: true },
                { label: "LangChain optional", ok: true },
                { label: "No infra required", ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-white/50">
                  <CheckCircle2 size={12} className="text-teal-400 shrink-0" />
                  {item.label}
                </div>
              ))}
            </div>
          </section>

          {/* Quickstart */}
          <section id="quickstart">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <Zap size={18} className="text-teal-400" /> Quickstart
            </h2>
            <p className="text-white/55 mb-4 text-sm">
              Wrap any agent decision in a <code className="text-teal-300 bg-teal-500/10 px-1 rounded">tracer.trace()</code> context manager. The SDK records data assets, model metadata, PII flags, and EU AI Act risk level automatically.
            </p>
            <CodeBlock code={QUICKSTART_CODE} language="python" />
          </section>

          {/* LangChain */}
          <section id="langchain">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <GitMerge size={18} className="text-teal-400" /> LangChain Integration
            </h2>
            <p className="text-white/55 mb-4 text-sm">
              Drop in <code className="text-teal-300 bg-teal-500/10 px-1 rounded">ProvenanceCallbackHandler</code> as a LangChain callback. Every chain run, tool call, and LLM invocation is automatically traced.
            </p>
            <CodeBlock code={LANGCHAIN_CODE} language="python" />
            <div className="mt-4 p-4 rounded-lg bg-teal-500/8 border border-teal-500/20">
              <p className="text-xs text-teal-300 font-medium mb-1">Concurrent run support</p>
              <p className="text-xs text-white/50">The callback handler is thread-safe and handles concurrent LangChain runs correctly using run_id isolation.</p>
            </div>
          </section>

          {/* Multi-agent */}
          <section id="multiagent">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <Database size={18} className="text-teal-400" /> Multi-Agent Chains
            </h2>
            <p className="text-white/55 mb-4 text-sm">
              Link decisions across agents using <code className="text-teal-300 bg-teal-500/10 px-1 rounded">parent_decision_id</code> and <code className="text-teal-300 bg-teal-500/10 px-1 rounded">source_agent_id</code>. The SDK builds a DAG — a complete lineage graph from data source to final decision.
            </p>
            <CodeBlock code={MULTIAGENT_CODE} language="python" />
          </section>

          {/* Reports */}
          <section id="reports">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <Shield size={18} className="text-teal-400" /> Compliance Reports
            </h2>
            <p className="text-white/55 mb-4 text-sm">
              Generate lawyer-readable compliance reports in PDF or JSON. Reports include EU AI Act risk classification, data quality evidence, PII handling summary, and a full decision audit trail.
            </p>
            <CodeBlock code={REPORT_CODE} language="python" />
            <div className="mt-6 p-5 rounded-lg bg-white/4 border border-white/8">
              <p className="text-sm font-medium text-white mb-3">Report API available on Pro and Enterprise plans</p>
              <a href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors">
                View pricing <ArrowRight size={14} />
              </a>
            </div>
          </section>

          {/* Data model reference */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Data Model Reference</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-white/40 font-medium">Field</th>
                    <th className="text-left py-2 pr-4 text-white/40 font-medium">Type</th>
                    <th className="text-left py-2 text-white/40 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["decision_id", "str", "Unique UUID for this decision record"],
                    ["session_id", "str", "Groups related decisions in a session"],
                    ["parent_decision_id", "str?", "Links to parent decision in multi-agent chain"],
                    ["agent_name", "str", "Name of the agent that made this decision"],
                    ["model_name", "str", "LLM model used (e.g. gpt-4o, claude-3-5-sonnet)"],
                    ["data_assets", "list[DataAssetRef]", "Data sources used in this decision"],
                    ["tool_calls", "list[ToolCallRecord]", "External actions taken (API calls, file writes)"],
                    ["pii_detected", "bool", "Whether PII was found in inputs or outputs"],
                    ["eu_ai_act_risk", "str", "HIGH / LIMITED / MINIMAL"],
                    ["data_quality_risk", "str", "HIGH / MEDIUM / LOW (computed from asset scores)"],
                    ["timestamp_utc", "datetime", "UTC timestamp of the decision"],
                  ].map(([field, type, desc]) => (
                    <tr key={field as string}>
                      <td className="py-2.5 pr-4 font-mono text-teal-300 text-xs">{field}</td>
                      <td className="py-2.5 pr-4 font-mono text-white/40 text-xs">{type}</td>
                      <td className="py-2.5 text-white/55 text-xs">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
