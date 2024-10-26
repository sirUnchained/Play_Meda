const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("users_products", schema);

module.exports = model;
