import express from "express"
import { addGroup, deleteGroupById, groupById, listGroups, searchingSortingPagination, updateGroupById } from "../controllers/groupController.js"
import authenticateUser from "../middlewares/authenticateUser.js"
import authorizeUser from "../middlewares/authorizeUser.js"

const router = express.Router()

router.post("/groups", authenticateUser,authorizeUser(["coach"]),addGroup)
router.get("/groupAggregation", authenticateUser, authorizeUser(["coach","member"]),searchingSortingPagination)
router.get("/groups", authenticateUser,authorizeUser(["coach","member"]),listGroups)
router.get("/groups/:id", authenticateUser, authorizeUser(["coach","member"]),groupById)
router.put("/groups/:id", authenticateUser,authorizeUser(["coach"]), updateGroupById)
router.delete("/groups/:id", authenticateUser,authorizeUser(["coach"]), deleteGroupById)


export default router