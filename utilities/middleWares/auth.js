const jwt = require("jsonwebtoken");
const userModel = require("./../../models/users");
const configs = require("../../configENV");

module.exports = async (req, res, next) => {
  let token = req.header("Authorization")?.split(" ");
  if (token?.length != 2) {
    return res.status(400).json({ msg: "this route is protected" });
  }

  token = token[1];

  try {
    const tokenData = jwt.verify(token, configs.tokenSecretKey);

    const user = await userModel
      .findOne({ _id: tokenData._id }, "-password")
      .lean();

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ msg: "token is not valid" });
  }
};
