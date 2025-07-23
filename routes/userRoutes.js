import express from "express";
import { pool } from "../db.js";
import { getAllUsers } from "../models/userModels.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM users")
        res.json(response.rows)
    } catch (error) {
        console.error("error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;