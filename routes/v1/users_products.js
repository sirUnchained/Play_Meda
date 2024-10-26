const express = require('express');
const router = express.Router();

const usersProductsController = require("./../../controllers/v1/users_products");
const authToken = require("./../../utilities/middleWares/auth");
const adminToken = require("./../../utilities/middleWares/isAdmin");
const bossToken = require("./../../utilities/middleWares/isBoss");

router.route("/").get(authToken, adminToken, usersProductsController.getAll);

router.route("/most-sale").get(usersProductsController.mostSales)

router.route("/buy/:productID").post(authToken, usersProductsController.create);

module.exports = router;
