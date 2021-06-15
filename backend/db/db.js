const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    console.log("Connection to MongoDB successful");
  } catch (error) {
    console.log("Error connection with MongoDB: ", error);
    throw new Error("Error connection with MongoDB.")
  }
};

module.exports = dbConnection;
