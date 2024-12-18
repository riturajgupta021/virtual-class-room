const express = require("express");
const { login, register } = require("../Controllers/auth.controller");

const router = express.Router();


router.post("/login", login);
router.post("/register", register);

module.exports = router;
