const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
    throw new Error("Database could not be connected");
  }
};

module.exports = {
  dbConnection,
};
