const userModel = require("./../../models/users");
const banModel = require("./../../models/ban");
const { isValidObjectId } = require("mongoose");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({}, "-password").lean();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const _id = req.user._id;

    const user = await userModel.findOne({ _id }, "-password").lean();
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.ban = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    await banModel.create({ phone: user.phone });
    return res.status(201).json({ msg: "user banned" });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id: userID } = req.params;
    if (!isValidObjectId(userID)) {
      return res.status(404).json({ msg: "user not found" });
    }

    const removedUser = await userModel.findOneAndDelete({ _id: userID });
    if (!removedUser) {
      return res.status(404).json({ msg: "user dose not exist" });
    }
    res.status(200).json({ msg: "user removed" });
  } catch (error) {
    next(error);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(404).json({ msg: "user not found" });
    }

    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ msg: "user dose not exist" });
    } else if (user.role === "USER") {
      await userModel.updateOne({ _id: id }, { $set: { role: "ADMIN" } });
      return res.status(201).json({ msg: "user is now admin" });
    } else if (user.role === "ADMIN") {
      await userModel.updateOne({ _id: id }, { $set: { role: "USER" } });
      return res.status(201).json({ msg: "user is a user" });
    }
  } catch (error) {
    next(error);
  }
};
