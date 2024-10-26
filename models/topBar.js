const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 30,
    },
    href: {
      type: String,
      required: true,
      maxLength: 30,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("topbars", schema);

module.exports = model;
