require("dotenv").config();

const configs = {
  port: process.env.PORT,
  tokenSecretKey: process.env.TOKENS_SECRET_KEY,
  bucket: {
    endPoint: process.env.BUCKET_ENDPOINT,
    name: process.env.BUCKET_NAME,
    accessKey: process.env.BUCKET_ACCESS_KEY,
    secretKey: process.env.BUCKET_SECRET_KEY,
  },
  mongoURI: process.env.DATABASE_URI,
};

module.exports = configs;
