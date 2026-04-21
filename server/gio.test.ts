import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the LLM module before importing the router
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    id: "test-id",
    created: Date.now(),
    model: "gemini-2.5-flash",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: "The Agent Readiness Score measures how prepared your data is for AI agents across 5 dimensions.",
        },
        finish_reason: "stop",
      },
    ],
  }),
}));

import { registerGioRoutes } from "./gioRouter";
import express from "express";
import request from "supertest";

function createTestApp() {
  const app = express();
  app.use(express.json());
  registerGioRoutes(app);
  return app;
}

describe("POST /api/gio/chat", () => {
  it("returns a reply for a valid message", async () => {
    const app = createTestApp();
    const res = await request(app)
      .post("/api/gio/chat")
      .send({ messages: [{ role: "user", content: "What is the Agent Readiness Score?" }] });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("reply");
    expect(typeof res.body.reply).toBe("string");
    expect(res.body.reply.length).toBeGreaterThan(0);
  });

  it("returns 400 when messages array is missing", async () => {
    const app = createTestApp();
    const res = await request(app)
      .post("/api/gio/chat")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when messages array is empty", async () => {
    const app = createTestApp();
    const res = await request(app)
      .post("/api/gio/chat")
      .send({ messages: [] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("handles multi-turn conversation", async () => {
    const app = createTestApp();
    const res = await request(app)
      .post("/api/gio/chat")
      .send({
        messages: [
          { role: "user", content: "Tell me about data quality" },
          { role: "assistant", content: "Data quality is about accuracy and completeness." },
          { role: "user", content: "How does Precisely help with that?" },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("reply");
  });
});
