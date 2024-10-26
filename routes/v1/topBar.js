const express = require("express");
const router = express.Router();

const topbarController = require("./../../controllers/v1/topBar");
const authToken = require("./../../utilities/middleWares/auth");
const adminToken = require("./../../utilities/middleWares/isAdmin");
const bossToken = require("./../../utilities/middleWares/isBoss");

router
  .route("/")
  .get(topbarController.getAll)
  .post(authToken, adminToken, topbarController.newTopbar);

module.exports = router;
