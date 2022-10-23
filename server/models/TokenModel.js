import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: "3600s" },
  },
});

export default mongoose.model("token", TokenSchema);
