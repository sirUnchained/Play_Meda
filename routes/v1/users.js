const express = require("express");
const router = express.Router();

const usersController = require("./../../controllers/v1/users");
const authToken = require("./../../utilities/middleWares/auth");
const adminToken = require("./../../utilities/middleWares/isAdmin");
const bossToken = require("./../../utilities/middleWares/isBoss");

router.route("/").get(authToken, adminToken, usersController.getUsers);

router.route("/getme").get(authToken, usersController.getMe);

router.route("/ban/:id").delete(authToken, adminToken, usersController.ban);

router
  .route("/remove/:id")
  .delete(authToken, adminToken, usersController.remove);

router
  .route("/change-role/:id")
  .put(authToken, bossToken, usersController.changeRole);

module.exports = router;
