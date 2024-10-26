const express = require("express");
const router = express.Router();

const staticController = require("./../../controllers/v1/static");
const authToken = require("./../../utilities/middleWares/auth");
const adminToken = require("./../../utilities/middleWares/isAdmin");
const bossToken = require("./../../utilities/middleWares/isBoss");

router
  .route("/")
  .get(staticController.getAll)
  .put(authToken, adminToken, staticController.update);

module.exports = router;
