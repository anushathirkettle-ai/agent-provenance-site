/**
 * AGENT PROVENANCE — Pricing Page
 * 3-tier PLG pricing: Free, Pro, Enterprise
 * Design: Dark, teal accent, editorial
 */
import { useState } from "react";
import { CheckCircle2, ArrowRight, Zap, Shield, Database, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function EnterpriseModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", useCase: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const notify = trpc.system.notifyOwner.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await notify.mutateAsync({
        title: "New Enterprise Inquiry — Agent Provenance",
        content: `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nUse case: ${form.useCase}\nMessage: ${form.message}`,
      });
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please email hello@agentprovenance.io directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[oklch(0.11_0.015_240)] border border-white/12 rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors">
          <X size={18} />
        </button>
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 size={40} className="text-teal-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Message received</h3>
            <p className="text-white/55 text-sm">We will be in touch within 24 hours.</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-white mb-1">Talk to us about Enterprise</h3>
            <p className="text-white/50 text-sm mb-5">Custom pricing, SLAs, and compliance support for your team.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { key: "name", label: "Name *", placeholder: "Your name" },
                { key: "email", label: "Work email *", placeholder: "you@company.com" },
                { key: "company", label: "Company *", placeholder: "Company name" },
                { key: "useCase", label: "Agent use case", placeholder: "e.g. loan approval, CV screening" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-white/50 mb-1">{field.label}</label>
                  <input
                    type={field.key === "email" ? "email" : "text"}
                    placeholder={field.placeholder}
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors disabled:opacity-60 mt-2"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {submitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For developers building and testing agent integrations.",
    icon: Zap,
    color: "teal",
    cta: "Get started free",
    ctaHref: "https://github.com/anushathirkettle-ai/agent-provenance",
    ctaExternal: true,
    features: [
      "Up to 1,000 decision records/month",
      "3 data asset refs per decision",
      "EU AI Act risk classification",
      "PII detection (13 pattern types)",
      "LangChain callback integration",
      "Local SQLite storage",
      "MIT open source license",
      "Community support (GitHub Issues)",
    ],
    notIncluded: [
      "PDF compliance reports",
      "Multi-agent session graphs",
      "API ingest endpoint",
      "SLA or support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "For teams shipping agents to production with compliance requirements.",
    icon: Shield,
    color: "teal",
    cta: "Start Pro trial",
    ctaHref: null,
    ctaExternal: false,
    badge: "Most popular",
    features: [
      "Unlimited decision records",
      "Unlimited data asset refs",
      "PDF compliance reports (EU AI Act, GDPR, CCPA)",
      "Multi-agent session graph (DAG)",
      "Hosted API ingest endpoint",
      "Dashboard with search and filtering",
      "Slack / webhook alerts on HIGH risk decisions",
      "Data source heatmap (reliability by source)",
      "Email support (48h response)",
    ],
    notIncluded: [
      "Custom compliance frameworks",
      "SSO / SAML",
      "Dedicated support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per year",
    description: "For regulated industries and teams with legal/compliance sign-off requirements.",
    icon: Database,
    color: "white",
    cta: "Talk to us",
    ctaHref: null,
    ctaExternal: false,
    features: [
      "Everything in Pro",
      "Custom compliance frameworks",
      "Lawyer-ready audit report generation",
      "SSO / SAML / SCIM",
      "On-premise or private cloud deployment",
      "Custom data retention policies",
      "Dedicated Slack channel",
      "SLA (99.9% uptime)",
      "Acquisition / integration support",
    ],
    notIncluded: [],
  },
];

function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const notify = trpc.system.notifyOwner.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await notify.mutateAsync({
        title: "Pro Waitlist Signup — Agent Provenance",
        content: `Email: ${email}\nCompany: ${company}`,
      });
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please email hello@agentprovenance.io");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[oklch(0.11_0.015_240)] border border-white/12 rounded-xl w-full max-w-sm p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"><X size={18} /></button>
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 size={40} className="text-teal-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">You're on the list</h3>
            <p className="text-white/55 text-sm">We'll email you when Pro launches. Expected: Q2 2026.</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-white mb-1">Join the Pro waitlist</h3>
            <p className="text-white/50 text-sm mb-5">Pro is launching Q2 2026. Get early access and founding member pricing.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-white/50 mb-1">Work email *</label>
                <input type="email" required placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-teal-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Company</label>
                <input type="text" placeholder="Company name" value={company} onChange={e => setCompany(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-teal-500/50 transition-colors" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors disabled:opacity-60 mt-1">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {submitting ? "Joining..." : "Join waitlist"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [showModal, setShowModal] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.015_240)] text-white">
      {showModal && <EnterpriseModal onClose={() => setShowModal(false)} />}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}

      {/* Header */}
      <div className="pt-28 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono mb-6">
          <Shield size={12} /> EU AI Act deadline: August 2, 2026
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Start free. Scale when you need compliance.
        </h1>
        <p className="text-lg text-white/55 max-w-xl mx-auto">
          The SDK is open source and free forever. Pay only when you need hosted infrastructure, compliance reports, or enterprise support.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="max-w-[1100px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl border p-6 flex flex-col ${
                tier.name === "Pro"
                  ? "border-teal-500/40 bg-teal-500/5"
                  : "border-white/10 bg-white/3"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-teal-500 text-[oklch(0.08_0.015_240)] text-xs font-semibold px-3 py-1 rounded-full">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tier.name === "Pro" ? "bg-teal-500/20" : "bg-white/8"}`}>
                  <tier.icon size={18} className={tier.name === "Enterprise" ? "text-white/70" : "text-teal-400"} />
                </div>
                <h2 className="text-lg font-semibold text-white">{tier.name}</h2>
                <div className="flex items-baseline gap-1 mt-1 mb-2">
                  <span className="text-3xl font-bold text-white">{tier.price}</span>
                  <span className="text-sm text-white/40">{tier.period}</span>
                </div>
                <p className="text-sm text-white/50">{tier.description}</p>
              </div>

              <div className="flex-1 space-y-2 mb-6">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
                {tier.notIncluded.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-white/25">
                    <X size={14} className="shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>

              {tier.ctaHref ? (
                <a
                  href={tier.ctaHref}
                  target={tier.ctaExternal ? "_blank" : undefined}
                  rel={tier.ctaExternal ? "noopener noreferrer" : undefined}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded font-semibold text-sm transition-colors ${
                    tier.name === "Pro"
                      ? "bg-teal-500 text-[oklch(0.08_0.015_240)] hover:bg-teal-400"
                      : "bg-white/8 text-white hover:bg-white/12 border border-white/10"
                  }`}
                >
                  {tier.cta} <ArrowRight size={14} />
                </a>
              ) : (
                <button
                  onClick={() => {
                    if (tier.name === "Enterprise") {
                      setShowModal(true);
                    } else if (tier.name === "Pro") {
                      setShowWaitlist(true);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded font-semibold text-sm transition-colors ${
                    tier.name === "Pro"
                      ? "bg-teal-500 text-[oklch(0.08_0.015_240)] hover:bg-teal-400"
                      : "bg-white/8 text-white hover:bg-white/12 border border-white/10"
                  }`}
                >
                  {tier.cta} <ArrowRight size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">Common questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Is the SDK really free forever?",
                a: "Yes. The Python SDK is MIT-licensed and open source. You can use it indefinitely for local development, testing, and self-hosted production deployments. We charge only for hosted infrastructure and compliance report generation.",
              },
              {
                q: "What counts as a 'decision record'?",
                a: "One call to tracer.trace() creates one decision record. A decision record includes all data assets referenced, tool calls made, model metadata, PII flags, and the EU AI Act risk classification.",
              },
              {
                q: "Do I need an API key to use the free tier?",
                a: "No. The free tier works entirely locally — records are stored in SQLite on your machine. An API key is only required to send records to our hosted ingest endpoint (Pro and Enterprise).",
              },
              {
                q: "Can Agent Provenance be used for acquisition due diligence?",
                a: "Yes — this is one of the primary use cases for the Enterprise tier. The compliance report output is designed to be readable by legal and technical teams during M&A due diligence on AI systems.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-white/8 pb-6">
                <h3 className="text-white font-medium mb-2">{item.q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
