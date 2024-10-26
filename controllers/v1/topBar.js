const topbarModel = require("./../../models/topBar");

exports.getAll = async (req, res, next) => {
  try {
    const topbars = await topbarModel.find({}).lean();
    return res.status(200).json(topbars);
  } catch (error) {
    next(error);
  }
};

exports.newTopbar = async (req, res, next) => {
  try {
    let { href, name } = req.body;

    href = href.replace(/[\s-\.]/g, "_").toLowerCase();

    const topbar = await topbarModel.findOne({ href }).lean();
    if (topbar) {
      return res.status(400).json({ msg: "href is duplicated" });
    }

    await topbarModel.create({ href, name });

    return res.status(201).json({ msg: "new topbar creaated" });
  } catch (error) {
    next(error);
  }
};
