const staticModel = require("./../../models/static");

exports.getAll = async (req, res, next) => {
  try {
    const statics = await staticModel.find({}).lean();
    return res.json(statics);
  } catch (error) {
    next(error);
  }
};
exports.update = async (req, res, next) => {
  try {
    const { identifire } = req.body;
    const static = await staticModel.findOneAndUpdate({ identifire });
    if (!static) {
      return res.status(400).json({ msg: "datas are not valid" });
    }
    
    return res.status(201).send({ msg: "done" });
  } catch (error) {
    next(error);
  }
};
