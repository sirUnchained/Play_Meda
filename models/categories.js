const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("categories", schema);

module.exports = model;
