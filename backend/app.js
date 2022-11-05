import express from "express";
// My imports.
import placesRoutes from "./routes/places-routes.js";
import userRoutes from "./routes/user-routes.js";
import HttpError from "./models/http-error.js";

// The server port.
const PORT = 5050;

// Create an express application
const app = express();

// Add middleware to parse json data
app.use(express.json());

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

// Start our server.
app.listen(PORT);
