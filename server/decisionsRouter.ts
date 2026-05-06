import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  saveDecision,
  getDecisions,
  getDecisionById,
  getDecisionStats,
  createApiKey,
  getApiKeysByUser,
  revokeApiKey,
  validateApiKey,
} from "./db";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

// ─── Decision capture ────────────────────────────────────────────────────────

const riskValues = ["HIGH", "LIMITED", "MINIMAL", "UNCLASSIFIED"] as const;

const decisionInputSchema = z.object({
  decisionId: z.string().optional(),
  agentId: z.string().min(1).max(128),
  agentVersion: z.string().max(64).optional(),
  subjectId: z.string().max(255).optional(),
  subjectType: z.string().max(64).optional(),
  useCase: z.string().min(1).max(255),
  inputSummary: z.string().max(2000).optional(),
  inputHash: z.string().max(64).optional(),
  outputSummary: z.string().min(1).max(2000),
  outputData: z.record(z.string(), z.unknown()).optional(),
  dataSources: z.array(z.string()).optional(),
  modelName: z.string().max(128).optional(),
  modelVersion: z.string().max(64).optional(),
  riskClassification: z.enum(riskValues).optional(),
  latencyMs: z.number().int().min(0).optional(),
  confidenceScore: z.number().int().min(0).max(100).optional(),
  decidedAt: z.number().optional(),
  apiKey: z.string().optional(),
});

export const decisionsRouter = router({
  /**
   * POST /api/trpc/decisions.capture
   * The core SDK endpoint — records a decision trace.
   * Accepts either an authenticated session OR a valid API key.
   */
  capture: publicProcedure
    .input(decisionInputSchema)
    .mutation(async ({ input, ctx }) => {
      let userId: number | undefined;
      let apiKeyHash: string | undefined;

      // Resolve identity: authenticated user OR API key
      if (ctx.user) {
        userId = ctx.user.id;
      } else if (input.apiKey) {
        const key = await validateApiKey(input.apiKey);
        if (!key) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid API key" });
        }
        userId = key.userId;
        apiKeyHash = key.keyHash;
      } else {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Provide a valid API key or sign in" });
      }

      const decisionId = input.decisionId ?? `ap_${crypto.randomBytes(12).toString("hex")}`;
      const decidedAt = input.decidedAt ?? Date.now();

      await saveDecision({
        decisionId,
        agentId: input.agentId,
        agentVersion: input.agentVersion ?? null,
        subjectId: input.subjectId ?? null,
        subjectType: input.subjectType ?? null,
        useCase: input.useCase,
        inputSummary: input.inputSummary ?? null,
        inputHash: input.inputHash ?? null,
        outputSummary: input.outputSummary,
        outputData: input.outputData ?? null,
        dataSources: input.dataSources ?? null,
        modelName: input.modelName ?? null,
        modelVersion: input.modelVersion ?? null,
        riskClassification: input.riskClassification ?? "UNCLASSIFIED",
        latencyMs: input.latencyMs ?? null,
        confidenceScore: input.confidenceScore ?? null,
        apiKeyHash: apiKeyHash ?? null,
        userId,
        decidedAt,
      });

      return { success: true, decisionId };
    }),

  /**
   * GET /api/trpc/decisions.list
   * Returns paginated decision traces for the logged-in user.
   */
  list: protectedProcedure
    .input(z.object({
      agentId: z.string().optional(),
      subjectId: z.string().optional(),
      riskClassification: z.enum(riskValues).optional(),
      fromTs: z.number().optional(),
      toTs: z.number().optional(),
      limit: z.number().int().min(1).max(200).default(50),
      offset: z.number().int().min(0).default(0),
    }))
    .query(async ({ input }) => {
      return getDecisions(input);
    }),

  /**
   * GET /api/trpc/decisions.get
   * Returns a single decision trace by ID.
   */
  get: protectedProcedure
    .input(z.object({ decisionId: z.string() }))
    .query(async ({ input }) => {
      const decision = await getDecisionById(input.decisionId);
      if (!decision) throw new TRPCError({ code: "NOT_FOUND", message: "Decision not found" });
      return decision;
    }),

  /**
   * GET /api/trpc/decisions.stats
   * Returns fleet-wide decision statistics.
   */
  stats: protectedProcedure
    .query(async () => {
      return getDecisionStats();
    }),

  // ─── API Key management ────────────────────────────────────────────────────

  createApiKey: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(128) }))
    .mutation(async ({ input, ctx }) => {
      return createApiKey(ctx.user.id, input.name);
    }),

  listApiKeys: protectedProcedure
    .query(async ({ ctx }) => {
      return getApiKeysByUser(ctx.user.id);
    }),

  revokeApiKey: protectedProcedure
    .input(z.object({ keyId: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await revokeApiKey(input.keyId, ctx.user.id);
      return { success: true };
    }),
});
