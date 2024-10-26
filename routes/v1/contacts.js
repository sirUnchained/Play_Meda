const express = require("express");
const router = express.Router();

const adminToken = require("./../../utilities/middleWares/isAdmin");
const authToken = require("./../../utilities/middleWares/auth");

const contactModel = require("./../../controllers/v1/contacts");

router
  .route("/")
  .post(contactModel.create)
  .get(authToken, adminToken, contactModel.getAll);

router
  .route("/no-answer")
  .get(authToken, adminToken, contactModel.getNoAnswers);

router
  .route("/:contactID")
  .delete(authToken, adminToken, contactModel.remove)
  .put(authToken, adminToken, contactModel.answer);

module.exports = router;
