module.exports = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== "BOSS") {
    return res
      .status(403)
      .json({ msg: "you have to be boss to access here" });
  }
  next();
};
