const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    phone: {
      type: String,
      requierd: true,
    },
    map: {
      X_axis: {
        type: Number,
        requierd: true,
      },
      Y_axis: {
        type: Number,
        requierd: true,
      },
    },
    address: {
      type: String,
      requierd: true,
    },
    attendance_hours: {
      type: String,
      requierd: true,
    },
    sochials: {
      telegram: {
        type: String,
        requierd: true,
      },
      insta: {
        type: String,
        requierd: true,
      },
      youtube: {
        type: String,
        requierd: true,
      },
    },
  },
  { timestamps: true }
);

const model = mongoose.model("statics", schema);

module.exports = model;
