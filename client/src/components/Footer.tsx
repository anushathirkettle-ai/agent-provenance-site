/**
 * AGENT PROVENANCE — Footer
 * Dark ink, editorial, teal accent
 */
import { Link } from "wouter";

const footerLinks = {
  Product: [
    { label: "Free Audit", href: "/audit" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/developers" },
  ],
  Developers: [
    { label: "SDK Docs", href: "/developers" },
    { label: "GitHub", href: "https://github.com/anushathirkettle-ai/agent-provenance" },
    { label: "LangChain Integration", href: "/developers" },
    { label: "API Reference", href: "/developers" },
    { label: "Examples", href: "/developers" },
  ],
  Compliance: [
    { label: "EU AI Act Guide", href: "/developers" },
    { label: "GDPR & PII", href: "/developers" },
    { label: "Audit Trail Spec", href: "/developers" },
    { label: "Risk Classification", href: "/developers" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/" },
    { label: "Contact", href: "mailto:hello@agentprovenance.io" },
    { label: "GitHub", href: "https://github.com/anushathirkettle-ai/agent-provenance" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.08_0.01_240)] text-white/60">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Top rule */}
        <div className="h-px bg-white/10" />

        {/* Main footer content */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-sm bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="5" cy="5" r="3" fill="oklch(0.72 0.18 185)" />
                  <circle cx="11" cy="5" r="3" fill="oklch(0.72 0.18 185)" fillOpacity="0.5" />
                  <circle cx="5" cy="11" r="3" fill="oklch(0.72 0.18 185)" fillOpacity="0.5" />
                  <circle cx="11" cy="11" r="3" fill="oklch(0.72 0.18 185)" />
                </svg>
              </div>
              <span className="font-mono text-base text-white tracking-tight">agent-provenance</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Compliance-ready audit trails for AI agent decisions. Know why your agent decided — and whether the data behind it was trustworthy.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
              <span className="text-white/40 ml-1">v0.2.0 — 43 tests passing</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto") ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-white/50 hover:text-white/90 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 hover:text-white/90 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom rule */}
        <div className="h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <div className="flex items-center gap-6">
            <span>© 2026 Agent Provenance. Open source under MIT licence.</span>
            <span className="hidden sm:inline">·</span>
            <Link href="/" className="hover:text-white/60 transition-colors hidden sm:inline">Privacy</Link>
            <Link href="/" className="hover:text-white/60 transition-colors hidden sm:inline">Terms</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono">EU AI Act deadline: August 2, 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
