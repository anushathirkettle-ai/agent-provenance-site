import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, Shield } from "lucide-react";
import { getLoginUrl } from "@/const";

const navLinks = [
  { label: "Free Audit", href: "/audit" },
  { label: "Developers", href: "/developers" },
  { label: "Pricing", href: "/pricing" },
];

const BANNER_KEY = "agentprovenance_banner_dismissed_v1";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(() => {
    try { return !localStorage.getItem(BANNER_KEY); } catch { return true; }
  });
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const dismissBanner = () => {
    localStorage.setItem(BANNER_KEY, "1");
    setBannerVisible(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[oklch(0.08_0.015_240/0.95)] backdrop-blur-md shadow-[0_1px_0_oklch(1_0_0/0.08)]" : "bg-transparent"}`}>
      {bannerVisible && (
        <div className="bg-gradient-to-r from-teal-900/80 via-teal-800/80 to-teal-900/80 text-white text-xs sm:text-sm px-4 py-2.5 flex items-center justify-center gap-3 relative border-b border-teal-700/40">
          <Shield size={13} className="text-teal-400 shrink-0" />
          <span className="text-center">
            <span className="font-semibold text-teal-300">EU AI Act high-risk provisions</span>
            <span className="text-white/60 mx-2">·</span>
            <span className="text-white/80">August 2, 2026 deadline — is your agent compliant?</span>
          </span>
          <Link href="/audit" className="hidden sm:flex items-center gap-1 text-teal-300 hover:text-teal-200 font-medium underline underline-offset-2 transition-colors shrink-0">
            Check free <ArrowRight size={12} />
          </Link>
          <button onClick={dismissBanner} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors p-1" aria-label="Dismiss banner">
            <X size={14} />
          </button>
        </div>
      )}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-sm bg-teal-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="5" cy="5" r="2.5" fill="white" />
              <circle cx="11" cy="5" r="2.5" fill="white" fillOpacity="0.5" />
              <circle cx="5" cy="11" r="2.5" fill="white" fillOpacity="0.5" />
              <circle cx="11" cy="11" r="2.5" fill="white" />
              <line x1="5" y1="5" x2="11" y2="11" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
            </svg>
          </div>
          <span className="font-mono text-sm font-semibold text-white tracking-tight">agent-provenance</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} className={`px-3.5 py-2 text-sm font-medium rounded transition-colors duration-150 ${isActive ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/8"}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a href="https://github.com/anushathirkettle-ai/agent-provenance" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
            GitHub
          </a>
          <a href={getLoginUrl()} className="px-4 py-2 text-sm font-semibold bg-teal-500 text-[oklch(0.08_0.015_240)] rounded hover:bg-teal-400 transition-colors">
            Free audit →
          </a>
        </div>
        <button className="md:hidden text-white/80 hover:text-white p-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-[oklch(0.10_0.012_240)] border-t border-white/10 px-4 py-3 space-y-0.5">
          {navLinks.map((link) => {
            const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} className={`flex items-center px-4 py-3.5 text-base font-medium rounded-lg transition-colors ${isActive ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/8"}`}>
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
            <a href="https://github.com/anushathirkettle-ai/agent-provenance" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white rounded-lg transition-colors">GitHub</a>
            <a href={getLoginUrl()} className="block px-4 py-3.5 text-base font-semibold bg-teal-500 text-[oklch(0.08_0.015_240)] rounded-lg text-center hover:bg-teal-400 transition-colors">Free audit →</a>
          </div>
        </div>
      )}
    </header>
  );
}
