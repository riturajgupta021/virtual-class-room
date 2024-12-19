const express = require("express");

const {loginController, signupController} = require("../controllers/auth.controller")
const authRoutes = express.Router();

authRoutes.post("/api/signup", signupController)
authRoutes.post("/api/login", loginController)


module.exports = authRoutes