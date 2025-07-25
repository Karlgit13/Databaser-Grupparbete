import express from "express";
import { getAllUsers, createUser } from "../models/userModels.js";
import { pool } from "../db.js";

const router = express.Router();

// GET all users
router.post("/", async (req, res) => {
    const { username, content } = req.body;
    try {
        const newUser = await createUser(username, content);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST create new user
// export async function createUser(username, content) {
//     try {
//         const query = `
//         INSERT INTO users (username, created_at, content)
//         VALUES ($1, NOW(), $2)
//         RETURNING *;
//         `;
//         const values = [username, content];
//         const result = await pool.query(query, values);
//         return result.rows[0];
//     } catch (error) {
//         console.error("Error creating user:", error);
//         throw new Error("Internal Server Error");
//     }
// }


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
    } catch (error) {
        console.error("Error fetching user's channels:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;
