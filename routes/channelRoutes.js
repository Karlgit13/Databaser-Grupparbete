import express from "express";
import { pool } from "../db.js";

const router = express.Router() // Här är huvudrouter för kanaler


// Hämta alla kanaler
router.get("/", async (req, res) => {
    
    try { 
        const result = await pool.query("SELECT * FROM channels");
        // Använder pool.query för att skicka en SQL-fråga till en PostgreSQL-databas.
        // await används för att vänta på att databasen ska svara innan koden fortsätter.
        // result innehåller svaret från databasen.
        res.json(result.rows);
    } catch (error) { // om det uppstår fel under processen så fångas det här felet
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }

})

// Skapa en ny kanal
router.post("/", async (req, res) => {
    const { name, owner_id } = req.body; // Här hämtas namnet och ägarens ID från begäran.
    try { // startar en try-catch block för att hantera eventuella fel
        const result = await pool.query( // Här används pool.query för att skicka en SQL-fråga till databasen.
            `INSERT INTO channels (name, owner_id) VALUES ($1, $2) RETURNING *`,
            [name, owner_id]
        );
        res.status(201).json(result.rows[0]); // Om allt går bra, returneras den skapade kanalen med status 201 (Created).
    } catch (error) { // Om det uppstår fel under processen så fångas det här felet
        console.error("Error creating channel:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Tar bort en kanal.
// Denna rutt tar bort en kanal från databasen baserat på dess ID som skickas i URL:en.
// Om kanalen tas bort och allt går bra, då returneras ett meddelande som bekräftar borttagningen.
router.delete("/:id", async (req, res) => {
    const channelId = req.params.id; // Hämtar kanalens ID från URL-parametrarna
    try {
        await pool.query("DELETE FROM channels WHERE id = $1", [channelId]);
        res.json({ message: "Channel deleted successfully" });
    } catch (error) { // Om det uppstår fel under borttagningen så fångas det här felet
        console.error("Error deleting channel:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Uppdatera en kanal.
// Denna rutt uppdaterar en kanal i databasen baserat på dess ID som skickas i URL:en.
// Om kanalen uppdateras och allt går bra, då returneras den uppdaterade kanalen.
router.patch("/:id", async (req, res) => { // Skapar en PATCH-endpoint på vägen /:id, där :id är kanalens ID.
    const channelId = parseInt(req.params.id, 10); // Hämtar det nya kanalnamnet från klientens request body.
    const { name } = req.body;

    if (isNaN(channelId)) { // Kontrollerar om channelId inte är ett nummer.
        return res.status(400).json({ error: "Ogiltigt ID" }); // Om det inte är ett nummer, returneras ett felmeddelande med status 400 (Bad Request).
    }

    try { // Startar en try-catch-sats för att hantera fel.
        const result = await pool.query(
            "UPDATE channels SET name = $1 WHERE id = $2 RETURNING *", // uppdaterar kanalens namn i databasen.
            [name, channelId] 
        );

        if (result.rowCount === 0) { // om ingen rad hittades med det angivna ID:t, returneras ett felmeddelande.
            return res.status(404).json({ error: "Kanal kunde inte hittas" });
        }

        res.json(result.rows[0]);
    } catch (error) { // Om det uppstår fel under uppdateringen så fångas det här felet
        console.error("Error updating channel:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




export default router;