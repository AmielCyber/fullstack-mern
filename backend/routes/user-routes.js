import express from "express";
import { check } from "express-validator";
// My import.
import { getUsers, signup, login } from "../controllers/users-controllers.js";

const router = express.Router();

// /api/places/...
router.get("/", getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);

export default router;
