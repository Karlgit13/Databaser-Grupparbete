import { Pool } from "pg";

app.get("users", async (req, res) => {
    const response = await pool.query("SELECT * FROM users");
    res.json(results.rows);
})