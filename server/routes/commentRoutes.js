import express from "express";
import {
  createComment,
  deleteComment,
  getComment,
  getPostComments,
} from "../controllers/commentControllers.js";
import { jwtVerification } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/new/:postId", jwtVerification, createComment);
router.get("/:commentId", jwtVerification, getComment);
router.get("/post/:postId", getPostComments);
router.delete("/delete/:commentId", jwtVerification, deleteComment);

export default router;
