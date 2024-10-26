const express = require("express");
const router = express.Router();

const categoryController = require("./../../controllers/v1/categories");
const authToken = require("./../../utilities/middleWares/auth");
const adminToken = require("./../../utilities/middleWares/isAdmin");
const bossToken = require("./../../utilities/middleWares/isBoss");

router
  .route("/")
  .get(categoryController.getAll)
  .post(authToken, adminToken, categoryController.create);

router
  .route("/:categoryID")
  .delete(authToken, adminToken, categoryController.remove);

module.exports = router;
