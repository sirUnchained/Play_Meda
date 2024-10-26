const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const configs = require("../configENV");
require("dotenv").config();

const client = new S3Client({
  region: "default",
  endpoint: configs.bucket.endPoint,
  credentials: {
    accessKeyId: configs.bucket.accessKey,
    secretAccessKey: configs.bucket.secretKey,
  },
});

module.exports = function removeFile(pics) {
  pics.forEach(async (pic) => {
    const params = {
      Bucket: configs.bucket.name,
      Key: pic,
    };

    try {
      await client.send(new DeleteObjectCommand(params));
      console.log("File deleted successfully");
    } catch (error) {
      console.log(error);
    }
  });
};
