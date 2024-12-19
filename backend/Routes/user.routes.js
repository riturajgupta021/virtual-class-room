import express from "express"
import { home, login, register } from "../controllers/user.controller.js"
import roleAuth from "../middlewares/userAuth.js"
import { forgotPassword, resetPassword } from "../controllers/password.controller.js"

const userRouter = express.Router()

userRouter.post("/register", register)

userRouter.post("/login", login)

userRouter.get("/home", roleAuth, home)

userRouter.post("/forgotPassword", forgotPassword)

userRouter.post("/resetPassword/:token", resetPassword);

export default userRouter;