const configs = require("../../configENV");
const userModel = require("./../../models/users");

const registerValidator = require("./../../utilities/validators/register");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { fullname, username, email, phone, password } = req.body;
    const validation = registerValidator({
      fullname,
      username,
      email,
      phone,
      password,
    });
    if (validation !== true) {
      return res.status(400).json(validation);
    }

    const isUserExist = await userModel
      .findOne({ $or: [{ email: email }, { username: username }] })
      .lean();
    if (isUserExist) {
      return res.status(406).json({ msg: "username or email is duplicated" });
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const users = await userModel.find({}).lean();
    const newUser = await userModel.create({
      fullname,
      username,
      email,
      phone,
      password: hashedPass,
      role: users.length === 0 ? "BOSS" : "USER",
    });

    const token = jwt.sign(
      { _id: String(newUser._id) },
      configs.tokenSecretKey,
      {
        expiresIn: "30 days",
        algorithm: "HS256",
      }
    );

    return res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username }).lean();
    console.log(username, user);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    const unhashPass = await bcrypt.compare(password, user.password);
    if (!unhashPass) {
      return res.status(400).json({ msg: "invalid username or password." });
    }

    const token = jwt.sign({ _id: user._id }, configs.tokenSecretKey, {
      expiresIn: "30d",
    });
    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
