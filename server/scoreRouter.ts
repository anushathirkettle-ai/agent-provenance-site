/**
 * PRECISELY — Agent Readiness Score Router
 * Accepts CSV upload, analyses data quality across 5 dimensions,
 * returns a detailed Agent Readiness Score using LLM analysis
 */
import { Router, Request, Response } from "express";
import { invokeLLM } from "./_core/llm";
import multer, { FileFilterCallback } from "multer";
import type { Request as ExpressRequest } from "express";

interface MulterRequest extends ExpressRequest {
  file?: Express.Multer.File;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req: ExpressRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are accepted"));
    }
  },
});

const SCORE_SYSTEM_PROMPT = `You are Precisely's Agent Readiness Scoring Engine. You analyse CSV data samples and score them across 5 dimensions that determine how ready the data is for AI agents.

The 5 dimensions are:
1. **Completeness** (0-100): What % of fields are populated? Missing values, nulls, empty strings.
2. **Accuracy** (0-100): Are values plausible and correctly formatted? Check emails, phones, addresses, dates, numeric ranges.
3. **Consistency** (0-100): Are formats consistent across rows? Mixed date formats, inconsistent capitalisation, varying address formats.
4. **Freshness** (0-100): Are there date/timestamp fields? How recent is the data? Stale data confuses agents.
5. **Context** (0-100): Does the data have enough contextual fields for an agent to act on it? IDs, categories, geo fields, relationship fields.

For each dimension, you MUST:
- Give a score from 0-100
- Give a 1-sentence finding (what you found)
- Give a 1-sentence fix (what Precisely can do about it)

Return ONLY valid JSON in this exact format:
{
  "overall": <number 0-100>,
  "dimensions": {
    "completeness": { "score": <number>, "finding": "<string>", "fix": "<string>" },
    "accuracy": { "score": <number>, "finding": "<string>", "fix": "<string>" },
    "consistency": { "score": <number>, "finding": "<string>", "fix": "<string>" },
    "freshness": { "score": <number>, "finding": "<string>", "fix": "<string>" },
    "context": { "score": <number>, "finding": "<string>", "fix": "<string>" }
  },
  "topIssue": "<string — the single most critical issue in one sentence>",
  "rowsAnalysed": <number>,
  "columnsFound": <number>
}

Be honest and realistic. Most real-world data scores between 30-70. Do not give inflated scores.`;

function parseCsvSample(csvText: string, maxRows = 50): { headers: string[]; rows: string[][]; totalRows: number } {
  const lines = csvText.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return { headers: [], rows: [], totalRows: 0 };

  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const dataLines = lines.slice(1);
  const totalRows = dataLines.length;
  const sampleLines = dataLines.slice(0, maxRows);

  const rows = sampleLines.map(line => {
    // Simple CSV parse (handles basic quoted fields)
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === "," && !inQuotes) { result.push(current.trim()); current = ""; }
      else { current += ch; }
    }
    result.push(current.trim());
    return result;
  });

  return { headers, rows, totalRows };
}

function buildDataSummary(headers: string[], rows: string[][], totalRows: number): string {
  const colStats = headers.map((header, colIdx) => {
    const values = rows.map(r => r[colIdx] ?? "").filter(v => v !== "");
    const empty = rows.length - values.length;
    const unique = new Set(values).size;
    const sample = values.slice(0, 5).join(", ");
    return `Column "${header}": ${values.length}/${rows.length} populated (${empty} empty), ${unique} unique values. Sample: [${sample}]`;
  });

  return `Dataset summary:
- Total rows: ${totalRows} (analysing sample of ${rows.length})
- Columns (${headers.length}): ${headers.join(", ")}

Per-column stats:
${colStats.join("\n")}`;
}

export function registerScoreRoutes(app: ReturnType<typeof Router> | any) {
  app.post("/api/score/csv", upload.single("file"), async (req: MulterRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file uploaded" });
      }

      const csvText = req.file!.buffer.toString("utf-8");
      const { headers, rows, totalRows } = parseCsvSample(csvText, 50);

      if (headers.length === 0 || rows.length === 0) {
        return res.status(400).json({ error: "CSV appears to be empty or invalid" });
      }

      const dataSummary = buildDataSummary(headers, rows, totalRows);

      const result = await invokeLLM({
        messages: [
          { role: "system", content: SCORE_SYSTEM_PROMPT },
          { role: "user", content: `Please score this dataset for Agent Readiness:\n\n${dataSummary}` },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "agent_readiness_score",
            strict: true,
            schema: {
              type: "object",
              properties: {
                overall: { type: "number" },
                dimensions: {
                  type: "object",
                  properties: {
                    completeness: {
                      type: "object",
                      properties: {
                        score: { type: "number" },
                        finding: { type: "string" },
                        fix: { type: "string" },
                      },
                      required: ["score", "finding", "fix"],
                      additionalProperties: false,
                    },
                    accuracy: {
                      type: "object",
                      properties: {
                        score: { type: "number" },
                        finding: { type: "string" },
                        fix: { type: "string" },
                      },
                      required: ["score", "finding", "fix"],
                      additionalProperties: false,
                    },
                    consistency: {
                      type: "object",
                      properties: {
                        score: { type: "number" },
                        finding: { type: "string" },
                        fix: { type: "string" },
                      },
                      required: ["score", "finding", "fix"],
                      additionalProperties: false,
                    },
                    freshness: {
                      type: "object",
                      properties: {
                        score: { type: "number" },
                        finding: { type: "string" },
                        fix: { type: "string" },
                      },
                      required: ["score", "finding", "fix"],
                      additionalProperties: false,
                    },
                    context: {
                      type: "object",
                      properties: {
                        score: { type: "number" },
                        finding: { type: "string" },
                        fix: { type: "string" },
                      },
                      required: ["score", "finding", "fix"],
                      additionalProperties: false,
                    },
                  },
                  required: ["completeness", "accuracy", "consistency", "freshness", "context"],
                  additionalProperties: false,
                },
                topIssue: { type: "string" },
                rowsAnalysed: { type: "number" },
                columnsFound: { type: "number" },
              },
              required: ["overall", "dimensions", "topIssue", "rowsAnalysed", "columnsFound"],
              additionalProperties: false,
            },
          },
        },
        maxTokens: 1024,
      });

      const content = result.choices?.[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "Scoring engine returned no result" });
      }

      const scoreData = typeof content === "string" ? JSON.parse(content) : content;
      return res.json(scoreData);
    } catch (err: any) {
      console.error("[Score CSV error]", err);
      if (err.message?.includes("Only CSV")) {
        return res.status(400).json({ error: "Only CSV files are accepted" });
      }
      return res.status(500).json({ error: "Scoring failed. Please try again." });
    }
  });
}
