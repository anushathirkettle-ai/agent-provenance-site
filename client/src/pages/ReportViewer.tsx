/**
 * AGENT PROVENANCE — Report Viewer
 * Renders a decision trace or fleet compliance report as printable HTML.
 * Accessed via /report/decision/:id or /report/fleet
 */
import { useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Printer, ArrowLeft, Shield } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

function ReportFrame({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full flex-1 border-0"
      style={{ minHeight: "calc(100vh - 60px)" }}
      title="Report"
    />
  );
}

export default function ReportViewer() {
  const { user, loading } = useAuth();
  const [matchDecision, paramsDecision] = useRoute("/report/decision/:id");
  const [matchFleet] = useRoute("/report/fleet");

  const decisionId = matchDecision ? paramsDecision?.id : undefined;

  const { data: decisionReport, isLoading: loadingDecision } = trpc.reports.decisionTrace.useQuery(
    { decisionId: decisionId! },
    { enabled: !!user && !!decisionId }
  );

  const { data: fleetReport, isLoading: loadingFleet } = trpc.reports.fleetCompliance.useQuery(
    {},
    { enabled: !!user && !!matchFleet }
  );

  const isLoading = loadingDecision || loadingFleet;
  const html = decisionReport?.html ?? fleetReport?.html;
  const title = decisionId ? `Decision Trace — ${decisionId}` : "Fleet Compliance Report";

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
          <h2 className="font-serif text-2xl text-white mb-3">Sign in to view reports</h2>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors text-sm">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[oklch(0.12_0.015_240)] border-b border-white/8 print:hidden">
        <div className="flex items-center gap-3">
          <Link href={decisionId ? "/decisions" : "/decisions"} className="text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <span className="text-sm text-white/60 font-mono">{title}</span>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-1.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded text-sm hover:bg-teal-400 transition-colors"
        >
          <Printer size={14} />
          Print / Save as PDF
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-[oklch(0.10_0.015_240)]">
          <div className="text-center">
            <Loader2 size={28} className="animate-spin text-teal-400 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Generating report...</p>
          </div>
        </div>
      ) : html ? (
        <ReportFrame html={html} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[oklch(0.10_0.015_240)]">
          <p className="text-white/40">Report not found.</p>
        </div>
      )}
    </div>
  );
}
