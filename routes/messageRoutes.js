import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Hämta alla meddelanden
router.get("/", async (req, res) => {
  try { // Använder pool.query för att hämta alla meddelanden från databasen.
    const result = await pool.query("SELECT * FROM messages");
    res.json(result.rows);
  } catch (error) { // Fångar upp eventuella fel under processen.
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Skapa nytt meddelande (endast om användaren är prenumerant på kanalen)
router.post("/", async (req, res) => {
  const { user_id, channel_id, content } = req.body;

  try {
    // Kontrollerar att användaren är prenumerant

    // Kontrollera att användaren prenumererar på kanalen
    const subCheck = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND channel_id = $2`,
      [user_id, channel_id]
    );

    if (subCheck.rows.length === 0) { // Om användaren inte är prenumerant, returneras ett felmeddelande.
      return res.status(403).json({ error: "Användaren prenumererar inte på denna kanal" });
    }

    // Skapa meddelandet
    const result = await pool.query( // Skapar ett nytt meddelande i databasen.
      `INSERT INTO messages (user_id, content, created_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [user_id, content] // Använder NOW() för att man ska få meddelandets skapelsedatum automatiskt.
    );

    const messageId = result.rows[0].id; // Hämtar det skapade meddelandet från resultatet.

    // Koppla meddelandet till kanalen
    await pool.query( // Skapar en koppling mellan meddelandet och kanalen i message_channels-tabellen.
      `INSERT INTO message_channels (message_id, channel_id) VALUES ($1, $2)`,
      [messageId, channel_id] // Använder message.id för att man ska kunna referera till det skapade meddelandet.
    );

    res.status(201).json(result.rows[0]);
  } catch (error) { // Fångar upp eventuella fel under processen.
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Hämta alla meddelanden i en specifik kanal.
router.get("/channel/:id", async (req, res) => {
  const channelId = req.params.id; // Hämtar kanalens ID från URL-parametrarna

  try {
    const result = await pool.query( // Hämtar alla meddelanden som är kopplade till den specifika kanalen.
      `
      SELECT m.id AS message_id, m.content, m.created_at, m.user_id, u.username
      FROM messages m
      JOIN message_channels mc ON mc.message_id = m.id
      JOIN users u ON u.id = m.user_id
      WHERE mc.channel_id = $1
      ORDER BY m.created_at DESC
      `,
      [channelId] // Använder kanalens ID för att filtrera meddelandena.
    );

    res.json(result.rows); // Returnerar meddelandena som JSON.
  } catch (error) { // Fångar upp eventuella fel under processen.
    console.error("Error fetching messages for channel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Hämta meddelanden för en specifik kanal
router.get("/channels/:id/messages", async (req, res) => {
  const channelId = parseInt(req.params.id); // Hämtar kanalens ID från URL-parametrarna
  try {
    const result = await pool.query(`
            SELECT m.*
            FROM messages m
            JOIN message_channels mc ON m.id = mc.message_id
            WHERE mc.channel_id = $1
            ORDER BY m.created_at DESC
        `, [channelId]); // Hämtar alla meddelanden som är kopplade till den specifika kanalen.

    res.json(result.rows);
  } catch (error) { // Fångar upp eventuella fel under processen.
    console.error("Error fetching messages for channel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Tar bort ett meddelande baserat på dess ID
// Denna rutt tar bort ett meddelande från databasen baserat på dess ID
router.delete("/:id", async (req, res) => {
  const messageId = parseInt(req.params.id); // Hämtar meddelandets ID från URL-parametrarna

  try {
    await pool.query("DELETE FROM message_channels WHERE message_id = $1", [messageId]); // Tar bort meddelandet från databasen.

    const result = await pool.query("DELETE FROM messages WHERE id = $1 RETURNING *", [messageId]); // Använder RETURNING * för att få tillbaka det raderade meddelandet.

    if (result.rowCount === 0) { // Om ingen rad raderades, returneras ett felmeddelande.
      return res.status(404).json({ error: "Meddelande hittades inte" });
    }

    res.json({ message: "Meddelande borttaget", deleted: result.rows[0] });
  } catch (error) { // Fångar upp eventuella fel under processen.
    console.error("Fel vid radering av meddelande:", error);
    res.status(500).json({ error: "Serverfel vid radering" });
  }
});

// PATCH /messages/:id – uppdatera ett meddelande
router.patch("/:id", async (req, res) => { // Skapar en PATCH-endpoint på vägen /:id, där :id är meddelandets ID.
  const messageId = parseInt(req.params.id, 10);
  const { content } = req.body; // Hämtar det nya meddelandet från klientens request body.

  if (isNaN(messageId)) { // Kontrollerar om messageId är ett nummer.
    return res.status(400).json({ error: "Ogiltigt ID" }); // Om det inte är ett nummer, returneras ett felmeddelande med status 400 (Bad Request).
  }

  try {
    const result = await pool.query( // Uppdaterar meddelandets innehåll i databasen.
      `UPDATE messages SET content = $1 WHERE id = $2 RETURNING *`, // Använder RETURNING * för att få tillbaka det uppdaterade meddelandet.
      [content, messageId] // Använder messageId för att referera till det meddelande som ska uppdateras.
    );

    if (result.rowCount === 0) { // Om ingen rad uppdaterades, returneras ett felmeddelande.
      return res.status(404).json({ error: "Meddelandet kunde inte hittas" });
    }

    res.json(result.rows[0]);  // Returnerar det uppdaterade meddelandet som JSON.
  } catch (error) { // Fångar upp eventuella fel under processen.
    console.error("Error updating message:", error); // Loggar felet i konsolen.
    res.status(500).json({ error: "Internal Server Error" }); // Returnerar ett felmeddelande med status 500 (Internal Server Error).
  }
});





export default router;
