import express from "express"
import { checkSchema } from "express-validator"
import usersCltr from "../controllers/userController.js"
import { userLoginSchema, userRegisterSchema } from "../validations/user-schema-validations.js"
import authenticateUser from "../middlewares/authenticateUser.js"
import authorizeUser from "../middlewares/authorizeUser.js"

const router= express.Router()


router.post("/register",checkSchema(userRegisterSchema), usersCltr.register)
router.post("/login", checkSchema(userLoginSchema), usersCltr.login)
router.post("/forgetPassword",usersCltr.forgetPassword)
router.post("/resetPassword/:token",usersCltr.resetPassword)

router.get("/profile",authenticateUser,authorizeUser(["coach","member"]),usersCltr.profile)
router.get("/list" ,authenticateUser,authorizeUser(["coach"]) ,usersCltr.listOfUsers)
router.get("/check-field", usersCltr.checkField)


export default router