import express from "express";
import { check } from "express-validator";
// My import.
import { getUsers, signup, login } from "../controllers/users-controllers.js";
import fileUpload from "../middleware/file-upload.js"; // Middleware

const router = express.Router();

// /api/places/...
router.get("/", getUsers);

router.post(
  "/signup",
  fileUpload.single("image"), // Use middleware to extract a single image.
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);

export default router;
