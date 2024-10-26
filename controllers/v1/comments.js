const mongoose = require("mongoose");
const commentsModel = require("./../../models/comments");
const commentValidator = require("./../../utilities/validators/comment");

exports.getAll = async (req, res, next) => {
  try {
    const comments = await commentsModel
      .find({})
      .populate("user", "-password")
      .populate("product", "-description -infos")
      .populate("replies.user", "-password")
      .lean();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

exports.getUserComments = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const comments = await commentsModel
      .find({ user: userID })
      .populate("product", "-description -infos ")
      .lean();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

exports.getProductComments = async (req, res, next) => {
  try {
    const { productID } = req.params;
    console.log(productID)
    if (!mongoose.isValidObjectId(productID)) {
      return res.status(404).json({ msg: "product not found" });
    }
    const comments = await commentsModel.find({ product: productID }).lean();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { productID } = req.params;
    const user = req.user._id;
    if (
      !mongoose.isValidObjectId(productID) ||
      !mongoose.isValidObjectId(user)
    ) {
      return res
        .status(403)
        .json({ msg: "the product or user id is not valid" });
    }

    const { score, body } = req.body;
    const validateResult = commentValidator(req.body);
    if (!validateResult) {
      return res.status(400).json({ msg: "comment is not valid." });
    }

    await commentsModel.create({ score, body, user, product: productID });
    res.status(201).json({ msg: "comment created succesfully" });
  } catch (error) {
    next(error);
  }
};

exports.replyToComment = async (req, res, next) => {
  try {
    const { commentID } = req.params;
    const user = req.user._id;
    if (
      !mongoose.mongoose.isValidObjectId(commentID) ||
      !mongoose.isValidObjectId(user)
    ) {
      return res
        .status(404)
        .json({ msg: "comment or user not found" });
    }

    const validateResult = commentValidator(req.body);
    if (!validateResult) {
      return res.status(400).json({ msg: "comment is not valid." });
    }

    const newReply = {
      body: req.body.body,
      user: new mongoose.Types.ObjectId(user),
    };
    const repliedComment = await commentsModel
      .findOneAndUpdate({ _id: commentID }, { $push: { replies: newReply } })
      .lean();

    if (!repliedComment) {
      return res.status(404).json({ msg: "replied comment not found" });
    }

    res.status(201).json({ msg: "Reply added successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { commentID, mainCommentID } = req.body;
    if (
      !mongoose.isValidObjectId(commentID) ||
      !mongoose.isValidObjectId(mainCommentID)
    ) {
      return res
        .status(404)
        .json({ msg: "the comment or main comment id not found" });
    }

    // if comment is not a reply (and it is a main comment) remove entire comment
    if (commentID.toString() === mainCommentID.toString()) {
      const removedComment = await commentsModel
        .findOneAndDelete({
          _id: mainCommentID,
        })
        .lean();
      // if you removed a main comment say it and exit
      if (removedComment) {
        return res.status(200).json({ msg: "comment removed" });
      }
    }

    // if comment is a reply search in main comment "replies" array find the one with same id as commentID and "pull" it
    let replies = await commentsModel
      .findOneAndUpdate(
        {
          _id: mainCommentID,
        },
        {
          $pull: {
            replies: { _id: commentID },
          },
        },
        { new: true, select: "replies" }
      )
      .lean();

    // its a handler if the "replies" is null it must return a problem
    if (!replies) {
      return res.status(404).json({ msg: "comment id not found" });
    }

    res.status(200).json({ msg: "comment removed" });
  } catch (error) {
    next(error);
  }
};

exports.accept = async (req, res, next) => {
  try {
    const { mainCommentID, commentID } = req.body;

    if (
      !mongoose.isValidObjectId(commentID) ||
      !mongoose.isValidObjectId(mainCommentID)
    ) {
      return res
        .status(404)
        .json({ msg: "the comment or main comment not found" });
    }

    // if comment is not a reply (and it is a main comment) accept entire main comment
    if (commentID.toString() === mainCommentID.toString()) {
      const removedComment = await commentsModel
        .findOneAndUpdate(
          {
            _id: mainCommentID,
          },
          {
            $set: {
              isAccept: 1,
            },
          }
        )
        .lean();
      // if you accept a main comment say it and exit
      if (removedComment) {
        return res.status(200).json({ msg: "comment accepted" });
      }
    }

    let updatedReplies = await commentsModel
      .findOneAndUpdate(
        {
          _id: mainCommentID,
          "replies._id": commentID,
        },
        {
          $set: {
            "replies.$.isAccept": 1,
          },
        },
        { new: true, select: "replies" } // return updated data in "replies" field
      )
      .lean();

    // its a handler if the "updatedReplies" is null it must return a problem
    if (!updatedReplies) {
      return res.status(404).json({ msg: "comment id not found" });
    }

    res.status(200).json({ msg: "comment accepted" });
  } catch (error) {
    next(error);
  }
};
