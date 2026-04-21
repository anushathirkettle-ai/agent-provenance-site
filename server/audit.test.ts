import { describe, it, expect } from "vitest";

// ─── Inline the pure scoring functions for unit testing ─────────────────────
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
  return agentType === "LangChain" ? 25 : 15;
}

function getRiskLevel(euScore: number, useCase: string): "HIGH" | "LIMITED" | "MINIMAL" {
  if (HIGH_RISK_USE_CASES.includes(useCase) || euScore < 40) return "HIGH";
  if (LIMITED_RISK_USE_CASES.includes(useCase) || euScore < 60) return "LIMITED";
  return "MINIMAL";
}

function computeOverall(eu: number, dq: number, pii: number, audit: number): number {
  return Math.round(eu * 0.35 + dq * 0.25 + pii * 0.20 + audit * 0.20);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("EU AI Act scoring", () => {
  it("gives low score for high-risk use case with personal data", () => {
    const score = scoreEuAiAct("Loan / credit approval", true, true);
    expect(score).toBeLessThan(30);
  });

  it("gives higher score for non-high-risk use case without personal data", () => {
    const score = scoreEuAiAct("Other / General assistant", false, false);
    expect(score).toBeGreaterThan(70);
  });

  it("clamps score between 5 and 95", () => {
    const low = scoreEuAiAct("Loan / credit approval", true, true);
    const high = scoreEuAiAct("Other / General assistant", false, false);
    expect(low).toBeGreaterThanOrEqual(5);
    expect(high).toBeLessThanOrEqual(95);
  });
});

describe("Data quality scoring", () => {
  it("penalises public web data sources", () => {
    const score = scoreDataQuality("public web, internet search");
    expect(score).toBeLessThan(50);
  });

  it("rewards verified/certified sources", () => {
    const score = scoreDataQuality("verified CRM database, certified API");
    expect(score).toBeGreaterThan(70);
  });

  it("returns 40 for empty input", () => {
    expect(scoreDataQuality("")).toBe(40);
    expect(scoreDataQuality("   ")).toBe(40);
  });
});

describe("PII exposure scoring", () => {
  it("returns high score when no personal data", () => {
    expect(scorePiiExposure(false, "Loan / credit approval")).toBe(85);
  });

  it("returns low score for high-risk use case with personal data", () => {
    expect(scorePiiExposure(true, "Loan / credit approval")).toBe(30);
  });

  it("returns medium score for limited-risk use case with personal data", () => {
    expect(scorePiiExposure(true, "Fraud detection")).toBe(55);
  });
});

describe("Audit trail scoring", () => {
  it("returns 72 when audit trail exists", () => {
    expect(scoreAuditTrail(true, "LangChain")).toBe(72);
    expect(scoreAuditTrail(true, "custom Python")).toBe(72);
  });

  it("returns 25 for LangChain without audit trail (has integration path)", () => {
    expect(scoreAuditTrail(false, "LangChain")).toBe(25);
  });

  it("returns 15 for other agents without audit trail", () => {
    expect(scoreAuditTrail(false, "custom Python")).toBe(15);
  });
});

describe("Risk level classification", () => {
  it("classifies HIGH risk for high-risk use cases regardless of score", () => {
    expect(getRiskLevel(80, "Loan / credit approval")).toBe("HIGH");
    expect(getRiskLevel(80, "CV / resume screening")).toBe("HIGH");
  });

  it("classifies LIMITED risk for limited-risk use cases", () => {
    expect(getRiskLevel(50, "Fraud detection")).toBe("LIMITED");
  });

  it("classifies MINIMAL risk for general use cases with good score", () => {
    expect(getRiskLevel(75, "Other / General assistant")).toBe("MINIMAL");
  });
});

describe("Overall score computation", () => {
  it("computes weighted average correctly", () => {
    const overall = computeOverall(40, 60, 70, 50);
    // 40*0.35 + 60*0.25 + 70*0.20 + 50*0.20 = 14 + 15 + 14 + 10 = 53
    expect(overall).toBe(53);
  });

  it("returns 100 for perfect scores", () => {
    expect(computeOverall(100, 100, 100, 100)).toBe(100);
  });

  it("returns 0 for zero scores", () => {
    expect(computeOverall(0, 0, 0, 0)).toBe(0);
  });
});
