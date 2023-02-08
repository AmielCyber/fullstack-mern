import { validationResult } from "express-validator";
import mongoose from "mongoose";
// My imports.
import Place from "../models/place.js";
import User from "../models/user.js";
import HttpError from "../models/http-error.js";
import { getCoordsForAddress } from "../util/location.js";

/**
 * Retrieves a place by the the placeId.
 */
export async function getPlaceById(req, res, next) {
  // Extract dynamic place id
  const placeId = req.params.pid;

  // Get place.
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    // Database error.
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    // Place not found.
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  // Return a normal JS object and add the id property from mongodb.
  // getters: true - Mongoose adds a getters id property to the created object w/o the underscore.
  res.json({ place: place.toObject({ getters: true }) }); // Returns an empty object if place not found.
}

/**
 *  Retrieves a list of places from a user's id.
 */
export async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid;

  // Find a user's places with their user id.
  let userWithPlaces;
  try {
    // userWithPlaces with places array.
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    // Database error.
    const error = new HttpError(
      "Fetching places failed. Please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    // User not found or user does not have any places.
    const error = new HttpError(
      "Could not find places for the provided id.",
      404
    );
    return next(error);
  }

  // Since places is an array, map with place.
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
}

export async function createPlace(req, res, next) {
  // Validate user inputs are correct.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If validation contains errors.
    console.log(errors);
    next(new HttpError("Invalid inputs passed", 422));
  }

  // Get json parsed
  const { title, description, address, creator } = req.body;

  // Check if address exists.
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // Check if user exists.
  let user;
  try {
    // Find user in our DB.
    user = await User.findById(creator);
  } catch (err) {
    // Database error.
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    // User not found in our database.
    const error = new HttpError("Could not find user for provided ID.", 404);
    return next(error);
  }

  // Create new Place Schema
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/600px-GoldenGateBridge-001.jpg",
    creator,
  });

  try {
    const session = await mongoose.startSession();
    // Start session to save two related sessions.
    session.startTransaction();
    // Save created place and provide session.
    await createdPlace.save({ session: session });
    // Add place to the places of the user.
    user.places.push(createdPlace);
    // Save to user.
    await user.save({ session: session, validateModifiedOnly: true });
    console.log("hey");

    // Only if all sessions are successful or else everything above gets rolled back.
    await session.commitTransaction();
  } catch (err) {
    // Transaction failed.
    console.log(err);
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  // Created data successfully.
  res.status(201).json({ place: createdPlace });
}

export async function updatePlaceById(req, res, next) {
  // Validate user inputs are correct.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Validation has errors.
    const error = new HttpError("Invalid inputs passed", 422);
    return next(error);
  }
  // Get id of the place to delete.
  const placeId = req.params.pid;
  // Get json parsed.
  const { title, description } = req.body;

  let place;
  try {
    // Find place.
    place = await Place.findById(placeId);
  } catch (err) {
    // Database error.
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  // Update title and description.
  place.title = title;
  place.description = description;

  try {
    // Update place document.
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
}

export async function deletePlaceById(req, res, next) {
  const placeId = req.params.pid;

  let place;
  try {
    // Populate refer to a document stored in another document (creator).
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  // check if a place actually exists.
  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  try {
    // Start session to delete place in both places Users and Places.
    // Remove and pull.
    const session = await mongoose.startSession();
    session.startTransaction();

    // Remove the place from our places collection
    await place.remove({ session: session });
    // Access place in the creator.
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    // Commit transaction if all sessions were successful.
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
}
