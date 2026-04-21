/**
 * AGENT PROVENANCE — Home Page
 * Compliance Noir: Deep navy, teal signal, editorial serif
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowRight, Shield, Database, Eye, GitMerge,
  AlertTriangle, CheckCircle2, Terminal, ChevronRight,
  Lock, Zap, Globe
} from "lucide-react";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const deadline = new Date("2026-08-02T00:00:00Z").getTime();
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const units: [string, number][] = [
    ["days", timeLeft.days], ["hrs", timeLeft.hours],
    ["min", timeLeft.minutes], ["sec", timeLeft.seconds],
  ];
  return (
    <div className="flex items-center gap-3">
      {units.map(([label, val]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-mono text-2xl font-semibold text-teal-400 tabular-nums w-12 text-center">
            {String(val).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 300);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${width}%`, backgroundColor: color }} />
    </div>
  );
}

const GH = "https://github.com/anushathirkettle-ai/agent-provenance";

const GithubIcon = () => (
  <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const dimensions = [
  { key: "eu", label: "EU AI Act", score: 34, color: "oklch(0.68 0.20 25)", Icon: Shield },
  { key: "dq", label: "Data Quality", score: 71, color: "oklch(0.65 0.18 185)", Icon: Database },
  { key: "pii", label: "PII Exposure", score: 58, color: "oklch(0.78 0.18 85)", Icon: Eye },
  { key: "at", label: "Audit Trail", score: 22, color: "oklch(0.68 0.20 25)", Icon: GitMerge },
  { key: "ov", label: "Overall", score: 46, color: "oklch(0.60 0.20 290)", Icon: CheckCircle2 },
];

export default function Home() {
  return (
    <div className="bg-[oklch(0.10_0.015_240)] text-white min-h-screen">
      {/* HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
        style={{ background: "radial-gradient(ellipse 80% 60% at 60% 0%, oklch(0.18 0.04 200 / 0.35) 0%, transparent 70%), oklch(0.10 0.015 240)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/8 mb-6">
                <AlertTriangle size={12} className="text-orange-400" />
                <span className="text-xs font-medium text-orange-400">EU AI Act deadline: August 2, 2026</span>
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl xl:text-[3.5rem] text-white leading-[1.08] mb-6">
                Know why your AI agent<br />
                <span className="italic" style={{ color: "oklch(0.65 0.18 185)" }}>decided what it decided.</span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg">
                Agent Provenance links every agent decision to data quality scores, PII flags,
                and EU AI Act risk levels. Free SDK. Open source. Compliance-ready in 2 lines of code.
              </p>
              <div className="bg-[oklch(0.08_0.015_240)] border border-white/10 rounded-lg p-4 font-mono text-sm mb-8">
                <div className="text-white/30 text-xs mb-2">bash</div>
                <div><span className="text-teal-400">pip install</span> <span className="text-white">agent-provenance</span></div>
                <div className="mt-2 text-white/30"># 2 lines to compliance-ready audit trails</div>
                <div>
                  <span className="text-teal-400">from</span>
                  <span className="text-white"> agent_provenance </span>
                  <span className="text-teal-400">import</span>
                  <span className="text-yellow-300"> ProvenanceTracer</span>
                </div>
                <div>
                  <span className="text-white">tracer</span>
                  <span className="text-white/40"> = </span>
                  <span className="text-yellow-300">ProvenanceTracer</span>
                  <span className="text-white/40">(</span>
                  <span className="text-green-400">api_key</span>
                  <span className="text-white/40">=</span>
                  <span className="text-red-300">"..."</span>
                  <span className="text-white/40">)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/audit"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors">
                  Audit your agent free <ArrowRight size={16} />
                </Link>
                <a href={GH} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-white/80 font-medium rounded hover:border-white/40 hover:text-white transition-colors">
                  <GithubIcon /> View on GitHub
                </a>
              </div>
              <div className="flex flex-wrap gap-4 mt-5 text-xs text-white/40">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-400" /> Open source, MIT licence</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-400" /> LangChain + custom Python agents</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-400" /> No credit card required</span>
              </div>
            </div>
            {/* Score Widget */}
            <div>
              <div className="bg-[oklch(0.14_0.015_240)] border border-white/10 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-widest mb-1 font-mono">Agent Compliance Score</div>
                    <div className="text-sm text-white/60">loan-approval-agent · demo</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-semibold text-orange-400 font-mono">46</div>
                    <div className="text-xs text-orange-400/80 mt-0.5">Needs attention</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {dimensions.map((d) => (
                    <div key={d.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/70 flex items-center gap-1.5">
                          <d.Icon size={11} style={{ color: d.color }} />
                          {d.label}
                        </span>
                        <span className="text-xs font-mono" style={{ color: d.color }}>{d.score}</span>
                      </div>
                      <ScoreBar score={d.score} color={d.color} />
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-white/8">
                  <div className="text-xs text-white/40 mb-2 font-mono">Critical issues</div>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-orange-400/90">
                      <AlertTriangle size={11} className="shrink-0 mt-0.5" />
                      <span>EU AI Act: High-risk use case with no documented audit trail</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-yellow-400/90">
                      <AlertTriangle size={11} className="shrink-0 mt-0.5" />
                      <span>Data source quality score 0.62 — below 0.75 compliance threshold</span>
                    </div>
                  </div>
                </div>
                <Link href="/audit"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium rounded hover:bg-teal-500/15 transition-colors">
                  Run this audit on your agent <ChevronRight size={14} />
                </Link>
              </div>
              <div className="mt-4 bg-[oklch(0.14_0.015_240)] border border-orange-500/30 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1">Until EU AI Act enforcement</div>
                  <div className="text-xs text-orange-400/70">August 2, 2026 · High-risk provisions</div>
                </div>
                <CountdownTimer />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-white/8" />

      {/* THE GAP */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-widest text-white/30 font-mono mb-3">The gap</div>
            <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
              Every observability tool tells you <em>what</em> happened.<br />
              None tell you <em>whether the data was trustworthy enough</em>.
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto">
              LangSmith, Arize, Langfuse trace your agent's reasoning. But when a regulator asks
              "was the data behind that decision accurate enough to stake your compliance on?" — none of them can answer.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Database, color: "text-teal-400", title: "Data Provenance", desc: "Every decision linked to the exact data assets that influenced it, with quality scores, source URIs, and freshness timestamps." },
              { Icon: Shield, color: "text-orange-400", title: "EU AI Act Classification", desc: "Automatic risk-level tagging (minimal / limited / high-risk) based on use case, with the evidence trail regulators require." },
              { Icon: Eye, color: "text-yellow-400", title: "PII Detection", desc: "13 regex patterns covering GDPR-relevant PII types — email, NI numbers, IBANs, DOBs, credit cards, IP addresses, and more." },
            ].map((item) => (
              <div key={item.title} className="bg-[oklch(0.14_0.015_240)] border border-white/8 rounded-xl p-6 hover:border-white/15 transition-colors">
                <item.Icon size={22} className={`${item.color} mb-4`} />
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-white/8" />

      {/* HOW IT WORKS */}
      <section className="py-20 bg-[oklch(0.12_0.015_240)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-widest text-white/30 font-mono mb-3">How it works</div>
            <h2 className="font-serif text-3xl lg:text-4xl text-white">Three layers. Two lines of code.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", Icon: Terminal, color: "text-teal-400", title: "Install & instrument", desc: "pip install agent-provenance. Wrap your agent with ProvenanceTracer. Works with LangChain or any custom Python agent. CrewAI and AutoGen integrations coming soon." },
              { step: "02", Icon: Database, color: "text-yellow-400", title: "Trace every decision", desc: "Every agent decision is automatically linked to the data assets it used — with quality scores, PII flags, tool calls, and session chains." },
              { step: "03", Icon: Shield, color: "text-emerald-400", title: "Export compliance reports", desc: "Generate lawyer-readable compliance reports. EU AI Act risk level, data quality evidence, PII exposure summary — ready for your CRO." },
            ].map((item) => (
              <div key={item.step}>
                <div className="text-5xl font-mono font-bold text-white/5 mb-4">{item.step}</div>
                <item.Icon size={20} className={`${item.color} mb-3`} />
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-white/8" />

      {/* COMPARISON TABLE */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest text-white/30 font-mono mb-3">Coverage</div>
            <h2 className="font-serif text-3xl text-white">What Agent Provenance covers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left py-3 pr-6 text-white/40 font-medium">Requirement</th>
                  <th className="text-center py-3 px-4 text-white/40 font-medium">LangSmith</th>
                  <th className="text-center py-3 px-4 text-white/40 font-medium">Arize</th>
                  <th className="text-center py-3 px-4 text-teal-400 font-medium">Agent Provenance</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["Decision trace (what happened)", true, true, true],
                  ["Data quality scores per decision", false, false, true],
                  ["EU AI Act risk classification", false, false, true],
                  ["PII detection in data assets", false, false, true],
                  ["Multi-agent lineage (DAG)", false, false, true],
                  ["Lawyer-readable compliance report", false, false, true],
                  ["Open source / self-hostable", false, true, true],
                  ["LangChain integration", true, true, true],
                ] as [string, boolean, boolean, boolean][]).map(([req, ls, arize, ap]) => (
                  <tr key={req} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-6 text-white/70">{req}</td>
                    <td className="py-3 px-4 text-center">{ls ? <CheckCircle2 size={14} className="text-white/25 mx-auto" /> : <span className="text-white/15">—</span>}</td>
                    <td className="py-3 px-4 text-center">{arize ? <CheckCircle2 size={14} className="text-white/25 mx-auto" /> : <span className="text-white/15">—</span>}</td>
                    <td className="py-3 px-4 text-center">{ap ? <CheckCircle2 size={14} className="text-teal-400 mx-auto" /> : <span className="text-white/15">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="h-px bg-white/8" />

      {/* FINAL CTA */}
      <section className="py-24 bg-[oklch(0.12_0.015_240)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <div className="text-xs uppercase tracking-widest text-white/30 font-mono mb-4">August 2, 2026</div>
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
            Prove your AI agent's decisions were based<br className="hidden lg:block" /> on trustworthy data.
          </h2>
          <p className="text-white/55 mb-8 max-w-lg mx-auto">Before the regulator asks.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/audit"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors">
              Audit your agent free <ArrowRight size={16} />
            </Link>
            <a href={GH} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white/80 font-medium rounded hover:border-white/40 hover:text-white transition-colors">
              <GithubIcon /> View on GitHub
            </a>
          </div>
          <div className="flex flex-wrap gap-6 justify-center mt-6 text-xs text-white/30">
            <span className="flex items-center gap-1.5"><Zap size={11} className="text-teal-400" /> 43 tests passing</span>
            <span className="flex items-center gap-1.5"><Globe size={11} className="text-teal-400" /> LangChain · custom Python · more coming</span>
            <span className="flex items-center gap-1.5"><Lock size={11} className="text-teal-400" /> MIT licence · self-hostable</span>
          </div>
        </div>
      </section>
    </div>
  );
}
