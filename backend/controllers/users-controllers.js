import { validationResult } from "express-validator";
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

  // Creating a new user is possible.
  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password,
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

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

  if (!existingUser || existingUser.password !== password) {
    // User does not exists or password is incorrect.
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
}
