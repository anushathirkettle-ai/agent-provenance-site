/**
 * AGENT PROVENANCE — Decision Log
 * Fleet-wide decision trace viewer with filters, pagination, and per-decision detail.
 * Accessible to any authenticated user (shows only their own decisions).
 * Admins see all decisions across all users.
 */
import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  Shield, Loader2, AlertTriangle, Search, Filter,
  ChevronLeft, ChevronRight, ExternalLink, Clock,
  Database, Cpu, User, Activity, Download, X,
  FileText
} from "lucide-react";
import { useLocation } from "wouter";

type RiskLevel = "HIGH" | "LIMITED" | "MINIMAL" | "UNCLASSIFIED";

const RISK_STYLES: Record<RiskLevel, string> = {
  HIGH: "bg-red-500/15 text-red-400 border-red-500/25",
  LIMITED: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  MINIMAL: "bg-teal-500/15 text-teal-400 border-teal-500/25",
  UNCLASSIFIED: "bg-white/8 text-white/40 border-white/10",
};

function RiskBadge({ level }: { level: string | null }) {
  const l = (level ?? "UNCLASSIFIED") as RiskLevel;
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-mono ${RISK_STYLES[l] ?? RISK_STYLES.UNCLASSIFIED}`}>
      {l}
    </span>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="bg-[oklch(0.13_0.015_240)] border border-white/10 rounded-xl p-5">
      <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-2">{label}</div>
      <div className={`text-3xl font-semibold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </div>
  );
}

