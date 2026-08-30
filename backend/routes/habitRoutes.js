import express from "express"
import {addHabit, deleteGroupHabitById, getAllHabits, getGroupHabitById, getGroupHabits, habitAggregate, updateGroupHabitById, uploadHabitResource, assignedHabitsAggregate} from "../controllers/habitController.js"
import authenticateUser from "../middlewares/authenticateUser.js"
import authorizeUser from "../middlewares/authorizeUser.js"
import upload from "../middlewares/upload.js"
const router = express.Router()

router.post("/habits" , authenticateUser,authorizeUser(["coach"]),addHabit)
router.get("/habits/habitAggregate", authenticateUser,authorizeUser(["coach","member"]) ,habitAggregate)
router.get("/assignedHabitsAggregate", authenticateUser, authorizeUser(["member"]), assignedHabitsAggregate)
router.get("/habits", authenticateUser,authorizeUser(["coach","member"]), getAllHabits)
router.get("/groups/habits/:id", authenticateUser,authorizeUser(["coach","member"]), getGroupHabits)
router.get("/habits/:id", authenticateUser, authorizeUser(["coach","member"]),getGroupHabitById)
router.put("/habits/:id", authenticateUser,authorizeUser(["coach"]), updateGroupHabitById)
router.delete("/habits/:id", authenticateUser,authorizeUser(["coach"]), deleteGroupHabitById)
router.post("/habits/resource/:id",authenticateUser,upload.single("resource"),uploadHabitResource)

export default router;