import express from "express";
import { pool } from "../db.js";

const router = express.Router()


// Get all channels
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM channels");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})




// Create a new channel
router.post("/", async (req, res) => {
    const { name, owner_id } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO channels (name, owner_id) VALUES ($1, $2) RETURNING *`,
            [name, owner_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating channel:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Delete a channel by its ID
router.delete("/:id", async (req, res) => {
    const channelId = req.params.id;
    try {
        await pool.query("DELETE FROM channels WHERE id = $1", [channelId]);
        res.json({ message: "Channel deleted successfully" });
    } catch (error) {
        console.error("Error deleting channel:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// update a channel's name
router.patch("/:id", async (req, res) => {
    const channelId = req.params.id;
    const { name } = req.body;

    try {
        const result = await pool.query(
            "UPDATE channels SET name = $1 WHERE id = $2 RETURNING *",
            [name, channelId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Kanal kunde inte hittas" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating channel:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default router;