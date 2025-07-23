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
}); s

export default router;