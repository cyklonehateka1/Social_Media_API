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
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const profilePosts = [];
    const posts = await PostSchema.find();
    // console.log(posts.length);
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      if (
        post.userId.toString() === req.user.id ||
        post.shares.includes(req.user.id)
      ) {
        profilePosts.push(post);
      }
    }
    if (profilePosts.length === 0) {
      return res.status(404).json("No post found");
    }
    res.status(200).json(profilePosts);
  } catch (error) {
    return next(error);
  }
};

export const getSharedPosts = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const sharedPosts = [];
    const posts = await PostSchema.find();
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      if (post.shares.includes(req.user.id)) {
        sharedPosts.push(post);
      }
    }
    if (sharedPosts.length === 0) {
      return res.status(404).json("No post found");
    }
    res.status(200).json(sharedPosts);
  } catch (error) {}
};

export const getLikedPosts = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const likedPosts = [];
    const posts = await PostSchema.find();
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      if (post.likes.includes(req.user.id)) {
        likedPosts.push(post);
      }
    }
    if (likedPosts.length === 0) {
      return res.status(404).json("No post found");
    }
    res.status(200).json(likedPosts);
  } catch (error) {}
};

export const getPostsBySearch = async (req, res, next) => {
  try {
    const search = req.query.q;
    const skip = req.query.skip;
    const limit = req.query.limit;
    const posts = await PostSchema.find({
      $regex: search,
      $options: "i",

      $or: [
        {
          text: {
            $regex: search,
            $options: "i",
          },
        },
        {
          edited: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    })
      .limit(limit)
      .skip(skip);
    if (posts.length === 0)
      return res.status(404).json("No post matches your search");
    res.status(200).json(posts);
  } catch (error) {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
  }
};

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

export const likeOrUnlikePost = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const post = await PostSchema.findById(req.params.postId);
    if (!post) return next(errorHandler(404, "Post not found"));
    let action;
    if (post.likes.includes(req.user.id)) {
      action = await PostSchema.findByIdAndUpdate(
        req.params.postId,
        { $pull: { likes: req.user.id } },
        { new: true }
      );
      return res.status(200).json("Post unliked");
    } else if (!post.likes.includes(req.user.id)) {
      action = await PostSchema.findByIdAndUpdate(
        req.params.postId,
        { $push: { likes: req.user.id } },
        { new: true }
      );
      return res.status(200).json("Post liked");
    }
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
      return res.status(200).json("Post unshared");
    } else if (!post.shares.includes(req.user.id)) {
      action = await PostSchema.findByIdAndUpdate(
        req.params.postId,
        { $push: { shares: req.user.id } },
        { new: true }
      );
      return res.status(200).json("Post shared");
    }
  } catch (error) {
    return next(error);
  }
};
