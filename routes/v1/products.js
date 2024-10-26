const express = require("express");
const router = express.Router();

const poroductController = require("./../../controllers/v1/products");
const authToken = require("./../../utilities/middleWares/auth");
const adminToken = require("./../../utilities/middleWares/isAdmin");
const bossToken = require("./../../utilities/middleWares/isBoss");

const uploader = require("./../../utilities/uploader");

router.route("/").get(poroductController.getAll);

router.route("/:id").get(poroductController.getSingle);

router
  .route("/panel")
  .get(authToken, adminToken, poroductController.getAllInPanel);

router.route("/cat/:href").get(poroductController.getCategoryProducts);

router
  .route("/add")
  .post(
    authToken,
    adminToken,
    uploader.array("pics", 3),
    poroductController.create
  );

router
  .route("/remove/:id")
  .delete(authToken, adminToken, poroductController.remove);

router
  .route("/update/:id")
  .put(
    authToken,
    adminToken,
    uploader.array("pics", 3),
    poroductController.update
  );

module.exports = router;
