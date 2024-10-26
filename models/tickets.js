const mongoose = require("mongoose");

const answerSchema = mongoose.Schema(
  {
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    answer: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isAnswer: {
      type: Number,
      default: 0,
    },
    answerDetails: answerSchema,
  },
  { timestamps: true }
);

const model = mongoose.model("tickets", schema);

module.exports = model;
