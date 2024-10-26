const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("bans", schema);

module.exports = model;
