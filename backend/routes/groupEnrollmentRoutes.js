import express from "express"
import { addMember, deleteMember, groupEnrollmentAggregate, groupMembers, memberGroups,memberGroupsAggregate  } from "../controllers/groupEnrollmentController.js"
import authenticateUser from "../middlewares/authenticateUser.js"
import authorizeUser from "../middlewares/authorizeUser.js"

const router = express.Router()

router.post("/enrollments",authenticateUser, authorizeUser(["coach"]),addMember)
router.get("/memberGroupsAggregate", authenticateUser,authorizeUser(["member"]), memberGroupsAggregate )
router.get("/enrollments/groupEnrollmentAggregate",authenticateUser,authorizeUser(["coach","member"]), groupEnrollmentAggregate)
router.get("/enrollments/group/:id", authenticateUser,authorizeUser(["coach","member"]), groupMembers)
router.get("/enrollments/member/:id", authenticateUser,authorizeUser(["coach","member"]), memberGroups)
router.delete("/enrollments/:id", authenticateUser,authorizeUser(["coach"]),deleteMember)


export default router