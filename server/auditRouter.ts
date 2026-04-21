import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

const HIGH_RISK_USE_CASES = [
  "Loan / credit approval",
  "CV / resume screening",
  "Medical triage or diagnosis",
  "Insurance underwriting",
  "HR performance review",
];

const LIMITED_RISK_USE_CASES = [
  "Fraud detection",
  "Customer service routing",
  "Content moderation",
];

function scoreEuAiAct(useCase: string, irreversible: boolean, personalData: boolean): number {
  const isHighRisk = HIGH_RISK_USE_CASES.includes(useCase);
  const isLimited = LIMITED_RISK_USE_CASES.includes(useCase);
  let base = isHighRisk ? 15 : isLimited ? 45 : 75;
  if (irreversible && isHighRisk) base -= 10;
  if (!personalData) base += 10;
  return Math.max(5, Math.min(95, base));
}

function scoreDataQuality(dataSources: string): number {
  if (!dataSources.trim()) return 40;
  const lower = dataSources.toLowerCase();
  let score = 50;
  if (lower.includes("verified") || lower.includes("certified")) score += 20;
  if (lower.includes("crm") || lower.includes("database")) score += 10;
  if (lower.includes("public web") || lower.includes("internet")) score -= 20;
  if (lower.includes("api")) score += 5;
  if (lower.includes("real-time") || lower.includes("realtime")) score += 5;
  if (lower.includes("knowledge base")) score -= 5;
  return Math.max(10, Math.min(90, score));
}

function scorePiiExposure(personalData: boolean, useCase: string): number {
  if (!personalData) return 85;
  const isHighRisk = HIGH_RISK_USE_CASES.includes(useCase);
  return isHighRisk ? 30 : 55;
}

function scoreAuditTrail(hasAuditTrail: boolean, agentType: string): number {
  if (hasAuditTrail) return 72;
  // No audit trail — very low score
  return agentType === "LangChain" ? 25 : 15;
}

function getRiskLevel(euScore: number, useCase: string): "HIGH" | "LIMITED" | "MINIMAL" {
  if (HIGH_RISK_USE_CASES.includes(useCase) || euScore < 40) return "HIGH";
  if (LIMITED_RISK_USE_CASES.includes(useCase) || euScore < 60) return "LIMITED";
  return "MINIMAL";
}

function buildIssues(
  euScore: number,
  dqScore: number,
  piiScore: number,
  atScore: number,
  useCase: string,
  irreversible: boolean,
  personalData: boolean,
  hasAuditTrail: boolean
): string[] {
  const issues: string[] = [];
  if (HIGH_RISK_USE_CASES.includes(useCase)) {
    issues.push(`EU AI Act: "${useCase}" is classified as high-risk under Annex III. Full audit trail and human oversight required by August 2, 2026.`);
  }
  if (!hasAuditTrail) {
    issues.push("No audit trail detected. EU AI Act Article 12 requires technical documentation and logging for high-risk AI systems.");
  }
  if (dqScore < 60) {
    issues.push("Data quality risk: unverified or public web data sources increase hallucination risk and weaken compliance evidence.");
  }
  if (personalData && piiScore < 50) {
    issues.push("PII exposure: agent processes personal data in a high-risk context. GDPR Article 22 and EU AI Act Article 10 apply.");
  }
  if (irreversible && !hasAuditTrail) {
    issues.push("Irreversible decisions without audit trail: if an agent decision cannot be undone, every decision must be logged with data provenance.");
  }
  if (atScore < 30) {
    issues.push("Audit trail coverage is critically low. Regulators require decision-level logs linking each output to the data that influenced it.");
  }
  return issues;
}

function buildRecommendations(
  agentType: string,
  useCase: string,
  hasAuditTrail: boolean,
  dqScore: number
): string[] {
  const recs: string[] = [];
  recs.push(`Install Agent Provenance SDK: pip install agent-provenance — adds compliance-ready audit trails in 2 lines of code.`);
  if (!hasAuditTrail) {
    recs.push("Enable decision logging: every agent output must be linked to the data assets that influenced it, with quality scores and timestamps.");
  }
  if (HIGH_RISK_USE_CASES.includes(useCase)) {
    recs.push("Implement human-in-the-loop review for high-risk decisions. EU AI Act Article 14 requires meaningful human oversight.");
  }
  if (dqScore < 60) {
    recs.push("Audit your data sources: replace public web scraping with verified, quality-scored data assets. Target quality score ≥ 0.75.");
  }
  recs.push("Generate a compliance report before August 2, 2026 and share it with your legal/compliance team.");
  recs.push("Register your AI system in the EU AI Act database if deploying in the EU with high-risk classification.");
  return recs;
}

function buildSdkSnippet(agentType: string, useCase: string): string {
  const useCaseSlug = useCase.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  if (agentType === "LangChain") {
    return `from agent_provenance import ProvenanceTracer
from agent_provenance.integrations.langchain import ProvenanceCallbackHandler

tracer = ProvenanceTracer(api_key="YOUR_API_KEY")
handler = ProvenanceCallbackHandler(tracer, use_case="${useCaseSlug}")

# Add to your LangChain chain/agent
chain = your_chain.with_config(callbacks=[handler])`;
  }
  return `from agent_provenance import ProvenanceTracer, DataAssetRef

tracer = ProvenanceTracer(api_key="YOUR_API_KEY")

# Wrap your agent decision
with tracer.trace("${useCaseSlug}") as decision:
    decision.add_data_asset(DataAssetRef(
        asset_id="your_data_source",
        source_uri="your://data/source",
        quality_score=0.85,
    ))
    result = your_agent.run(input_data)
    decision.record(
        output_summary=str(result),
        model_name="gpt-4o",
    )`;
}

export const auditRouter = router({
  runAudit: publicProcedure
    .input(z.object({
      agentType: z.string(),
      useCase: z.string(),
      dataSources: z.string().default(""),
      irreversibleDecisions: z.boolean().default(false),
      processesPersonalData: z.boolean().default(false),
      hasAuditTrail: z.boolean().default(false),
    }))
    .mutation(({ input }) => {
      const euScore = scoreEuAiAct(input.useCase, input.irreversibleDecisions, input.processesPersonalData);
      const dqScore = scoreDataQuality(input.dataSources);
      const piiScore = scorePiiExposure(input.processesPersonalData, input.useCase);
      const atScore = scoreAuditTrail(input.hasAuditTrail, input.agentType);
      const overall = Math.round((euScore * 0.35) + (dqScore * 0.25) + (piiScore * 0.20) + (atScore * 0.20));

      return {
        scores: {
          eu_ai_act: euScore,
          data_quality: dqScore,
          pii_exposure: piiScore,
          audit_trail: atScore,
          overall,
        },
        risk_level: getRiskLevel(euScore, input.useCase),
        issues: buildIssues(euScore, dqScore, piiScore, atScore, input.useCase,
          input.irreversibleDecisions, input.processesPersonalData, input.hasAuditTrail),
        recommendations: buildRecommendations(input.agentType, input.useCase,
          input.hasAuditTrail, dqScore),
        sdk_snippet: buildSdkSnippet(input.agentType, input.useCase),
      };
    }),
});
