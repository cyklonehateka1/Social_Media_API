import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    text: {
      type: String,
    },
    pictures: {
      type: [String],
    },
    video: {
      type: String,
    },
    shares: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("post", PostSchema);
