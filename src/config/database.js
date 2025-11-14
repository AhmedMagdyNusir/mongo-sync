require("dotenv").config();

const config = {
  uri: process.env.MONGO_URI,
  dbName: process.env.DB_NAME,
};

module.exports = config;
