import mongoose from "mongoose";
const MessageSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  text: {
    type: String,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  videos: {
    type: [String],
  },
  images: {
    type: [String],
  },
});

export default mongoose.model("message", MessageSchema);
