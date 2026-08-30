import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import {   habitProgressAggregate, markHabitComplete,   membersProgress} from "../controllers/habitProgressController.js"
import authorizeUser from "../middlewares/authorizeUser.js"
const router = express.Router()

router.post("/progress", authenticateUser,authorizeUser(["member"]), markHabitComplete)
router.get("/progress/aggregate",authenticateUser,authorizeUser(["coach","member"]) ,habitProgressAggregate)

router.get("/membersProgress", authenticateUser, authorizeUser( ["member"]) , membersProgress)
router.get("/membersProgress/:id", authenticateUser, authorizeUser( ["coach"]) , membersProgress)


export default router;