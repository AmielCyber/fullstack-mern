import axios from "axios";
// My import.
import HttpError from "../models/http-error.js";

export function getPseudoCoordsForAddress(address) {
  console.log(address);
  return {
    lat: 37.8199286,
    lng: -122.4782551,
  };
}
export async function getCoordsForAddress(address) {
  let response;
  try {
    response = await axios.get(
      `https://us1.locationiq.com/v1/search.php?key=${
        process.env.GEO_TOKEN
      }&q=${encodeURIComponent(address)}&format=json`
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong with geo forwarding...",
      422
    );
    throw error;
  }
  // Get first found address.
  const data = response.data[0];

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }
  const lat = data.lat;
  const lon = data.lon;
  const coordinates = {
    lat: lat,
    lng: lon,
  };

  return coordinates;
}
