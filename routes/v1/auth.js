const express = require("express");
const router = express.Router();

const usersController = require("./../../controllers/v1/auth");

router.route("/register").post(usersController.register);

router.route("/login").post(usersController.login);

module.exports = router;