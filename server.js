import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import channelRoutes from "./routes/channelRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import subscriptionRoutes from "./routes/subscriptionRoutes.js"
import resources from "./routes/Resources.js"

dotenv.config()  // Anropar config()-funktionen från dotenv-paketet för att läsa in miljövariablerna från .env-filen
const app = express() // Skapar en express-applikation för att hantera HTTP-förfrågningar och även svar.
app.use(express.json()) // En middleware-funktion. Gör så att Express automatiskt kan tolka inkommande data.
// TEX Om någon skickar en POST-förfrågan med JSON-innehåll, så kommer req.body att innehålla objektet direkt.


//routes

app.use("/users", userRoutes) // hämtar användare.
app.use("/channels", channelRoutes) // hämtar kanaler.
app.use("/messages", messageRoutes) // hämtar meddelanden.
app.use("/subscriptions", subscriptionRoutes) // hämtar prenumerationer.
app.use("/resources", resources) // hämtar resurser.

app.use("/users", userRoutes)
app.use("/channels", channelRoutes)
app.use("/", messageRoutes)
app.use("/messages", messageRoutes)
app.use("/subscriptions", subscriptionRoutes)
app.use("/resources", resources)



// server
const PORT = process.env.PORT || 5000 
app.listen(PORT, () => { // Startar servern och lyssnar på den angivna porten som i det här fallet är PORT 5000.
    console.log(`Server is running on port ${PORT}`)
}) 