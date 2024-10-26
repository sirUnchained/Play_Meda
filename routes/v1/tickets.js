const express = require("express");
const router = express.Router();

const ticketController = require("./../../controllers/v1/tickets");

const authToken = require("./../../utilities/middleWares/auth");
const adminToken = require("./../../utilities/middleWares/isAdmin");
const bossToken = require("./../../utilities/middleWares/isBoss");

router.route("/").get(authToken, adminToken, ticketController.getAll);

router.route("/remove/:id").delete(authToken, adminToken, ticketController.remove);

router.route("/user-tickets").get(authToken, ticketController.getSingle);

router.route("/create-ticket").post(authToken, ticketController.create);

router
  .route("/answer/:id")
  .put(authToken, adminToken, ticketController.answer);

module.exports = router;
