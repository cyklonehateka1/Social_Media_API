import PostSchema from "../models/PostModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import UserSchema from "../models/UserModel.js";

export const createPost = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const post = await new PostSchema({
      ...req.body,
      userId: req.user.id,
    }).save();
    res.status(201).json("Post added");
  } catch (error) {
    return next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await PostSchema.findById(req.params.postId);
    if (!post) return next(errorHandler(404, "Post not found"));
    res.status(200).json(post);
  } catch (error) {
    return next(error);
  }
};

export const getProfilePosts = async (req, res, next) => {
  // try {
  //   if (!req.user.emailIsVerified)
  //     return next(errorHandler(403, "Please verify your email"));
  //   const profilePosts = [];
  //   const posts = await PostSchema.find();
  //   posts.forEach((post) => {
  //     if (post.userId === req.params.userId || post.comments.includes(req.params.userId))
  //   });
  // } catch (error) {
  //   return next(error);
  // }
};

export const getSharedPosts = async (req, res, next) => {};

export const getLikedPosts = async (req, res, next) => {};

export const getPostsBySearch = async (req, res, next) => {};

export const getTimelinePosts = async () => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    if (req.user.id === req.params.id) {
      const user = await UserSchema.findById(req.params.id);
      const userPosts = await PostSchema.find({ userId: user._id });
      const followingPosts = await Promise.all(
        user.following.map((followerId) => {
          return PostSchema.find({ userId: followerId });
        })
      );
      return res.status(200).json(followingPosts.concat(userPosts));
    }
  } catch (error) {}
};

export const deletePost = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const post = await PostSchema.findById(req.params.postId);
    if (!post) return next(errorHandler(404, "Post not found"));
    if (post.userId.toString() !== req.user.id)
      return next(errorHandler(403, "You are not authorized"));
    const removedPost = await PostSchema.findByIdAndDelete(req.params.postId);

    res.status(200).json("Post deleted");
  } catch (error) {
    return next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const post = await PostSchema.findById(req.params.postId);
    if (!post) return next(errorHandler(404, "Post not found"));
    if (post.userId.toString() !== req.user.id)
      return next(errorHandler(403, "You are not authorized"));
    const modifiedPost = await PostSchema.findByIdAndUpdate(
      req.params.postId,
      { $set: { edited: req.body.edited } },
      { new: true }
    );
    res.status(200).json(modifiedPost);
  } catch (error) {
    return next(err);
  }
};

export const likeAPost = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const like = await PostSchema.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { likes: req.user.id },
      },
      { new: true }
    );
    if (!like) return next(errorHandler(404, "Post not found"));
    res.status(200).json(like.likes.length);
  } catch (error) {
    return next(error);
  }
};

export const shareOrUnsharePost = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const post = await PostSchema.findById(req.params.postId);
    if (!post) return next(errorHandler(404, "Post not found"));
    let action;
    if (post.shares.includes(req.user.id)) {
      action = await PostSchema.findByIdAndUpdate(
        req.params.postId,
        { $pull: { shares: req.user.id } },
        { new: true }
      );
    } else if (!post.shares.includes(req.user.id)) {
      action = await PostSchema.findByIdAndUpdate(
        req.params.postId,
        { $push: { shares: req.user.id } },
        { new: true }
      );
    }
    res.status(200).json("Post Shared");
  } catch (error) {}
};
