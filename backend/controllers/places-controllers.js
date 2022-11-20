import { validationResult } from "express-validator";
import mongoose from "mongoose";
// My imports.
import Place from "../models/place.js";
import User from "../models/user.js";
import HttpError from "../models/http-error.js";
import { getCoordsForAddress } from "../util/location.js";

export async function getPlaceById(req, res, next) {
  // Extract dynamic place id
  const placeId = req.params.pid;

  // Get place.
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    // Missing information.
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
  res.json({ place: place.toObject({ getters: true }) }); // Returns an empty object if place not found.
}

export async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid;

  // Find with the user id.
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed. Please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    // Place not found.
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inputs passed", 422));
  }
  // Get json parsed
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = getCoordsForAddress(address);
  } catch (error) {
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

  console.log(creator);
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided ID.", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    // Start session to save two related sessions.
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session, validateModifiedOnly: true });

    // Only if all sessions are successful.
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  // Created data successfully.
  res.status(201).json({ place: createdPlace });
}

export async function updatePlaceById(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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
    // populate refer to a document stored in another document (creator).
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
    // Start session to delete place in both places.
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
