const { isValidObjectId, default: mongoose } = require("mongoose");

const productsModel = require("./../../models/products");
const userModel = require("./../../models/users");
const subCategoriesModel = require("./../../models/sub_categories");
const categoriesModel = require("./../../models/categories");
const commentsModel = require("./../../models/comments");

const removeFile = require("./../../utilities/removeUploaded.js");
const productValidator = require("./../../utilities/validators/product.js");

exports.getAll = async (req, res, next) => {
  try {
    const products = await productsModel
      .find({}, "-createdBy -infos -description")
      .populate("subCategory");
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.getSingle = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({ msg: "product id not found" });
    }
    const product = await productsModel
      .findOne({ _id: id }, "-createdBy")
      .populate("subCategory")
      .lean();

    if (!product) {
      return res.status(404).json({ msg: "product id not found" });
    }
    const comments = await commentsModel
      .find({ product: id, isAccept: 1 })
      .populate("user", "-password -phone -email -fullname")
      .populate("replies.user", "-password -phone -email -fullname")
      .lean();

    let score = 0;
    comments.forEach((comment) => {
      score += comment.score;
    });
    score = score / comments.length;

    const filteredComments = comments.map((comment) => {
      return {
        ...comment,
        replies: comment.replies.filter((reply) => reply.isAccept === 1), // Filter accepted replies
      };
    });

    res.status(200).json({
      ...product,
      comments: filteredComments,
      score: score,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllInPanel = async (req, res, next) => {
  const products = await productsModel
    .find({})
    .populate("createdBy", "-password -infos -description");
  res.status(200).json(products);
};

exports.create = async (req, res, next) => {
  try {
    const {
      name,
      model,
      description,
      brand,
      isProductNew,
      off,
      subCategory,
      count,
      price,
    } = req.body;

    const validationResult = productValidator(
      name,
      model,
      description,
      brand,
      isProductNew,
      off,
      subCategory,
      count,
      price
    );
    if (validationResult !== true) {
      return res.status(400).json(validationResult);
    }

    const { _id: adminID } = req.user;
    if (!isValidObjectId(adminID)) {
      return res.status(404).json({ msg: "the admin id is not valid" });
    }

    const admin = await userModel.findOne({ _id: adminID }).lean();
    if (!admin) {
      return res.status(404).json({ msg: "admin not found" });
    }

    const checkSubCat = await subCategoriesModel.findOne({ _id: subCategory });
    if (!checkSubCat) {
      return res.status(404).json({ msg: "category not found." });
    }

    const pics = req.files.map((file) => file.key);
    req.body.pics = pics;

    let href = name;
    href = href.replace(/[\s-\.]/g, "_").toLowerCase();
    const product = await productsModel.findOne({ href }).lean();
    if (product) {
      removeFile(pics);
      return res.status(400).json({ msg: "name is duplicated" });
    }

    await productsModel.create({
      name,
      model,
      description,
      brand,
      isProductNew,
      off,
      subCategory,
      count,
      price,
      href,
      createdBy: req.user._id,
    });

    return res.status(201).json({ msg: "product created" });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id: productID } = req.params;

    const removedProduct = await productsModel.findOneAndDelete({
      _id: productID,
    });
    if (!removedProduct) {
      return res.status(404).json({ msg: "product dose not exist" });
    }

    const pics = removedProduct.pics;
    removeFile(pics);

    res.status(200).json({ msg: "product removed !" });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({ msg: "no product found." });
    }

    const checkProdutExist = await productsModel.findOne({ _id: id }).lean();
    if (!checkProdutExist) {
      return res.status(404).json({ msg: "no product found." });
    }

    const {
      name,
      model,
      description,
      brand,
      createdBy,
      isProductNew,
      off,
      subCategory,
      count,
      price,
    } = req.body;

    const validationResult = productValidator(
      name,
      model,
      description,
      brand,
      createdBy,
      isProductNew,
      off,
      subCategory,
      count,
      price
    );
    if (validationResult !== true) {
      return res.status(400).json(validationResult);
    }

    const checkSubCat = await subCategoriesModel.findOne({ _id: subCategory });
    if (!checkSubCat) {
      return res.status(404).json({ msg: "category not found." });
    }

    const pics = req.files.map((file) => file.key);
    req.body.pics = pics;

    let href = name;
    href = href.replace(/[\s-\.]/g, "_").toLowerCase();
    const product = await productsModel.findOne({ href }).lean();
    if (product) {
      removeFile(pics);
      return res.status(400).json({ msg: "name is duplicated" });
    }

    removeFile(checkProdutExist.pics);

    await productsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          model,
          description,
          brand,
          createdBy,
          isProductNew,
          off,
          subCategory,
          count,
          price,
        },
      }
    );

    return res.status(200).json({ msg: "product updated." });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryProducts = async (req, res, next) => {
  try {
    const { href } = req.params;

    const products = await productsModel
      .find({}, "-createdBy -infos -description")
      .populate("subCategory");

    const subCategory = await subCategoriesModel.findOne({ href }).lean();

    if (subCategory) {
      return res
        .status(200)
        .json(products.filter((product) => product.subCategory.href === href));
    }

    const category = await categoriesModel.findOne({ href }).lean();
    const subCategories = await subCategoriesModel.find().lean();

    const matchedCategories = subCategories.filter(
      (sub) => sub.category.toString() === category._id.toString()
    );

    if (matchedCategories?.length) {
      let resProducts = [];

      matchedCategories.forEach((sub) => {
        products.forEach((product) => {
          if (sub.href === product.subCategory.href) {
            resProducts.push(product);
          }
        });
      });

      if (resProducts.length) {
        return res.status(200).json(resProducts);
      }
    }

    return res.status(404).json({ msg: "not found" });
  } catch (error) {
    next(error);
  }
};
