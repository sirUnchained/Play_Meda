const express = require("express");
const router = express.Router();

const subCategoryController = require("./../../controllers/v1/sub_categories");
const authToken = require("./../../utilities/middleWares/auth");
const adminToken = require("./../../utilities/middleWares/isAdmin");
const bossToken = require("./../../utilities/middleWares/isBoss");

router
  .route("/")
  .get(subCategoryController.getAll)
  .post(authToken, adminToken, subCategoryController.create);

router.route("/get-subs-all-seprated").get(subCategoryController.getAllSeprated);

module.exports = router;
