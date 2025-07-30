import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Skapa användare
router.post("/", async (req, res) => { // När en klient skickar en POST-förfrågan hit, körs den här funktionen.
    // Används för att skapa en ny användare i databasen.

    const { username, content } = req.body; // Hämtar ut username och content från klientens request-body
// Denna här ska sparas i databasen som en ny användare.

    try { // Börjar en try-catch-sats för att hantera eventuella fel som kan uppstå
        const result = await pool.query( 
            // SQL-frågan lägger till en ny användare i tabellen "users"
            "INSERT INTO users (username, created_at, content) VALUES ($1, NOW(), $2) RETURNING *;",
            [username, content] // servern sparar användaren i databasen och svarar med datan direkt med tex username mm.
        );
        res.status(201).json(result.rows[0]); // Skickar ett JSON-svar tillbaka till klienten med den nya användaren. 201 betyder att resursen har skapats och att det gick bra.
    } catch (error) { // fångar upp eventuella fel under processen.
        console.error("Error creating user:", error.message, error.stack); 
        res.status(500).json({ error: "Internal Server Error" }); // 500 är HTTP-statuskoden för "Internal Server Error". Står för att något gick fel på servern.
    }
});


// GET /users – Hämta alla användare
router.get("/", async (req, res) => { // Denna route används för att hämta alla användare från databasen.
    try { // try-catch-sats för att hantera eventuella fel.
        const result = await pool.query("SELECT * FROM users"); // hämtar alla rader och kolumner från tabellen users
        res.json(result.rows); //result.rows returnerar en array med alla användare i databasen.
    } catch (error) { // Om något går fel, fångas det här felet upp.
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" }); // 500 är HTTP-statuskoden för "Internal Server Error".Står för att något gick fel på servern.
    }
});




// hämtar alla kanaler som en användare är prenumerer på
// Params: :id = user ID

router.get("/:id/channels", async (req, res) => {
    const userId = req.params.id;
    try { // try-catch-sats för att hantera eventuella fel.
        const result = await pool.query(`
      SELECT channels.*
      FROM channels
      JOIN subscriptions ON channels.id = subscriptions.channel_id
      WHERE subscriptions.user_id = $1

    `, [userId]); // Retunerar: En lista med kanaler som användaren är prenumererad på.
        res.json(result.rows); //result.rows är en array med alla kanaler som användaren är prenumererad på.
    } catch (error) { // Om något går fel, fångas det här felet upp.

    `, [userId]);
        res.json(result.rows);
    } catch (error) {

        console.error("Error fetching user's channels:", error);
        res.status(500).json({ error: "Internal Server Error" }); // 500 är HTTP-statuskoden för "Internal Server Error". Står för att något gick fel på servern.
    }
});



export default router;
