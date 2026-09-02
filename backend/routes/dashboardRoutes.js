import express from "express"
import {  coachDashboard, memberDashboard } from "../controllers/dashboardController.js"
import authenticateUser from "../middlewares/authenticateUser.js"
import authorizeUser from "../middlewares/authorizeUser.js"
const router= express.Router()

router.get("/dashboard/coach", authenticateUser,authorizeUser(["coach"]), coachDashboard)
router.get("/dashboard/member", authenticateUser, authorizeUser(["member"]),memberDashboard)


export default router