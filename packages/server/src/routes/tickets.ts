import { Router } from "express";
import { db } from "../db";

export const ticketRoutes = Router();

// List all tickets
ticketRoutes.get("/", async (_req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM tickets ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// Get single ticket
ticketRoutes.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tickets WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

// Create ticket
ticketRoutes.post("/", async (req, res) => {
  const { subject, sender_email, sender_name, body } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO tickets (subject, sender_email, sender_name, body, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'new', NOW(), NOW())
       RETURNING *`,
      [subject, sender_email, sender_name, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// Update ticket status
ticketRoutes.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["new", "in_progress", "on_hold", "closed"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  try {
    const result = await db.query(
      "UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});
