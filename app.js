const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.static("public/"));

const authRoutes = require("./routes/v1/auth");
const userRouter = require("./routes/v1/users");
const productRouter = require("./routes/v1/products");
const userProductRouter = require("./routes/v1/users_products");
const categoryRouter = require("./routes/v1/categories");
const subCategoryRouter = require("./routes/v1/sub_categories");
const topbarRouter = require("./routes/v1/topBar");
const staticRouter = require("./routes/v1/static");
const commentsRouter = require("./routes/v1/comments");
const contactRouter = require("./routes/v1/contacts");
const ticketRouter = require("./routes/v1/tickets");
const apiDoc = require("./swagger/v1/swagger.routes");

app.use("/v1/api-doc", apiDoc);
app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRouter);
app.use("/v1/product", productRouter);
app.use("/v1/order", userProductRouter);
app.use("/v1/category", categoryRouter);
app.use("/v1/sub-category", subCategoryRouter);
app.use("/v1/topbar", topbarRouter);
app.use("/v1/static", staticRouter);
app.use("/v1/comment", commentsRouter);
app.use("/v1/contact", contactRouter);
app.use("/v1/ticket", ticketRouter);

app.use((req, res) => {
  return res.status(404).json({ msg: "route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  return res.json({
    statusCode: err.statusCode || 500,
    msg: err.message || "server error",
  });
});

module.exports = app;
