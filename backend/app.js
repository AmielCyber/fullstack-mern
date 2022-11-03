const express = require("express"); // Backend Framework

const placesRoutes = require("./routes/places-routes");

// Constants
const PORT = 5050;
// Initiate express app.
const app = express();

// Register route middleware.
app.use('/api/places', placesRoutes);    // => /api/places/...

app.use((error, req, res, next) => {
  if(res.headersSent){
    // Forward the error if we have already sent an error.
    return next(error);
  }
  // Error or something went wrong status code
  res.status(error.code || 500).json({message: error.message || 'An unknown error occurred!'});
});


// Start our server.
app.listen(PORT);
