import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Hämta alla meddelanden
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Skapa nytt meddelande (endast om användaren är prenumerant på kanalen)
router.post("/", async (req, res) => {
  const { user_id, channel_id, content } = req.body;

  try {
    // Kontrollera att användaren är prenumerant
    const subCheck = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND channel_id = $2`,
      [user_id, channel_id]
    );

    if (subCheck.rowCount === 0) {
      return res.status(403).json({ error: "User is not subscribed to the channel" });
    }

    // Lägg till meddelande
    const result = await pool.query(
      `INSERT INTO messages (user_id, channel_id, content, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [user_id, channel_id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
