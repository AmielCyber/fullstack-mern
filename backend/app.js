import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path"; // Path
import fs from "fs"; // File System.
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
// Request, Response, Next

app.use((req, res, next) => {
  // Add headers to respond.
  // Allows which domain have access.
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Specified which headers are allowed
  // Controls which headers which incoming request are handle.
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
app.use("/uploads/images", express.static(path.join("uploads", "images"))); // For retrieving images. express.static point to which path to point

// Register middleware that does not get response such as unsupported routes.
app.use(() => {
  throw new HttpError("Could not find this route.", 404);
});

// Register middleware that catches any errors thrown.
app.use((error, req, res, next) => {
  // Check if we had a file as part of the request then delete it.
  if (req.file) {
    // Roll back file.
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    }); // Points to the file and deletes it.
  }
  if (res.headersSent) {
    // Forward the error if we have already sent an error.
    return next(error);
  }
  // Error or something went wrong status code
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

// Establish connection with MongoDB.
mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URI)
  .then(() => {
    // If DB connection is successful then start our server.
    app.listen(PORT);
  })
  .catch((err) => {
    // Display error in starting up our server.
    console.error(err);
  });
