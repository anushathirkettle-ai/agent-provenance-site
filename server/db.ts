import { and, desc, eq, gte, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertWaitlistEntry, InsertAuditSubmission, InsertAgentDecision, InsertApiKey, users, waitlist, auditSubmissions, agentDecisions, apiKeys } from "../drizzle/schema";
import { ENV } from './_core/env';
import crypto from "crypto";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Waitlist helpers ────────────────────────────────────────────────────────

export async function addToWaitlist(entry: InsertWaitlistEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(waitlist).values(entry).onDuplicateKeyUpdate({
    set: { name: entry.name, company: entry.company, role: entry.role, agentCount: entry.agentCount },
  });
}

export async function getWaitlist(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(waitlist).orderBy(desc(waitlist.createdAt)).limit(limit);
}

export async function getWaitlistCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(waitlist);
  return result.length;
}

// ─── Audit submission helpers ────────────────────────────────────────────────

export async function saveAuditSubmission(entry: InsertAuditSubmission) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditSubmissions).values(entry);
}

export async function getAuditSubmissions(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditSubmissions).orderBy(desc(auditSubmissions.createdAt)).limit(limit);
}

export async function getAuditCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(auditSubmissions);
  return result.length;
}

// ─── User admin helpers ──────────────────────────────────────────────────────

export async function getAllUsers(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt)).limit(limit);
}

export async function getUserCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(users);
  return result.length;
}

// ─── Agent Decision helpers ──────────────────────────────────────────────────

export async function saveDecision(entry: InsertAgentDecision) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(agentDecisions).values(entry);
}

export interface DecisionFilter {
  agentId?: string;
  subjectId?: string;
  riskClassification?: string;
  fromTs?: number;
  toTs?: number;
  limit?: number;
  offset?: number;
}

export async function getDecisions(filter: DecisionFilter = {}) {
  const db = await getDb();
  if (!db) return [];
  const { agentId, subjectId, riskClassification, fromTs, toTs, limit = 100, offset = 0 } = filter;

  const conditions = [];
  if (agentId) conditions.push(eq(agentDecisions.agentId, agentId));
  if (subjectId) conditions.push(eq(agentDecisions.subjectId, subjectId));
  if (riskClassification) conditions.push(eq(agentDecisions.riskClassification, riskClassification as any));
  if (fromTs) conditions.push(gte(agentDecisions.decidedAt, fromTs));
  if (toTs) conditions.push(sql`${agentDecisions.decidedAt} <= ${toTs}`);

  const query = db.select().from(agentDecisions).orderBy(desc(agentDecisions.decidedAt)).limit(limit).offset(offset);
  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }
  return query;
}

export async function getDecisionById(decisionId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(agentDecisions).where(eq(agentDecisions.decisionId, decisionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getDecisionCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(agentDecisions);
  return result.length;
}

export async function getUniqueAgentCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.selectDistinct({ agentId: agentDecisions.agentId }).from(agentDecisions);
  return result.length;
}

export async function getDecisionStats() {
  const db = await getDb();
  if (!db) return { total: 0, highRisk: 0, agents: 0 };
  const all = await db.select().from(agentDecisions);
  const highRisk = all.filter(d => d.riskClassification === "HIGH").length;
  const agents = new Set(all.map(d => d.agentId)).size;
  return { total: all.length, highRisk, agents };
}

// ─── API Key helpers ─────────────────────────────────────────────────────────

export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const raw = `ap_live_${crypto.randomBytes(24).toString("hex")}`;
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const prefix = raw.substring(0, 12);
  return { raw, hash, prefix };
}

export function hashApiKey(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function createApiKey(userId: number, name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { raw, hash, prefix } = generateApiKey();
  await db.insert(apiKeys).values({ userId, keyHash: hash, keyPrefix: prefix, name });
  return { raw, prefix, name };
}

export async function getApiKeysByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(apiKeys).where(eq(apiKeys.userId, userId)).orderBy(desc(apiKeys.createdAt));
}

export async function validateApiKey(raw: string) {
  const db = await getDb();
  if (!db) return null;
  const hash = hashApiKey(raw);
  const result = await db.select().from(apiKeys).where(and(eq(apiKeys.keyHash, hash), eq(apiKeys.isActive, true))).limit(1);
  if (result.length === 0) return null;
  // Update last used
  await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.keyHash, hash));
  return result[0];
}

export async function revokeApiKey(keyId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(apiKeys).set({ isActive: false }).where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)));
}
