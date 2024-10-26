const express = require("express");
const router = express.Router();

const commentController = require("./../../controllers/v1/comments");
const authToken = require("./../../utilities/middleWares/auth");
const adminToken = require("./../../utilities/middleWares/isAdmin");
const bossToken = require("./../../utilities/middleWares/isBoss");

router.route("/").get(authToken, adminToken, commentController.getAll);
router.route("/user-comments").get(authToken, commentController.getUserComments);

router
  .route("/:productID")
  .get(commentController.getProductComments)
  .post(authToken, commentController.create);

router
  .route("/reply/:commentID")
  .post(authToken, commentController.replyToComment);

router.route("/remove").delete(authToken, adminToken, commentController.remove);

router.route("/accept").put(authToken, adminToken, commentController.accept);

module.exports = router;
