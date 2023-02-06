import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
// My imports.
import placesRoutes from "./routes/places-routes.js";
import userRoutes from "./routes/user-routes.js";
import HttpError from "./models/http-error.js";

// Configurations.
// Set dotenv config so node has access to the .env.local file for our API keys.
dotenv.config({ path: "./.env.local" });
// Server port.
const PORT = 5050;
// Create an express application
const app = express();
// Add middleware to parse json data
app.use(express.json());

// Register middleware to have access to our backend calls from our frontend.
app.use((req, res, next) => {
  // Allows which domain have access.
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Control which headers are allowed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // Control which HTTP methods may be used in the front-end
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  // Continue to next middleware.
  next();
});

// Register route middleware.
app.use("/api/places", placesRoutes); // => /api/places/...
app.use("/api/users", userRoutes); // => /api/users/...

// Register middleware that does not get response.
app.use(() => {
  throw new HttpError("Could not find this route.", 404);
});

// Register middleware that catches any errors thrown.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    // Forward the error if we have already sent an error.
    return next(error);
  }
  // Error or something went wrong status code
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

// Establish connection with my MongoDB.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // If DB connection is successful then start our server.
    app.listen(PORT);
  })
  .catch((err) => {
    // Display error in starting up our server.
    console.log(err);
  });
