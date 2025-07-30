import express from "express";
import { pool } from "../db.js";


const router = express.Router() // Skapar en express-router för att hantera HTTP-förfrågningar relaterade till prenumerationer.


// Get all subscriptions
router.get("/", async (req, res) => { // Denna route används för att hämta alla prenumerationer från databasen. 
    // req är request-objektet som innehåller information om den inkommande HTTP-förfrågan, 
    // och res är response-objektet som används för att skicka svar tillbaka till klienten.
    try {
        const result = await pool.query("SELECT * FROM subscriptions"); // Hämtar alla prenumerationer från databasen.
        // pool.query() anropar databasen och kör en SQL-fråga för att hämta alla rader från tabellen "subscriptions/prenumerationer".
        res.json(result.rows) // result.rows retunerar en array med alla prenumerationer i databasen.
    } catch (error) { // fångar upp eventuella fel under processen.
        console.error("Error fetching subscriptions:", error);
        res.status(500).json({ error: "Internal Server Error" }); // 500 är HTTP-statuskoden för "Internal Server Error". Står för att något gick fel på servern.
    }
})


// Create a new subscription
router.post("/", async (req, res) => { // Denna route används för att skapa en ny prenumeration i databasen.
    // res är response-objektet som används för att skicka svar tillbaka till klienten.
    // req är request-objektet som innehåller information om den inkommande HTTP-förfrågan.
    const { user_id, channel_id } = req.body; // Hämtar user_id och channel_id från klientens request-body.
    try { // Börjar en try-catch-sats för att hantera eventuella fel som kan uppstå.
        // Anropar pool.query() för att köra en SQL-fråga mot databasen.
        const result = await pool.query("INSERT INTO subscriptions (user_id, channel_id) VALUES ($1, $2) RETURNING *", [user_id, channel_id]);
        res.status(201).json(result.rows[0]); // Skickar tillbaka den nya prenumerationen som skapades i databasen. 201 betyder att resursen har skapats.
    } catch (error) { // Om något går fel, fångas felet upp här.
        console.error("Error creating subscription:", error);
        res.status(500).json({ error: "Internal Server Error" }); // 500 är HTTP-statuskoden för "Internal Server Error". Står för att något gick fel på servern.
    }
})


// Delete a subscription (unsubscribe user from channel)
// Params: :userId and :channelId
// Deletes the subscription entry from the database
router.delete("/:userId/:channelId", async (req, res) => { // Denna route används för att ta bort en prenumeration från databasen.
    // res är response-objektet som används för att skicka svar tillbaka till klienten.
    // req är request-objektet som innehåller information om den inkommande HTTP-förfrågan.
    // :userId och :channelId är parametrar i URL:en som används för att identifiera vilken prenumeration som ska tas bort.
    // req.params innehåller dessa parametrar.
    const { userId, channelId } = req.params;
    try { // Börjar en try-catch-sats för att hantera eventuella fel som kan uppstå.
        // Anropar pool.query() för att köra en SQL-fråga mot databasen.
        // SQL-frågan tar bort prenumerationen från tabellen "subscriptions" där user_id och channel_id matchar de angivna värdena.
        await pool.query(
            "DELETE FROM subscriptions WHERE user_id = $1 AND channel_id = $2",
            [userId, channelId] // servern tar bort prenumerationen från databasen. 
        );
        res.json({ message: "Subscription removed successfully" });
        // Skickar tillbaka ett meddelande som bekräftar att prenumerationen har tagits bort.

    } catch (error) { // Om något går fel, fångas felet upp här.
        console.error("Error deleting subscription:", error);
        res.status(500).json({ error: "Internal Server Error" }); // 500 är HTTP-statuskoden för "Internal Server Error". Står för att något gick fel på servern.
    }
});


export default router;