import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import channelRoutes from "./routes/channelRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import subscriptionRoutes from "./routes/subscriptionRoutes.js"
import getResources from "./routes/getResources.js"

dotenv.config()
const app = express()
app.use(express.json())


//routes
app.use("/users", userRoutes)
app.use("/channels", channelRoutes)
app.use("/messages", messageRoutes)
app.use("/subscriptions", subscriptionRoutes)
app.use("/resources", getResources)


// server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})