/**
 * REST API v1 — SDK-friendly endpoints
 *
 * These routes expose a plain JSON REST interface so the Python SDK (and any
 * HTTP client) can submit decisions without a tRPC client.  Authentication is
 * via the `Authorization: Bearer <api_key>` header.
 *
 * Routes:
 *   POST /api/v1/decisions   — capture a decision trace
 *   GET  /api/v1/health      — liveness check (no auth required)
 */

import { Router, Request, Response } from "express";
import crypto from "crypto";
import { saveDecision, validateApiKey } from "./db";

const router = Router();

// ─── Health check ─────────────────────────────────────────────────────────────

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", version: "1" });
});

// ─── POST /api/v1/decisions ───────────────────────────────────────────────────

/**
 * Accepted body shape (all optional except agentId, useCase, outputSummary):
 * {
 *   decisionId?:         string          // generated if omitted
 *   agentId:             string          // required
 *   agentVersion?:       string
 *   subjectId?:          string
 *   subjectType?:        string
 *   useCase:             string          // required
 *   inputSummary?:       string
 *   inputHash?:          string
 *   outputSummary:       string          // required
 *   outputData?:         object
 *   dataSources?:        string[]
 *   modelName?:          string
 *   modelVersion?:       string
 *   riskClassification?: "HIGH"|"LIMITED"|"MINIMAL"|"UNCLASSIFIED"
 *   latencyMs?:          number
 *   confidenceScore?:    number (0-100)
 *   decidedAt?:          number (UTC ms)
 * }
 *
 * Authentication: Authorization: Bearer <api_key>
 */
router.post("/decisions", async (req: Request, res: Response) => {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = req.headers["authorization"] ?? "";
    const raw = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!raw) {
      return res.status(401).json({ error: "Missing Authorization header. Use: Authorization: Bearer <api_key>" });
    }

    const key = await validateApiKey(raw);
    if (!key) {
      return res.status(401).json({ error: "Invalid or revoked API key." });
    }

    // ── Validate required fields ───────────────────────────────────────────────
    const body = req.body as Record<string, unknown>;
    const { agentId, useCase, outputSummary } = body;

    if (typeof agentId !== "string" || !agentId.trim()) {
      return res.status(400).json({ error: "agentId is required (string)" });
    }
    if (typeof useCase !== "string" || !useCase.trim()) {
      return res.status(400).json({ error: "useCase is required (string)" });
    }
    if (typeof outputSummary !== "string" || !outputSummary.trim()) {
      return res.status(400).json({ error: "outputSummary is required (string)" });
    }

    // ── Validate optional typed fields ────────────────────────────────────────
    const validRisk = ["HIGH", "LIMITED", "MINIMAL", "UNCLASSIFIED"] as const;
    type RiskLevel = (typeof validRisk)[number];
    const riskRaw = body.riskClassification;
    const riskClassification: RiskLevel =
      typeof riskRaw === "string" && (validRisk as readonly string[]).includes(riskRaw)
        ? (riskRaw as RiskLevel)
        : "UNCLASSIFIED";

    const latencyMs =
      typeof body.latencyMs === "number" && Number.isInteger(body.latencyMs) && body.latencyMs >= 0
        ? body.latencyMs
        : null;

    const confidenceScore =
      typeof body.confidenceScore === "number" &&
      Number.isInteger(body.confidenceScore) &&
      body.confidenceScore >= 0 &&
      body.confidenceScore <= 100
        ? body.confidenceScore
        : null;

    const dataSources = Array.isArray(body.dataSources)
      ? (body.dataSources as unknown[]).filter((s): s is string => typeof s === "string")
      : null;

    const outputData =
      body.outputData !== null && typeof body.outputData === "object" && !Array.isArray(body.outputData)
        ? (body.outputData as Record<string, unknown>)
        : null;

    // ── Persist ───────────────────────────────────────────────────────────────
    const decisionId =
      typeof body.decisionId === "string" && body.decisionId.trim()
        ? body.decisionId.trim()
        : `ap_${crypto.randomBytes(12).toString("hex")}`;

    const decidedAt =
      typeof body.decidedAt === "number" && body.decidedAt > 0 ? body.decidedAt : Date.now();

    await saveDecision({
      decisionId,
      agentId: agentId.trim(),
      agentVersion: typeof body.agentVersion === "string" ? body.agentVersion : null,
      subjectId: typeof body.subjectId === "string" ? body.subjectId : null,
      subjectType: typeof body.subjectType === "string" ? body.subjectType : null,
      useCase: useCase.trim(),
      inputSummary: typeof body.inputSummary === "string" ? body.inputSummary : null,
      inputHash: typeof body.inputHash === "string" ? body.inputHash : null,
      outputSummary: outputSummary.trim(),
      outputData,
      dataSources,
      modelName: typeof body.modelName === "string" ? body.modelName : null,
      modelVersion: typeof body.modelVersion === "string" ? body.modelVersion : null,
      riskClassification,
      latencyMs,
      confidenceScore,
      apiKeyHash: key.keyHash,
      userId: key.userId,
      decidedAt,
    });

    return res.status(201).json({ success: true, decisionId });
  } catch (err) {
    console.error("[v1/decisions] Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export function registerV1Routes(app: import("express").Express) {
  app.use("/api/v1", router);
}
