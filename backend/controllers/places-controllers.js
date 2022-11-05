import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";
// My imports.
import HttpError from "../models/http-error.js";
import { getCoordsForAddress } from "../util/location.js";

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

export function getPlaceById(req, res) {
  // Extract dynamic place id
  const placeId = req.params.pid;

  // Get place.
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    // Place not found.
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  res.json({ place }); // Returns an empty object if place not found.
}
export function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places || places.length === 0) {
    // Place not found.
    const error = new HttpError(
      "Could not find places for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ places });
}

export function createPlace(req, res, next) {
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

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);
  console.log(DUMMY_PLACES);

  // Created data successfully.
  res.status(201).json({ place: createdPlace });
}

export function updatePlaceById(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed", 422);
  }
  // Get id of the place to delete.
  const placeId = req.params.pid;
  // Get json parsed.
  const { title, description } = req.body;

  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  if (placeIndex > -1) {
    const updatedPlace = { ...DUMMY_PLACES[placeIndex] };
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;

    return res.status(200).json({ place: updatedPlace });
  }

  return res.status(500);
}
export function deletePlaceById(req, res) {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for that id", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
}
