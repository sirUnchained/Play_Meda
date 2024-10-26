const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const AWS = require("@aws-sdk/client-s3");
const configs = require("../configENV");

const config = {
  region: "default",
  endpoint: configs.bucket.endPoint,
  credentials: {
    accessKeyId: configs.bucket.accessKey,
    secretAccessKey: configs.bucket.secretKey,
  },
};

const s3 = new AWS.S3(config);

const upload = multer({
  storage: multerS3({
    s3,
    bucket: configs.bucket.name,
    key: function (req, file, callBack) {
      const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);

      const acceptedFormats = [".png", ".jpg", ".jpeg", ".webp"];
      if (!acceptedFormats.includes(ext)) {
        callBack(new Error("file format not supperted"));
      }
      callBack(null, randomName + ext);
    },
  }),
});

module.exports = upload;
