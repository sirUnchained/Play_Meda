const subCategoriesModel = require("./../../models/sub_categories");
const categoryModel = require("./../../models/categories");
const { isValidObjectId } = require("mongoose");

exports.getAll = async (req, res, next) => {
  try {
    const categories = await categoryModel.find({}).lean();
    const subCategories = await subCategoriesModel.find({}).lean();

    categories.forEach((cat, index) => {
      categories[index] = { ...categories[index], subCategory: [] };
      subCategories.forEach((sub) => {
        if (cat._id.toString() === sub.category.toString()) {
          categories[index].subCategory.push({ ...sub });
        }
      });
    });
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

exports.getAllSeprated = async (req, res, next) => {
  try {
    const subCategories = await subCategoriesModel.find({}).lean();
    return res.status(200).json(subCategories);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    let { name, href, category } = req.body;

    if (!isValidObjectId(category)) {
      return res.status(404).json({ msg: "category not found" });
    }

    href = href.replace(/[\s-\.]/g, "_").toLowerCase();

    const isCategoryExist = await categoryModel
      .findOne({ _id: category })
      .lean();
    if (!isCategoryExist) {
      return res.status(404).json({ msg: "category not found" });
    }

    await subCategoriesModel.create({ name, href, category });

    res.status(201).json({ msg: "sub cat created" });
  } catch (error) {
    next(error);
  }
};
