import { errorHandler } from "../middlewares/errorHandler.js";
import MessageSchema from "../models/MessageModel.js";

export const createMessage = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email first"));
    const message = new MessageSchema(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    return next(error);
  }
};

export const recieveMessage = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email first"));
    const message = await MessageSchema.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(message);
  } catch (error) {
    return next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email first"));
    const removedMessage = await MessageSchema.findByIdAndDelete(
      req.params.messageId
    );
    if (!removedMessage) return next(errorHandler(404, "Message not found"));
    res.status(200).json("Message deleted");
  } catch (error) {}
};
