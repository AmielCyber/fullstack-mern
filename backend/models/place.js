import mongoose from "mongoose";

// Create my Place Model.
const PlaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  // Points to an object id in mongodb, ref
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

// Place will be the name of the collection and will be plural (Places).
const Place = mongoose.model("Place", PlaceSchema);

export default Place;
