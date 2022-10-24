import CommentSchema from "../models/CommentModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import PostSchema from "../models/PostModel.js";

export const createComment = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const comment = new CommentSchema({
      ...req.body,
      userId: req.user.id,
      postId: req.params.postId,
    });
    await comment.save();
    const attachToPost = await PostSchema.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { comments: comment._id },
      },
      { new: true }
    );
    if (!attachToPost) {
      const deleteComment = await CommentSchema.findByIdAndDelete(comment._id);
      return next(errorHandler(404, "Post not found"));
    }
    res.status(200).json(comment);
  } catch (error) {
    return next(error);
  }
};

export const getComment = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const comment = await CommentSchema.findById(req.params.commentId);
    if (!comment) return next(errorHandler(404, "Comment not found"));
    res.status(200).json(comment);
  } catch (error) {
    return next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const limit = req.query.limit;
    const post = await PostSchema.findById(req.params.postId);
    if (!post) return next(errorHandler(404, "Post not found"));
    const comments = await Promise.all(
      post.comments.map((commentId) => {
        return CommentSchema.findById(commentId);
      })
    );
    res.status(200).json(comments);
  } catch (error) {
    return next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));

    const comment = await CommentSchema.findById(req.params.commentId);
    if (!comment) return next(errorHandler(404, "Comment not found"));
    if (comment.userId.toString() !== req.user.id)
      return next(
        errorHandler(403, "You cannot delete comments of other users")
      );
    const removedComment = await CommentSchema.findByIdAndDelete(
      req.params.commentId
    );
    if (!removedComment)
      return next(errorHandler(400, "Comment deletion failed"));
    const deleteFromPost = await PostSchema.findByIdAndUpdate(comment.postId, {
      $pull: { comments: req.params.commentId },
    });
    res.status(200).json("Comment deleted");
  } catch (error) {
    return next(error);
  }
};
