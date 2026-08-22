import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import {  currentStreak, habitProgressAggregate, longestStreak, markHabitComplete, memberDailyProgress, memberMonthlyProgress, memberWeeklyProgress } from "../controllers/habitProgressController.js"
import authorizeUser from "../middlewares/authorizeUser.js"
const router = express.Router()

router.post("/progress", authenticateUser,authorizeUser(["member"]), markHabitComplete)
router.get("/progress/aggregate",authenticateUser,authorizeUser(["coach","member"]) ,habitProgressAggregate)
router.get("/progress/daily", authenticateUser,authorizeUser(["coach","member"]),memberDailyProgress)
router.get("/progress/weekly", authenticateUser,authorizeUser(["coach","member"]), memberWeeklyProgress)
router.get("/progress/monthly", authenticateUser, authorizeUser(["coach","member"]),memberMonthlyProgress)
router.get("/progress/currentStreak" , authenticateUser,authorizeUser(["coach","member"]), currentStreak)
router.get("/progress/longestStreak" , authenticateUser, authorizeUser(["coach","member"]),longestStreak)
export default router;