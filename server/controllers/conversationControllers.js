import ConversationSchema from "../models/ConversationModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const createConversation = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email first"));
    const conversation = new ConversationSchema(req.body);
    await conversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    return next(error);
  }
};

export const getUserConversations = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email first"));
    const conversations = await ConversationSchema.find({
      members: { $in: [req.params.userId] },
    });
    if (!conversations || conversations.length === 0)
      return next(errorHandler(404, "Conversation not found"));
    res.status(200).json(conversations);
  } catch (error) {
    return next(error);
  }
};
