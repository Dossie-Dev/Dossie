/* Load mongoose module - allow to manipulate the database */
const mongoose = require("mongoose");
const logger = require("./../utils/logger");

/* Load environment variables */
require("dotenv").config();

/* Get database authentication keys */
const { dbAuth } = require("./db_Authentication");

/* Retrieve MongoDB URI from environment variables */
const mongoUri = process.env.DATABASE;

/* Connect to MongoDB */
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Database connection successful");
  })
  .catch((err) => {
    logger.error("Database connection error:", err);
  });

/* Enable debugging for MongoDB operations */
mongoose.set("debug", function (collectionName, methodName, ...methodArgs) {
  try {
    logger.info(`${collectionName}.${methodName}(${JSON.stringify(methodArgs)})`);
  } catch (error) {
    logger.error(`Error in debugging: ${error.message}`);
  }
});

/* Handle database connection events */
const dbConn = mongoose.connection;

dbConn.on("error", (err) => {
  logger.error("Database connection error:", err);
});

dbConn.once("open", () => {
  logger.info("Database connection is open and operational");
});

/* Export the connection and mongoose for use in other modules */
module.exports = { dbConn, mongoose };
