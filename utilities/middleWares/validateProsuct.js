const mongoose = require("mongoose");
const productsModel = require("./../../models/products");
const userModel = require("./../../models/users");

module.exports = async (req, res, next) => {
  const { href } = req.body;
  const { _id: adminID } = req.user;
  try {
    if (!mongoose.isValidObjectId(adminID)) {
      // throw res.status(403).json({ msg: "the admin id is not valid" });
      throw new Error("the admin id is not valid");
    }
    const admin = await userModel.findOne({ _id: adminID }).lean();
    if (!admin) {
      // throw res.status(404).json({ msg: "admin not found" });
      throw new Error("admin not found");
    }

    const product = await productsModel.findOne({ href }).lean();
    if (product) {
      // throw res.status(400).json({ msg: "href is duplicated" });
      throw new Error("href is duplicated");
    }
    next();
  } catch (err) {
    res.send(err);
  }
};
