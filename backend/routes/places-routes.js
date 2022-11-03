const express = require("express");

const HttpError = require('../models/http-error')

const router = express.Router();// Router to register middleware
const DUMMY_PLACES = [
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

// Respond to home page with dynamic place id.
router.get('/:pid', (req, res) => {
  // Extract dynamic place id
  const placeId = req.params.pid;

  // Get place.
  const place = DUMMY_PLACES.find(p => p.id === placeId);

  if(!place){
    // Place not found.
    throw new HttpError('Could not find a place for the provided id.', 404)
  }

  res.json({place}) // Returns an empty object if place not found.
})

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find(p => p.creator === userId);

  if(!place){
    // Place not found.
    const error = new HttpError('Could not find a place for the provided id.', 404)
    return next(error);
  }

  res.json({place});
})

module.exports = router;