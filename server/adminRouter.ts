import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  addToWaitlist,
  getWaitlist,
  getWaitlistCount,
  getAuditSubmissions,
  getAuditCount,
  getAllUsers,
  getUserCount,
} from "./db";
import { notifyOwner } from "./_core/notification";

export const adminRouter = router({
  // ─── Public: waitlist join ─────────────────────────────────────────────────
  joinWaitlist: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      email: z.string().email().max(320),
      company: z.string().max(255).optional(),
      role: z.string().max(255).optional(),
      agentCount: z.string().max(64).optional(),
      source: z.string().max(64).optional(),
    }))
    .mutation(async ({ input }) => {
      await addToWaitlist({
        name: input.name,
        email: input.email,
        company: input.company ?? null,
        role: input.role ?? null,
        agentCount: input.agentCount ?? null,
        source: input.source ?? "website",
      });
      // Notify owner
      try {
        await notifyOwner({
          title: `New waitlist signup: ${input.name}`,
          content: `**Name:** ${input.name}\n**Email:** ${input.email}\n**Company:** ${input.company ?? "—"}\n**Role:** ${input.role ?? "—"}\n**Agent count:** ${input.agentCount ?? "—"}`,
        });
      } catch {
        // Non-fatal
      }
      return { success: true };
    }),

  // ─── Admin: dashboard stats ────────────────────────────────────────────────
  getDashboardStats: adminProcedure
    .query(async () => {
      const [waitlistCount, auditCount, userCount] = await Promise.all([
        getWaitlistCount(),
        getAuditCount(),
        getUserCount(),
      ]);
      return { waitlistCount, auditCount, userCount };
    }),

  // ─── Admin: waitlist list ──────────────────────────────────────────────────
  getWaitlist: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(500).default(200) }))
    .query(async ({ input }) => {
      return getWaitlist(input.limit);
    }),

  // ─── Admin: audit submissions list ────────────────────────────────────────
  getAuditSubmissions: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(500).default(200) }))
    .query(async ({ input }) => {
      return getAuditSubmissions(input.limit);
    }),

  // ─── Admin: all users ─────────────────────────────────────────────────────
  getAllUsers: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(500).default(200) }))
    .query(async ({ input }) => {
      return getAllUsers(input.limit);
    }),
});
