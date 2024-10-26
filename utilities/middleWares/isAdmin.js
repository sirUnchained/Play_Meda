module.exports = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== "ADMIN" && userRole !== "BOSS") {
    return res
      .status(403)
      .json({ msg: "you have to be boss or admin to access here" });
  }
  next();
};
