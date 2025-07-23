// usermodels.js

import { pool } from "../db.js";


//skapa användare
export async function createUser(name, email) {
    try {
        const query = `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
        RETURNING *;
        `;
        const values = [name, email]
        const result = await pool.query(query, values)
        return result.rows[0];
    } catch (error) {
        console.error("Error creating user:", error)
        throw new Error("Internal Server Error");
    }
}

//hämta alla användare
export async function getAllUsers() {
    try {
        const result = await pool.query("SELECT * FROM users")
        return result.rows;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Internal Server Error");
    }
}

// hämta användare med id
export async function getUserById(id) {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0 && null) {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error("Internal Server Error");
    }
}
