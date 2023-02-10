import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// My import.
import User from "../models/user.js";
import HttpError from "../models/http-error.js";

export async function getUsers(req, res, next) {
  let users;
  try {
    // Get users and exclude the password.
    users = await User.find({}, "-password");
  } catch (err) {
    console.error(err);
    const error = new HttpError(
      "Fetching users failed. Please try again later.",
      500
    );
    return next(error);
  }

  // Find returns an array of users.
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}

export async function signup(req, res, next) {
  // Validate passed data.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError("Invalid inputs passed", 422);
    return next(error);
  }

  // Get inputs if they were valid.
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    // DB error.
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    // User already exists.
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  // Creating a new user is possible.
  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" } // expires in one hour.
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    // DB error.
    const error = new HttpError(
      "Logging in  failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    // User does not exists.
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    // User does not exists or password is incorrect.
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    // Invalid password
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" } // expires in one hour.
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
}
