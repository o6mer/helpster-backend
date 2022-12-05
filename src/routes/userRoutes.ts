const usersController = require("../controllers/usersController");
const express = require("express");

const router = express.Router();

router.post("/login", usersController.login);
router.post("/signup", usersController.signup);

module.exports = router;

export {};
