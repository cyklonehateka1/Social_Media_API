import express from "express";
import {
  createPost,
  deletePost,
  getLikedPosts,
  getPost,
  getPostsBySearch,
  getProfilePosts,
  getSharedPosts,
  likeOrUnlikePost,
  shareOrUnsharePost,
  updatePost,
} from "../controllers/postControllers.js";
import { jwtVerification } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/new", jwtVerification, createPost);
router.get("/one/:postId", getPost);
router.get("/profile/shared", jwtVerification, getSharedPosts);
router.get("/profile/liked", jwtVerification, getLikedPosts);
router.get("/profile/all", jwtVerification, getProfilePosts);
router.get("/search", getPostsBySearch);
router.delete("/delete/:postId", jwtVerification, deletePost);
router.put("/update/:postId", jwtVerification, updatePost);
router.post("/like/:postId", jwtVerification, likeOrUnlikePost);
router.post("/share/:postId", jwtVerification, shareOrUnsharePost);

export default router;
