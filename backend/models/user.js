import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Creates an index and will speed up the index
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  // Have multiple places.
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

// Add validators for mongoose plugin.
UserSchema.plugin(mongooseUniqueValidator);

// User will be the name of the collection and will be user (users).
const User = mongoose.model("User", UserSchema);

export default User;
