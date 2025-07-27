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

    // Skapa meddelandet
    const messageResult = await pool.query(
      `INSERT INTO messages (user_id, content, created_at)
       VALUES ($1, $2, NOW())
       RETURNING id, user_id, content, created_at`,
      [user_id, content]
    );

    const message = messageResult.rows[0];

    // Lägg till koppling till kanal
    await pool.query(
      `INSERT INTO message_channels (message_id, channel_id)
       VALUES ($1, $2)`,
      [message.id, channel_id]
    );

    // Lägg till channel_id till svaret
    const response = {
      ...message,
      channel_id: channel_id
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get a specific channel's messages
router.get("/channel/:id", async (req, res) => {
  const channelId = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT m.id AS message_id, m.content, m.created_at, m.user_id, u.username
      FROM messages m
      JOIN message_channels mc ON mc.message_id = m.id
      JOIN users u ON u.id = m.user_id
      WHERE mc.channel_id = $1
      ORDER BY m.created_at DESC
      `,
      [channelId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages for channel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Get all messages in a specific channel
// Params: :id = channel ID
// Returns: array of messages in the channel
router.get("/channel/:id", async (req, res) => {
  const channelId = req.params.id
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE channel_id = $1 ORDER BY created_at DESC",
      [channelId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages for channel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})



// DELETE a message by ID
// Params: :id = message ID
router.delete("/:id", async (req, res) => {
  const messageId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM messages WHERE id = $1 RETURNING *",
      [messageId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Meddelandet kunde inte hittas" });
    }

    res.status(200).json({ message: "Meddelandet har raderats" });
  } catch (error) {
    console.error("Fel vid radering av meddelande:", error);
    res.status(500).json({ error: "Serverfel vid radering" });
  }
});

// update a message by ID
router.patch("/:id", async (req, res) => {
  const messageId = req.params.id;
  const { content } = req.body;

  try {
    const result = await pool.query(
      `UPDATE messages SET content = $1 WHERE id = $2 RETURNING *`,
      [content, messageId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Meddelandet kunde inte hittas" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





export default router;
