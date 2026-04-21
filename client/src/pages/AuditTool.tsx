/**
 * AGENT PROVENANCE — Agent Compliance Auditor
 * Free interactive tool: describe your agent, get a scored compliance report
 */
import { useState } from "react";
import {
  Shield, Database, Eye, GitMerge, AlertTriangle,
  CheckCircle2, ChevronRight, Loader2, ArrowRight, Lock
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const AGENT_TYPES = [
  "LangChain", "CrewAI", "AutoGen", "Custom Python", "LlamaIndex", "Other"
];

const USE_CASES = [
  "Loan / credit approval",
  "CV / resume screening",
  "Medical triage or diagnosis",
  "Insurance underwriting",
  "Fraud detection",
  "HR performance review",
  "Customer service routing",
  "Content moderation",
  "Other",
];

type AuditResult = {
  scores: {
    eu_ai_act: number;
    data_quality: number;
    pii_exposure: number;
    audit_trail: number;
    overall: number;
  };
  risk_level: "MINIMAL" | "LIMITED" | "HIGH";
  issues: string[];
  recommendations: string[];
  sdk_snippet: string;
};

function ScoreGauge({ score, label, color }: { score: number; label: string; color: string }) {
  const getStatus = (s: number) => s >= 75 ? "Compliant" : s >= 50 ? "At risk" : "Critical";
  return (
    <div className="bg-[oklch(0.12_0.015_240)] border border-white/8 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs font-mono" style={{ color }}>{getStatus(score)}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-mono font-semibold text-white">{score}</span>
        <span className="text-white/30 text-sm mb-0.5">/100</span>
      </div>
      <div className="mt-2 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const config = {
    HIGH: { bg: "bg-orange-500/15 border-orange-500/40", text: "text-orange-400", label: "HIGH RISK" },
    LIMITED: { bg: "bg-yellow-500/15 border-yellow-500/40", text: "text-yellow-400", label: "LIMITED RISK" },
    MINIMAL: { bg: "bg-emerald-500/15 border-emerald-500/40", text: "text-emerald-400", label: "MINIMAL RISK" },
  }[level] ?? { bg: "bg-white/10 border-white/20", text: "text-white/60", label: level };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide ${config.bg} ${config.text}`}>
      <Shield size={11} />
      EU AI Act: {config.label}
    </span>
  );
}

export default function AuditTool() {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<"form" | "loading" | "result" | "gated">("form");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [form, setForm] = useState({
    agentType: "",
    useCase: "",
    dataSources: "",
    irreversibleDecisions: false,
    processesPersonalData: false,
    hasAuditTrail: false,
  });

  const auditMutation = trpc.audit.runAudit.useMutation({
    onSuccess: (data) => {
      setResult(data);
      if (isAuthenticated) {
        setStep("result");
      } else {
        setStep("gated");
      }
    },
    onError: () => setStep("form"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agentType || !form.useCase) return;
    setStep("loading");
    auditMutation.mutate(form);
  };

  const scoreColors = {
    eu_ai_act: "oklch(0.68 0.20 25)",
    data_quality: "oklch(0.65 0.18 185)",
    pii_exposure: "oklch(0.78 0.18 85)",
    audit_trail: "oklch(0.72 0.18 162)",
    overall: "oklch(0.60 0.20 290)",
  };

  return (
    <div className="bg-[oklch(0.10_0.015_240)] text-white min-h-screen pt-24 pb-20">
      <div className="max-w-[860px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/8 mb-4">
            <Shield size={12} className="text-teal-400" />
            <span className="text-xs font-medium text-teal-400">Free · No signup required · Instant results</span>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl text-white mb-3">Agent Compliance Auditor</h1>
          <p className="text-white/55 max-w-xl mx-auto">
            Describe your AI agent. Get a scored compliance report covering EU AI Act risk level,
            data quality, PII exposure, and audit trail coverage.
          </p>
        </div>

        {/* FORM */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[oklch(0.14_0.015_240)] border border-white/8 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-xs flex items-center justify-center font-mono">1</span>
                Agent framework
              </h2>
              <div className="flex flex-wrap gap-2">
                {AGENT_TYPES.map((t) => (
                  <button key={t} type="button"
                    onClick={() => setForm(f => ({ ...f, agentType: t }))}
                    className={`px-3 py-1.5 rounded text-sm border transition-colors ${
                      form.agentType === t
                        ? "bg-teal-500/15 border-teal-500/50 text-teal-400"
                        : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[oklch(0.14_0.015_240)] border border-white/8 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-xs flex items-center justify-center font-mono">2</span>
                What does your agent do?
              </h2>
              <div className="flex flex-wrap gap-2">
                {USE_CASES.map((uc) => (
                  <button key={uc} type="button"
                    onClick={() => setForm(f => ({ ...f, useCase: uc }))}
                    className={`px-3 py-1.5 rounded text-sm border transition-colors ${
                      form.useCase === uc
                        ? "bg-teal-500/15 border-teal-500/50 text-teal-400"
                        : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
                    }`}>
                    {uc}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[oklch(0.14_0.015_240)] border border-white/8 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-xs flex items-center justify-center font-mono">3</span>
                Data sources (optional)
              </h2>
              <textarea
                value={form.dataSources}
                onChange={(e) => setForm(f => ({ ...f, dataSources: e.target.value }))}
                placeholder="e.g. CRM database, credit bureau API, public web, internal knowledge base..."
                rows={2}
                className="w-full bg-[oklch(0.10_0.015_240)] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-teal-500/50 resize-none"
              />
            </div>

            <div className="bg-[oklch(0.14_0.015_240)] border border-white/8 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-xs flex items-center justify-center font-mono">4</span>
                Quick checks
              </h2>
              <div className="space-y-3">
                {([
                  ["irreversibleDecisions", "Agent makes irreversible decisions (e.g. approves/rejects, sends communications, moves funds)"],
                  ["processesPersonalData", "Agent processes personal data (names, emails, financial data, health data)"],
                  ["hasAuditTrail", "You currently have an audit trail for agent decisions"],
                ] as [keyof typeof form, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      form[key] ? "bg-teal-500 border-teal-500" : "border-white/20 group-hover:border-white/40"
                    }`}
                      onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}>
                      {form[key] && <CheckCircle2 size={10} className="text-[oklch(0.08_0.015_240)]" />}
                    </div>
                    <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit"
              disabled={!form.agentType || !form.useCase}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded-lg hover:bg-teal-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Run compliance audit <ArrowRight size={16} />
            </button>
            <p className="text-center text-xs text-white/30">Free · Instant · No signup required for basic results</p>
          </form>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="text-teal-400 animate-spin" />
            <div className="text-center">
              <p className="text-white/70 font-medium">Running compliance audit...</p>
              <p className="text-white/35 text-sm mt-1">Analysing EU AI Act risk, data quality, PII exposure, and audit trail coverage</p>
            </div>
          </div>
        )}

        {/* GATED RESULT — show scores but gate the full report */}
        {step === "gated" && result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Your Compliance Score</h2>
                <p className="text-sm text-white/50 mt-0.5">{form.agentType} · {form.useCase}</p>
              </div>
              <RiskBadge level={result.risk_level} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ScoreGauge score={result.scores.eu_ai_act} label="EU AI Act" color={scoreColors.eu_ai_act} />
              <ScoreGauge score={result.scores.data_quality} label="Data Quality" color={scoreColors.data_quality} />
              <ScoreGauge score={result.scores.pii_exposure} label="PII Exposure" color={scoreColors.pii_exposure} />
              <ScoreGauge score={result.scores.audit_trail} label="Audit Trail" color={scoreColors.audit_trail} />
              <div className="col-span-2 md:col-span-2">
                <ScoreGauge score={result.scores.overall} label="Overall Compliance Readiness" color={scoreColors.overall} />
              </div>
            </div>

            {/* Top 2 issues — free */}
            <div className="bg-[oklch(0.14_0.015_240)] border border-white/8 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-orange-400" /> Top issues
              </h3>
              <div className="space-y-2">
                {result.issues.slice(0, 2).map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-orange-400/80">
                    <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gate: sign in for full report */}
            <div className="bg-[oklch(0.14_0.015_240)] border border-teal-500/30 rounded-xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm bg-[oklch(0.10_0.015_240)]/60" />
              <div className="relative">
                <Lock size={24} className="text-teal-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Sign in to unlock your full compliance report</h3>
                <p className="text-sm text-white/55 mb-4 max-w-sm mx-auto">
                  Get all {result.issues.length} issues, {result.recommendations.length} recommendations,
                  and your pre-configured SDK install command.
                </p>
                <a href={getLoginUrl()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors">
                  Sign in free <ChevronRight size={14} />
                </a>
                <p className="text-xs text-white/30 mt-3">Free account · No credit card · Takes 30 seconds</p>
              </div>
            </div>

            <button onClick={() => setStep("form")}
              className="text-sm text-white/40 hover:text-white/70 transition-colors">
              ← Audit a different agent
            </button>
          </div>
        )}

        {/* FULL RESULT — authenticated users */}
        {step === "result" && result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Full Compliance Report</h2>
                <p className="text-sm text-white/50 mt-0.5">{form.agentType} · {form.useCase}</p>
              </div>
              <RiskBadge level={result.risk_level} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ScoreGauge score={result.scores.eu_ai_act} label="EU AI Act" color={scoreColors.eu_ai_act} />
              <ScoreGauge score={result.scores.data_quality} label="Data Quality" color={scoreColors.data_quality} />
              <ScoreGauge score={result.scores.pii_exposure} label="PII Exposure" color={scoreColors.pii_exposure} />
              <ScoreGauge score={result.scores.audit_trail} label="Audit Trail" color={scoreColors.audit_trail} />
              <div className="col-span-2">
                <ScoreGauge score={result.scores.overall} label="Overall Compliance Readiness" color={scoreColors.overall} />
              </div>
            </div>

            <div className="bg-[oklch(0.14_0.015_240)] border border-white/8 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-orange-400" /> All issues ({result.issues.length})
              </h3>
              <div className="space-y-2">
                {result.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-orange-400/80">
                    <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[oklch(0.14_0.015_240)] border border-white/8 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-teal-400" /> Recommendations ({result.recommendations.length})
              </h3>
              <div className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-teal-400/80">
                    <CheckCircle2 size={12} className="shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[oklch(0.14_0.015_240)] border border-white/8 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <Database size={14} className="text-yellow-400" /> Your SDK install command
              </h3>
              <pre className="bg-[oklch(0.08_0.015_240)] border border-white/8 rounded-lg p-4 text-xs text-teal-300 overflow-x-auto">
                {result.sdk_snippet}
              </pre>
            </div>

            <button onClick={() => setStep("form")}
              className="text-sm text-white/40 hover:text-white/70 transition-colors">
              ← Audit a different agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
