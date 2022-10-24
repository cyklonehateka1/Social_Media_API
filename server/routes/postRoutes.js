import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getProfilePosts,
  likeAPost,
  updatePost,
} from "../controllers/postControllers.js";
import { jwtVerification } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/new", jwtVerification, createPost);
router.get("/:postId", getPost);
router.get("/profile/:userId", jwtVerification, getProfilePosts);
router.delete("/delete/:postId", jwtVerification, deletePost);
router.put("/update/:postId", jwtVerification, updatePost);
router.post("/like/:postId", jwtVerification, likeAPost);

export default router;
