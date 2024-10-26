const mongoose = require("mongoose");

// const InfoFieldSchema = mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   body: {
//     type: String,
//     default: null,
//   },
// });

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // infos: [InfoFieldSchema],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    pics: [
      {
        type: String,
        required: true,
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "sub_categories",
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    isProductNew: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    off: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("products", schema);

module.exports = model;
