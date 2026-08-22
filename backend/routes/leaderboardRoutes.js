import express from "express" 
import authenticateUser from "../middlewares/authenticateUser.js"
import { leaderBoard, leaderboardAggregate } from "../controllers/leaderboard.js"
import authorizeUser from "../middlewares/authorizeUser.js"
const router = express.Router()
router.get("/leaderboard", authenticateUser,authorizeUser(["coach","member"]), leaderBoard)
router.get("/leaderboard/leaderboardAggregate", authenticateUser, authorizeUser(["coach","member"]),leaderboardAggregate)
export default router