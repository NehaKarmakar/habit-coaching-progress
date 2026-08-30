import express from "express"
import {members } from "../controllers/Members.js"
import authenticateUser from "../middlewares/authenticateUser.js"
import authorizeUser from "../middlewares/authorizeUser.js"

const router= express.Router()

router.get("/members",authenticateUser, authorizeUser(["coach"]) ,members)
export default router