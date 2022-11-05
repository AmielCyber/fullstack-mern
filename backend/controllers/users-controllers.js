import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";
// My import.
import HttpError from "../models/http-error.js";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Amiel Nava",
    email: "demo@gmail.com",
    password: "1234567",
  },
];

export function getUsers(req, res) {
  res.status(200).json({ users: DUMMY_USERS });
}

export function signup(req, res) {
  // Validate passed data.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed", 422);
  }

  // Get inputs if they were valid.
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create a user that already exists!", 422);
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(newUser);

  res.status(201).json({ user: newUser });
}

export function login(req, res) {
  const { email, password } = req.body;

  const identifyUser = DUMMY_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (!identifyUser) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      401
    );
  }

  res.json({ message: "Logged in!" });
}
