// usermodels.js
import { pool } from "../db.js";

// Skapa användare
export async function createUser(username, content) {
    try {
        const query = `
        INSERT INTO users (username, created_at, content)
        VALUES ($1, NOW(), $2)
        RETURNING *;
        `;
        const values = [username, content];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating user:", error.message, error.stack);
        throw new Error("Internal Server Error");
    }
}


// Hämta alla användare
export async function getAllUsers() {
    try {
        const result = await pool.query("SELECT * FROM users");
        return result.rows;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Internal Server Error");
    }
}

// Hämta användare via ID
export async function getUserById(id) {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error("Internal Server Error");
    }
}
