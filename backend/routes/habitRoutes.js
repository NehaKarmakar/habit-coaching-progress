import express from "express"
import {addHabit, deleteGroupHabitById, getAllHabits, getGroupHabitById, getGroupHabits, habitAggregate, updateGroupHabitById} from "../controllers/habitController.js"
import authenticateUser from "../middlewares/authenticateUser.js"
import authorizeUser from "../middlewares/authorizeUser.js"
const router = express.Router()

router.post("/habits" , authenticateUser,authorizeUser(["coach"]),addHabit)
router.get("/habits/habitAggregate", authenticateUser,authorizeUser(["coach","member"]) ,habitAggregate)
router.get("/habits", authenticateUser,authorizeUser(["coach","member"]), getAllHabits)
router.get("/groups/habits", authenticateUser,authorizeUser(["coach","member"]), getGroupHabits)
router.get("/habits/:id", authenticateUser, authorizeUser(["coach","member"]),getGroupHabitById)
router.put("/habits/:id", authenticateUser,authorizeUser(["coach"]), updateGroupHabitById)
router.delete("/habits/:id", authenticateUser,authorizeUser(["coach"]), deleteGroupHabitById)
export default router;