function DecisionDetailModal({ decisionId, onClose }: { decisionId: string; onClose: () => void }) {
  const { data, isLoading } = trpc.decisions.get.useQuery({ decisionId });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-[oklch(0.12_0.015_240)] border border-white/12 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/8">
          <div>
            <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Decision trace</div>
            <h2 className="font-mono text-sm text-teal-400 break-all">{decisionId}</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-teal-400" />
          </div>
        )}

        {data && (
          <div className="p-6 space-y-5">
            {/* Core identity */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Agent ID" value={data.agentId} mono />
              <Field label="Agent version" value={data.agentVersion ?? "—"} mono />
              <Field label="Use case" value={data.useCase} />
              <Field label="Risk classification" value={<RiskBadge level={data.riskClassification as string | null} />} />
              <Field label="Subject ID" value={data.subjectId ?? "—"} mono />
              <Field label="Subject type" value={data.subjectType ?? "—"} />
            </div>

            {/* Decision */}
            <div className="bg-[oklch(0.10_0.015_240)] rounded-xl p-4">
              <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Decision output</div>
              <p className="text-white/85 text-sm leading-relaxed">{data.outputSummary}</p>
            </div>

            {/* Input */}
            {data.inputSummary && (
              <div className="bg-[oklch(0.10_0.015_240)] rounded-xl p-4">
                <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Input summary</div>
                <p className="text-white/65 text-sm leading-relaxed">{data.inputSummary}</p>
                {data.inputHash && (
                  <p className="text-xs font-mono text-white/25 mt-2">sha256: {data.inputHash}</p>
                )}
              </div>
            )}

            {/* Data sources */}
            {data.dataSources && Array.isArray(data.dataSources) && data.dataSources.length > 0 && (
              <div>
                <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Data sources</div>
                <div className="flex flex-wrap gap-2">
                  {(data.dataSources as string[]).map((src, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Model + performance */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Model" value={data.modelName ?? "—"} mono />
              <Field label="Model version" value={data.modelVersion ?? "—"} mono />
              <Field label="Latency" value={data.latencyMs != null ? `${data.latencyMs}ms` : "—"} />
              <Field label="Confidence" value={data.confidenceScore != null ? `${data.confidenceScore}%` : "—"} />
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Decision timestamp" value={new Date(data.decidedAt).toLocaleString()} />
              <Field label="Recorded at" value={new Date(data.createdAt).toLocaleString()} />
            </div>

            {/* Output data */}
            {data.outputData && (
              <div>
                <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Structured output</div>
                <pre className="bg-[oklch(0.09_0.015_240)] rounded-lg p-4 text-xs text-teal-300 overflow-x-auto font-mono">
                  {JSON.stringify(data.outputData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-sm text-white/75 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

const PAGE_SIZE = 50;

export default function DecisionLog() {
  const { user, loading } = useAuth();
  const [agentId, setAgentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "">("");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queryInput = useMemo(() => ({
    agentId: agentId.trim() || undefined,
    subjectId: subjectId.trim() || undefined,
    riskClassification: (riskFilter || undefined) as RiskLevel | undefined,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  }), [agentId, subjectId, riskFilter, page]);

  const { data: decisions, isLoading } = trpc.decisions.list.useQuery(queryInput, {
    enabled: !!user,
  });
  const { data: stats } = trpc.decisions.stats.useQuery(undefined, { enabled: !!user });

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.015_240)] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-teal-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.015_240)] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <Shield size={36} className="text-teal-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-white mb-3">Sign in to view your decision log</h2>
          <p className="text-white/50 mb-6 text-sm leading-relaxed">
            Your agent decision traces are stored securely and accessible only to you.
          </p>
          <a
            href={getLoginUrl("/decisions")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors text-sm"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  const hasFilters = agentId || subjectId || riskFilter;

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.015_240)]">
      {/* Header */}
      <div className="border-b border-white/8 bg-[oklch(0.12_0.015_240)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Fleet</div>
            <h1 className="font-serif text-xl text-white">Decision Log</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/decisions/api-keys" className="text-xs text-white/40 hover:text-white/70 transition-colors font-mono">
              API Keys →
            </Link>
            <Link href="/report/fleet" className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-teal-500/15 text-teal-400 border border-teal-500/25 rounded hover:bg-teal-500/25 transition-colors font-mono">
              <FileText size={12} /> Fleet report
            </Link>
            <Link href="/admin" className="text-xs text-white/40 hover:text-white/70 transition-colors font-mono">
              Admin →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total decisions" value={stats?.total ?? 0} color="text-white" />
          <StatCard label="High-risk decisions" value={stats?.highRisk ?? 0} sub="EU AI Act HIGH" color="text-red-400" />
          <StatCard label="Active agents" value={stats?.agents ?? 0} color="text-teal-400" />
          <StatCard label="Showing" value={decisions?.length ?? 0} sub={`of ${stats?.total ?? 0} total`} color="text-indigo-400" />
        </div>

        {/* Filters */}
        <div className="bg-[oklch(0.12_0.015_240)] border border-white/8 rounded-xl p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-white/40">
              <Filter size={14} />
              <span className="text-xs font-mono uppercase tracking-widest">Filter</span>
            </div>

            {/* Agent ID filter */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Agent ID..."
                value={agentId}
                onChange={e => { setAgentId(e.target.value); setPage(0); }}
                className="pl-8 pr-3 py-1.5 bg-[oklch(0.10_0.015_240)] border border-white/10 rounded text-sm text-white/80 placeholder:text-white/25 font-mono focus:outline-none focus:border-teal-500/50 w-48"
              />
            </div>

            {/* Subject ID filter */}
            <div className="relative">
              <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Subject ID..."
                value={subjectId}
                onChange={e => { setSubjectId(e.target.value); setPage(0); }}
                className="pl-8 pr-3 py-1.5 bg-[oklch(0.10_0.015_240)] border border-white/10 rounded text-sm text-white/80 placeholder:text-white/25 font-mono focus:outline-none focus:border-teal-500/50 w-44"
              />
            </div>

            {/* Risk filter */}
            <select
              value={riskFilter}
              onChange={e => { setRiskFilter(e.target.value as RiskLevel | ""); setPage(0); }}
              className="px-3 py-1.5 bg-[oklch(0.10_0.015_240)] border border-white/10 rounded text-sm text-white/80 font-mono focus:outline-none focus:border-teal-500/50"
            >
              <option value="">All risk levels</option>
              <option value="HIGH">HIGH</option>
              <option value="LIMITED">LIMITED</option>
              <option value="MINIMAL">MINIMAL</option>
              <option value="UNCLASSIFIED">UNCLASSIFIED</option>
            </select>

            {hasFilters && (
              <button
                onClick={() => { setAgentId(""); setSubjectId(""); setRiskFilter(""); setPage(0); }}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors font-mono"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[oklch(0.12_0.015_240)] border border-white/8 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-teal-400" />
            </div>
          ) : !decisions?.length ? (
            <div className="text-center py-20 text-white/40">
              <Activity size={32} className="mx-auto mb-3 opacity-40" />
              <p className="mb-2">{hasFilters ? "No decisions match your filters." : "No decisions recorded yet."}</p>
              {!hasFilters && (
                <p className="text-xs text-white/25 max-w-sm mx-auto">
                  Install the Agent Provenance SDK and call <code className="font-mono text-teal-400/60">agentprovenance.init()</code> to start capturing decision traces.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/30 uppercase tracking-widest">Decision ID</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/30 uppercase tracking-widest">Agent</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/30 uppercase tracking-widest">Use case</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/30 uppercase tracking-widest">Subject</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/30 uppercase tracking-widest">Risk</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/30 uppercase tracking-widest">Model</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/30 uppercase tracking-widest">Latency</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/30 uppercase tracking-widest">Decided at</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                      onClick={() => setSelectedId(d.decisionId)}
                    >
                      <td className="py-3 px-4 font-mono text-xs text-teal-400/80 max-w-[140px] truncate">
                        {d.decisionId}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-white/75 max-w-[160px] truncate">
                        {d.agentId}
                        {d.agentVersion && <span className="text-white/30 ml-1">v{d.agentVersion}</span>}
                      </td>
                      <td className="py-3 px-4 text-white/65 max-w-[200px] truncate">{d.useCase}</td>
                      <td className="py-3 px-4 font-mono text-xs text-white/45 max-w-[120px] truncate">
                        {d.subjectId ?? <span className="text-white/20">—</span>}
                      </td>
                      <td className="py-3 px-4"><RiskBadge level={d.riskClassification} /></td>
                      <td className="py-3 px-4 font-mono text-xs text-white/40">{d.modelName ?? "—"}</td>
                      <td className="py-3 px-4 text-xs text-white/40">
                        {d.latencyMs != null ? `${d.latencyMs}ms` : "—"}
                      </td>
                      <td className="py-3 px-4 text-xs text-white/30">
                        {new Date(d.decidedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                        <ExternalLink size={13} className="text-white/20 hover:text-teal-400 transition-colors" />
                        <a
                          href={`/report/decision/${d.decisionId}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          title="Download PDF report"
                          className="text-white/20 hover:text-indigo-400 transition-colors"
                        >
                          <FileText size={13} />
                        </a>
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {(decisions?.length ?? 0) > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
              <span className="text-xs text-white/25 font-mono">
                Page {page + 1} · {decisions?.length} rows
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded text-white/40 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={(decisions?.length ?? 0) < PAGE_SIZE}
                  className="p-1.5 rounded text-white/40 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SDK install hint */}
        {!isLoading && !decisions?.length && !hasFilters && (
          <div className="bg-[oklch(0.12_0.015_240)] border border-teal-500/15 rounded-xl p-6">
            <div className="text-xs font-mono text-teal-400/60 uppercase tracking-widest mb-3">Quick start</div>
            <pre className="text-xs text-teal-300 font-mono leading-relaxed overflow-x-auto">
{`pip install agentprovenance

import agentprovenance
agentprovenance.init(api_key="ap_live_...")

from agentprovenance import trace

@trace(agent_id="my-agent-v1", use_case="Credit risk")
def my_agent(customer_id: str, data: dict) -> dict:
    return {"approved": True, "score": 742}`}
            </pre>
            <div className="mt-4">
              <Link href="/developers" className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-mono">
                Full SDK documentation →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedId && (
        <DecisionDetailModal decisionId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
