const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerApiDoc = require("./swagger.json");
const swaggerOptions = {
  customCss: ".swagger-ui .topbar { display: none; };",
};

const router = express.Router();

router.use("/", swaggerUI.serve);
router.use("/", swaggerUI.setup(swaggerApiDoc, swaggerOptions));

module.exports = router;
