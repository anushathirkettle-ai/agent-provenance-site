import express, { Router, type Express } from "express";
import { notifyOwner } from "./_core/notification";

export function registerDemoRoutes(app: Express) {
  const router = Router();

  // POST /api/demo/request — receives Book a Demo form submissions
  router.post("/request", async (req, res) => {
    try {
      const { name, email, company, role, message } = req.body as {
        name?: string;
        email?: string;
        company?: string;
        role?: string;
        message?: string;
      };

      if (!name || !email || !company) {
        res.status(400).json({ error: "Missing required fields: name, email, company" });
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: "Invalid email address" });
        return;
      }

      // Send notification to owner
      const notificationContent = [
        `**New Enterprise Demo Request**`,
        ``,
        `**Name:** ${name}`,
        `**Email:** ${email}`,
        `**Company:** ${company}`,
        `**Role:** ${role || "Not specified"}`,
        `**Message:** ${message || "No message provided"}`,
        ``,
        `Submitted at: ${new Date().toISOString()}`,
      ].join("\n");

      await notifyOwner({
        title: `Demo request from ${name} at ${company}`,
        content: notificationContent,
      });

      res.json({ success: true, message: "Demo request received" });
    } catch (err) {
      console.error("[Demo] Error processing request:", err);
      res.status(500).json({ error: "Failed to process demo request" });
    }
  });

  app.use("/api/demo", router);
}
