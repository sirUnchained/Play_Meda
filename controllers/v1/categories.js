const categoriesModel = require("./../../models/categories");

exports.getAll = async (req, res, next) => {
  try {
    const categories = await categoriesModel.find({});
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    let { name, href } = req.body;
    const categories = await categoriesModel.findOne({ href });
    if (categories) {
      return res.status(405).json({ msg: "category href duplicated" });
    }

    href = href.replace(/[\s-\.]/g, "_").toLowerCase();

    await categoriesModel.create(req.body);

    res.status(201).json({ msg: "category added" });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { categoryID } = req.params;

    const result = await categoriesModel
      .findOneAndDelete({ _id: categoryID })
      .lean();
    if (!result) {
      return res.status(404).json({ msg: "category not found." });
    }

    return res.status(404).json({ msg: "category removed." });
  } catch (error) {
    next(error);
  }
};
