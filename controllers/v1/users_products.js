const productsModel = require("./../../models/products");
const usersProductsModel = require("./../../models/users_products");
const { isValidObjectId } = require("mongoose");

exports.getAll = async (req, res, next) => {
  try {
    const purchasess = await usersProductsModel
      .find({})
      .populate("user", "-password")
      // .populate("product");
    return res.status(200).json(purchasess);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const productID = req.params.productID;
    const { count } = req.body;

    const idValidation = isValidObjectId(productID);
    if (!idValidation) {
      return res.status(404).json({ msg: "product not found" });
    }

    const product = await productsModel.findOne({ _id: productID });

    if (!product || product.count - count < 0) {
      return res
        .status(405)
        .json({ msg: "product not found or count is lees than you want" });
    }

    await productsModel.updateOne(
      { _id: productID },
      { $inc: { count: -count } }
    );

    await usersProductsModel.create({ user: userID, product: productID });

    return res.status(201).json({ msg: "user purchases successfuly" });
  } catch (error) {
    next(error);
  }
};

exports.mostSales = async (req, res, next) => {
  try {
    const boughtedProducts = await usersProductsModel.find({}).lean();
    const products = await productsModel.find({}).lean();

    products.forEach((product, index) => {
      let count = 0;
      boughtedProducts.forEach((bought) => {
        if (bought.product === product._id) {
          count++;
        }
      });
      products[index] = { ...product, count };
    });

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
