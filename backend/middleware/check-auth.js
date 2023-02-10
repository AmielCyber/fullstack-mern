import jwt from "jsonwebtoken";
// My import.
import HttpError from "../models/http-error.js";

// Check Authentication middleware for non-get routes.
function checkAuth(req, res, next) {
  if (req.method === "OPTIONS") {
    // Ensure the browsers options method is passed first.
    return next();
  }
  try {
    // Get token from header
    const token = req.headers.authorization.split(" ")[1]; // Authorization: "Bearer TOKEN"
    if (!token) {
      throw new Error("Authentication failed!");
    }
    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    req.userData = { userId: decodedToken.userId }; // Extract userId from decodedToken
    return next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
}
export default checkAuth;
