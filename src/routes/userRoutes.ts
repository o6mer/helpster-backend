import { auth } from "../controllers/usersController";

const { login, signup } = require("../controllers/usersController");
const express = require("express");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/auth", auth);

module.exports = router;

export {};
