import { startCronJobs } from "./utilis/cronJobs.js";
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import configureDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import groupRoutes from "./routes/groupRoutes.js"
import groupEnrollmentRoutes from "./routes/groupEnrollmentRoutes.js"
import habitRoutes from "./routes/habitRoutes.js"
import habitProgressRoutes from "./routes/habitProgressRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import leaderboardRoutes from "./routes/leaderboardRoutes.js"
import memberRoutes from "./routes/memberRoute.js"
dotenv.config()

const app= express()
configureDB


app.use(cors())
app.use(express.json())
app.get("/" , (req, res) => {
    res.json(" welcome to the habit coaching and progress tracking system ")
})

app.use("/api/auth",userRoutes)
app.use("/api", groupRoutes)
app.use("/api", groupEnrollmentRoutes)
app.use("/api", habitRoutes)
app.use("/api", habitProgressRoutes)
app.use("/api",dashboardRoutes)
app.use("/api", leaderboardRoutes)
app.use("/api", memberRoutes)


app.listen(process.env.PORT, () => {
    console.log("server is running")
})
startCronJobs();

