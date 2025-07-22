import express from "express";
import { pool } from "../db.js";


const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM messages");
        res.json(response.rows);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;