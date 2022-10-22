import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    replies: {
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
  },
  { timestamps: true }
);

export default mongoose.model("comment", CommentSchema);
