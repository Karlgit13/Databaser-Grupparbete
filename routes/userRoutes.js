import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Skapa användare
router.post("/", async (req, res) => {
    const { username, content } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO users (username, created_at, content) VALUES ($1, NOW(), $2) RETURNING *;",
            [username, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating user:", error.message, error.stack);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// GET /users – Hämta alla användare
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// Get all channels the user is subscribed to
// Params: :id = user ID
// Returns: array of channels the user has subscribed to
router.get("/:id/channels", async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(`
      SELECT channels.*
      FROM channels
      JOIN subscriptions ON channels.id = subscriptions.channel_id
      WHERE subscriptions.user_id = $1
    `, [userId]);
        res.json(result.rows);
        console.log(result.rows);
    } catch (error) {
        console.error("Error fetching user's channels:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// export async function getAllUsers() {
//     try {
//         const result = await pool.query("SELECT * FROM users");
//         return result.rows;
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         throw new Error("Internal Server Error");
//     }
// }


export default router;
