import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleNames: {
      type: String,
    },
    lastName: {
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
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
    },
    phone: {
      type: String,
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
    emailIsVerified: {
      type: Boolean,
      default: false,
    },
    accountIsVerified: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", UserSchema);
