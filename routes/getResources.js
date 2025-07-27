import { pool } from "../db.js";
import express from "express";

const router = express.Router();



// hämta resurser
router.get("/overview", async (req, res) => {
    try {
        // Hämta alla kanaler
        const channelsResult = await pool.query(`
      SELECT id AS channel_id, name AS channel_name, owner_id
      FROM channels
    `);
        const channels = channelsResult.rows;

        for (let channel of channels) {
            // Prenumeranter
            const subsResult = await pool.query(`
        SELECT u.id AS user_id, u.username
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        WHERE s.channel_id = $1
      `, [channel.channel_id]);
            channel.subscribers = subsResult.rows;

            // Meddelanden
            const messagesResult = await pool.query(`
        SELECT m.id AS message_id, m.content, m.user_id, u.username, m.created_at
        FROM messages m
        JOIN users u ON m.user_id = u.id
        JOIN message_channels mc ON mc.message_id = m.id
        WHERE mc.channel_id = $1
        ORDER BY m.created_at DESC
      `, [channel.channel_id]);
            channel.messages = messagesResult.rows;
        }

        res.json(channels);
    } catch (error) {
        console.error("Error in /channels/overview:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;