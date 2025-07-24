import express from "express";
import { pool } from "../db.js";
import { getAllUsers } from "../models/userModels.js";

const router = express.Router();


// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users)
    } catch (error) {
        console.error("error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// Create a new user
router.post("/", async (req, res) => {
    const { name, email } = req.body
    try {
        const newUser = await createUser(name, email)
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
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
    } catch (error) {
        console.error("Error fetching user's channels:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;
