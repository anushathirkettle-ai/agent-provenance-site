/**
 * AGENT PROVENANCE — Report Router
 * Generates PDF compliance reports for individual decisions or fleet-wide audits.
 * Uses a server-side HTML-to-PDF approach via a dedicated Express endpoint.
 */
import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getDecisionById, getDecisions, getDecisionStats, getApiKeysByUser } from "./db";
import { TRPCError } from "@trpc/server";

export const reportRouter = router({
  /**
   * Generate a single decision trace report.
   * Returns an HTML string that the client renders and prints as PDF.
   */
  decisionTrace: protectedProcedure
    .input(z.object({ decisionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const decision = await getDecisionById(input.decisionId);
      if (!decision) throw new TRPCError({ code: "NOT_FOUND", message: "Decision not found" });

      const riskColors: Record<string, string> = {
        HIGH: "#ef4444",
        LIMITED: "#f97316",
        MINIMAL: "#14b8a6",
        UNCLASSIFIED: "#6b7280",
      };

      const riskColor = riskColors[decision.riskClassification ?? "UNCLASSIFIED"] ?? "#6b7280";
      const decidedAt = new Date(decision.decidedAt).toLocaleString();
      const recordedAt = new Date(decision.createdAt).toLocaleString();
      const dataSources = Array.isArray(decision.dataSources) ? decision.dataSources as string[] : [];
      const outputData = decision.outputData ? JSON.stringify(decision.outputData, null, 2) : null;

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Decision Trace — ${decision.decisionId}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; color: #1a1a2e; background: #fff; padding: 48px; font-size: 13px; line-height: 1.6; }
  .header { border-bottom: 3px solid #0d9488; padding-bottom: 24px; margin-bottom: 32px; }
  .logo { font-family: 'Courier New', monospace; font-size: 11px; color: #0d9488; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
  h1 { font-size: 22px; color: #0f172a; font-weight: 700; margin-bottom: 4px; }
  .subtitle { font-size: 11px; color: #64748b; font-family: 'Courier New', monospace; }
  .meta-row { display: flex; gap: 32px; margin-bottom: 32px; }
  .meta-item { flex: 1; }
  .meta-label { font-size: 9px; font-family: 'Courier New', monospace; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }
  .meta-value { font-size: 13px; color: #1e293b; font-weight: 600; }
  .meta-value.mono { font-family: 'Courier New', monospace; font-size: 11px; }
  .risk-badge { display: inline-block; padding: 3px 10px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; color: white; background: ${riskColor}; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 10px; font-family: 'Courier New', monospace; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
  .content-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px; font-size: 13px; color: #334155; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .field { }
  .field-label { font-size: 9px; font-family: 'Courier New', monospace; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 3px; }
  .field-value { font-size: 12px; color: #334155; }
  .field-value.mono { font-family: 'Courier New', monospace; font-size: 11px; }
  .source-tag { display: inline-block; padding: 2px 8px; background: #ede9fe; color: #6d28d9; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 10px; margin: 2px; }
  pre { font-family: 'Courier New', monospace; font-size: 10px; background: #0f172a; color: #7dd3fc; padding: 14px; border-radius: 6px; overflow: hidden; white-space: pre-wrap; word-break: break-all; }
  .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-family: 'Courier New', monospace; }
  .compliance-note { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px 16px; margin-bottom: 28px; font-size: 11px; color: #166534; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">Agent Provenance</div>
    <h1>Decision Trace Report</h1>
    <div class="subtitle">EU AI Act Article 12 — Transparency & Traceability Record</div>
  </div>

  <div class="compliance-note">
    This document constitutes an audit trail record as required under EU AI Act Article 12 (Record-keeping) and Article 13 (Transparency). It provides complete traceability of an AI agent decision including inputs, outputs, data sources, and model identity.
  </div>

  <div class="meta-row">
    <div class="meta-item">
      <div class="meta-label">Decision ID</div>
      <div class="meta-value mono">${decision.decisionId}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Risk classification</div>
      <div class="meta-value"><span class="risk-badge">${decision.riskClassification ?? "UNCLASSIFIED"}</span></div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Decision timestamp</div>
      <div class="meta-value">${decidedAt}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Record created</div>
      <div class="meta-value">${recordedAt}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Agent identity</div>
    <div class="grid-2">
      <div class="field"><div class="field-label">Agent ID</div><div class="field-value mono">${decision.agentId}</div></div>
      <div class="field"><div class="field-label">Agent version</div><div class="field-value mono">${decision.agentVersion ?? "—"}</div></div>
      <div class="field"><div class="field-label">Model</div><div class="field-value mono">${decision.modelName ?? "—"}</div></div>
      <div class="field"><div class="field-label">Model version</div><div class="field-value mono">${decision.modelVersion ?? "—"}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Decision context</div>
    <div class="grid-2" style="margin-bottom:12px">
      <div class="field"><div class="field-label">Use case</div><div class="field-value">${decision.useCase}</div></div>
      <div class="field"><div class="field-label">Subject ID</div><div class="field-value mono">${decision.subjectId ?? "—"}</div></div>
      <div class="field"><div class="field-label">Subject type</div><div class="field-value">${decision.subjectType ?? "—"}</div></div>
      <div class="field"><div class="field-label">Confidence score</div><div class="field-value">${decision.confidenceScore != null ? `${decision.confidenceScore}%` : "—"}</div></div>
    </div>
  </div>

  ${decision.inputSummary ? `
  <div class="section">
    <div class="section-title">Input summary</div>
    <div class="content-box">${decision.inputSummary}</div>
    ${decision.inputHash ? `<div style="font-family:monospace;font-size:10px;color:#94a3b8;margin-top:6px;">Input hash (SHA-256): ${decision.inputHash}</div>` : ""}
  </div>` : ""}

  <div class="section">
    <div class="section-title">Decision output</div>
    <div class="content-box">${decision.outputSummary}</div>
  </div>

  ${dataSources.length > 0 ? `
  <div class="section">
    <div class="section-title">Data sources</div>
    <div>${dataSources.map(s => `<span class="source-tag">${s}</span>`).join("")}</div>
  </div>` : ""}

  ${outputData ? `
  <div class="section">
    <div class="section-title">Structured output data</div>
    <pre>${outputData}</pre>
  </div>` : ""}

  <div class="section">
    <div class="section-title">Performance metrics</div>
    <div class="grid-2">
      <div class="field"><div class="field-label">Latency</div><div class="field-value">${decision.latencyMs != null ? `${decision.latencyMs}ms` : "—"}</div></div>
      <div class="field"><div class="field-label">API key prefix</div><div class="field-value mono">${decision.apiKeyHash ? decision.apiKeyHash.substring(0, 12) + "..." : "Session auth"}</div></div>
    </div>
  </div>

  <div class="footer">
    <span>Generated by Agent Provenance · agentprovenance.io</span>
    <span>Report generated: ${new Date().toLocaleString()}</span>
  </div>
</body>
</html>`;

      return { html, decisionId: decision.decisionId };
    }),

  /**
   * Generate a fleet compliance report (summary of all decisions).
   */
  fleetCompliance: protectedProcedure
    .input(z.object({
      fromTs: z.number().optional(),
      toTs: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const decisions = await getDecisions({ fromTs: input.fromTs, toTs: input.toTs, limit: 1000 });
      const stats = await getDecisionStats();

      const riskCounts: Record<string, number> = { HIGH: 0, LIMITED: 0, MINIMAL: 0, UNCLASSIFIED: 0 };
      const agentMap: Record<string, number> = {};
      decisions.forEach(d => {
        const risk = d.riskClassification ?? "UNCLASSIFIED";
        riskCounts[risk] = (riskCounts[risk] ?? 0) + 1;
        agentMap[d.agentId] = (agentMap[d.agentId] ?? 0) + 1;
      });

      const agentRows = Object.entries(agentMap)
        .sort((a, b) => b[1] - a[1])
        .map(([id, count]) => `<tr><td class="td mono">${id}</td><td class="td">${count}</td></tr>`)
        .join("");

      const recentRows = decisions.slice(0, 20)
        .map(d => {
          const riskColors: Record<string, string> = { HIGH: "#ef4444", LIMITED: "#f97316", MINIMAL: "#14b8a6", UNCLASSIFIED: "#6b7280" };
          const c = riskColors[d.riskClassification ?? "UNCLASSIFIED"] ?? "#6b7280";
          return `<tr>
            <td class="td mono" style="font-size:10px">${d.decisionId}</td>
            <td class="td mono">${d.agentId}</td>
            <td class="td">${d.useCase}</td>
            <td class="td"><span style="color:${c};font-weight:700;font-family:monospace;font-size:10px">${d.riskClassification ?? "UNCLASSIFIED"}</span></td>
            <td class="td">${new Date(d.decidedAt).toLocaleDateString()}</td>
          </tr>`;
        }).join("");

      const complianceScore = stats.total === 0 ? 100 :
        Math.round(((stats.total - stats.highRisk) / stats.total) * 100);

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Fleet Compliance Report — Agent Provenance</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; color: #1a1a2e; background: #fff; padding: 48px; font-size: 13px; line-height: 1.6; }
  .header { border-bottom: 3px solid #0d9488; padding-bottom: 24px; margin-bottom: 32px; }
  .logo { font-family: 'Courier New', monospace; font-size: 11px; color: #0d9488; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
  h1 { font-size: 22px; color: #0f172a; font-weight: 700; margin-bottom: 4px; }
  .subtitle { font-size: 11px; color: #64748b; font-family: 'Courier New', monospace; }
  .score-row { display: flex; gap: 24px; margin-bottom: 32px; }
  .score-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
  .score-value { font-size: 32px; font-weight: 700; }
  .score-label { font-size: 9px; font-family: 'Courier New', monospace; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 10px; font-family: 'Courier New', monospace; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
  table { width: 100%; border-collapse: collapse; }
  .th { text-align: left; font-size: 9px; font-family: 'Courier New', monospace; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
  .td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-size: 11px; color: #334155; vertical-align: top; }
  .td.mono { font-family: 'Courier New', monospace; }
  .compliance-note { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px 16px; margin-bottom: 28px; font-size: 11px; color: #166534; }
  .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-family: 'Courier New', monospace; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">Agent Provenance</div>
    <h1>Fleet Compliance Report</h1>
    <div class="subtitle">EU AI Act — Fleet-wide Audit Summary · Generated ${new Date().toLocaleString()}</div>
  </div>

  <div class="compliance-note">
    This report provides a fleet-wide summary of AI agent decisions recorded via the Agent Provenance SDK. It is designed to support EU AI Act compliance obligations under Articles 9 (Risk management), 12 (Record-keeping), and 13 (Transparency).
  </div>

  <div class="score-row">
    <div class="score-card">
      <div class="score-value" style="color:#0d9488">${complianceScore}%</div>
      <div class="score-label">Compliance score</div>
    </div>
    <div class="score-card">
      <div class="score-value" style="color:#1e293b">${stats.total}</div>
      <div class="score-label">Total decisions</div>
    </div>
    <div class="score-card">
      <div class="score-value" style="color:#ef4444">${stats.highRisk}</div>
      <div class="score-label">High-risk decisions</div>
    </div>
    <div class="score-card">
      <div class="score-value" style="color:#6366f1">${stats.agents}</div>
      <div class="score-label">Active agents</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Risk distribution</div>
    <table>
      <tr>
        <th class="th">Risk level</th>
        <th class="th">Count</th>
        <th class="th">% of total</th>
        <th class="th">EU AI Act classification</th>
      </tr>
      ${Object.entries(riskCounts).map(([level, count]) => `
      <tr>
        <td class="td mono" style="font-weight:700">${level}</td>
        <td class="td">${count}</td>
        <td class="td">${stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%</td>
        <td class="td">${level === "HIGH" ? "Prohibited/High-risk systems (Annex III)" : level === "LIMITED" ? "Limited risk — transparency obligations" : level === "MINIMAL" ? "Minimal risk — no specific obligations" : "Not yet classified"}</td>
      </tr>`).join("")}
    </table>
  </div>

  <div class="section">
    <div class="section-title">Agent activity</div>
    <table>
      <tr>
        <th class="th">Agent ID</th>
        <th class="th">Decision count</th>
      </tr>
      ${agentRows || '<tr><td class="td" colspan="2" style="color:#94a3b8">No agents recorded yet.</td></tr>'}
    </table>
  </div>

  <div class="section">
    <div class="section-title">Recent decisions (last 20)</div>
    <table>
      <tr>
        <th class="th">Decision ID</th>
        <th class="th">Agent</th>
        <th class="th">Use case</th>
        <th class="th">Risk</th>
        <th class="th">Date</th>
      </tr>
      ${recentRows || '<tr><td class="td" colspan="5" style="color:#94a3b8">No decisions recorded yet.</td></tr>'}
    </table>
  </div>

  <div class="footer">
    <span>Generated by Agent Provenance · agentprovenance.io</span>
    <span>Report generated: ${new Date().toLocaleString()}</span>
  </div>
</body>
</html>`;

      return { html };
    }),
});
