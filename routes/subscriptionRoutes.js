import express from "express";
import { pool } from "../db.js";


const router = express.Router()


// Get all subscriptions
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM subscriptions");
        res.json(result.rows)
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


// Create a new subscription
router.post("/", async (req, res) => {
    const { _userId, _channelId } = req.body;
    try {
        const result = await pool.query("INSERT INTO subscriptions (_userId, _channelId) VALUES ($1, $2) RETURNING *", [_userId, _channelId]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


// Delete a subscription (unsubscribe user from channel)
// Params: :userId and :channelId
// Deletes the subscription entry from the database
router.delete("/:userId/:channelId", async (req, res) => {
    const { userId, channelId } = req.params;
    try {
        await pool.query(
            "DELETE FROM subscriptions WHERE user_id = $1 AND channel_id = $2",
            [userId, channelId]
        );
        res.json({ message: "Subscription removed successfully" });
    } catch (error) {
        console.error("Error deleting subscription:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;