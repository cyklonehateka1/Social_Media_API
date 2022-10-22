import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: true,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
    },
    phone: {
      type: String,
      unique: true,
    },
    externalUrls: {
      type: [String],
    },
    bio: {
      type: String,
    },
    img: {
      type: String,
    },
  },
  { timestamp: true }
);

export default mongoose.model("user", UserSchema);
