const mongoose = require("mongoose");

const repliesSchema = mongoose.Schema({
  body: {
    type: String,
    required: true,
    max: 255,
    min: 5,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  isAccept: {
    type: Number,
    default: 0,
  },
});

const schema = mongoose.Schema(
  {
    score: {
      type: Number,
      required: true,
      max: 5,
      min: 1,
    },
    body: {
      type: String,
      required: true,
      max: 255,
      min: 5,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "products",
    },
    replies: [repliesSchema],
    isAccept: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("comments", schema);

module.exports = model;
