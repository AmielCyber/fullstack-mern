import axios from "axios";
// My import.
import HttpError from "../models/http-error.js";

export function getCoordsForAddress(address) {
  console.log(address);
  return {
    lat: 37.8199286,
    lng: -122.4782551,
  };
}

async function googleCoords(address) {
  const response = await axios.get(`/crap/${encodeURI(address)}`);
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the passed address",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}
