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
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("sub_categories", schema);

module.exports = model;
