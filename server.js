const app = require("./app");
const mongoose = require("mongoose");
const configs = require("./configENV");

const port = process.env.PORT;

(async () => {
  await mongoose
    .connect(configs.mongoURI)
    .then(() => {
      console.log("mongodb connected");
    })
    .catch((err) => console.log(err));
})();

app.listen(configs.port, () => {
  console.log(`server run on port ${configs.port}`);
});
