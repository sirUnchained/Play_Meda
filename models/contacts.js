const mongoose = require("mongoose");

const schema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  explain: {
    type: String,
    required: true,
  },
  isAnswer: {
    type: Number,
    default: 0,
    required: false,
  },
  answer: {
    type: String,
    required: false,
    default: "",
  },
});

const model = mongoose.model("contacts", schema);

module.exports = model;
