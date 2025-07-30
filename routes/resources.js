import { pool } from "../db.js";
import express from "express";

const router = express.Router();


// Denna route används för att hämta en översikt över alla kanaler, deras prenumeranter och meddelanden.
// hämta resurser
router.get("/overview", async (req, res) => {
    // res är response-objektet som används för att skicka svar tillbaka till klienten.
    // req är request-objektet som innehåller information om den inkommande HTTP-förfrågan.
    try { // Börjar en try-catch-sats för att hantera eventuella fel som kan uppstå.
        // Hämta alla kanaler
        const channelsResult = await pool.query(` 
      SELECT id AS channel_id, name AS channel_name, owner_id
      FROM channels
    `);
        const channels = channelsResult.rows; // channelsResult.rows är en array med alla kanaler i databasen.

        for (let channel of channels) { // Loopar igenom varje kanal för att hämta prenumeranter och meddelanden.

            // Hämtar alla användare som prenumererar på den aktuella kanalen.
            const subsResult = await pool.query(`
        SELECT u.id AS user_id, u.username
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        WHERE s.channel_id = $1
      `, [channel.channel_id]); // channel.channel_id är ID:t för den aktuella kanalen.
            channel.subscribers = subsResult.rows; // subscribers är en array med alla användare som prenumererar på den aktuella kanalen.

            // Hämtar alla meddelanden som är kopplade till den aktuella kanalen.
            const messagesResult = await pool.query(`
        SELECT m.id AS message_id, m.content, m.user_id, u.username, m.created_at
        FROM messages m
        JOIN users u ON m.user_id = u.id
        JOIN message_channels mc ON mc.message_id = m.id
        WHERE mc.channel_id = $1
        ORDER BY m.created_at DESC
      `, [channel.channel_id]); //channel.channel_id är ID:t för den aktuella kanalen.
            channel.messages = messagesResult.rows;// messages är en array med alla meddelanden som är kopplade till den aktuella kanalen.
        }

        res.json(channels); // Skickar tillbaka en JSON-array med alla kanaler, deras prenumeranter och meddelanden.
    } catch (error) { // Om något går fel, fångas det här felet upp.
        console.error("Error in /channels/overview:", error);
        res.status(500).json({ error: "Internal Server Error" }); // 500 är HTTP-statuskoden för "Internal Server Error". Står för att något gick fel på servern.
    }
});


// DELETE /channels/:id – Ta bort en kanal och dess beroenden
router.delete("/:id"), async (req, res) => {
    const channelId = parseInt(req.params.id);
    try {
        // 1. Ta bort message_channels

        await pool.query("DELETE FROM message_channels WHERE channel_id = $1", [channelId]);

        // 2. Ta bort subscriptions
        await pool.query("DELETE FROM subscriptions WHERE channel_id = $1", [channelId]);

        // 3. Ta bort kanalen
        const result = await pool.query("DELETE FROM channels WHERE id = $1 RETURNING *", [channelId]);


        if (result.rowCount === 0) { // Om ingen rad togs bort, betyder det att kanalen inte finns.
            // Returnera 404 Not Found om kanalen inte hittades. 
            return res.status(404).json({ error: "Kanalen kunde inte hittas" });
        }

        res.json({ message: "Kanal + tillhörande resurser har raderats." }); // Skickar tillbaka ett meddelande som bekräftar att kanalen och dess resurser har tagits bort.
        // 200 är HTTP-statuskoden för "OK". Står för att allt gick bra och att resursen har tagits bort.
    } catch (error) { // Fångar upp eventuella fel under processen.
        console.error("Error deleting channel fully:", error);
        res.status(500).json({ error: "Internal Server Error" }); // 500 är HTTP-statuskoden för "Internal Server Error". Står för att något gick fel på servern.
    }
}


export default router;