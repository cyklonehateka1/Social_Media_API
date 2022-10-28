import express from "express";
import {
  createConversation,
  getUserConversations,
} from "../controllers/conversationControllers.js";
import { jwtVerification } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/new", jwtVerification, createConversation);
router.get("/:userId", jwtVerification, getUserConversations);

export default router;
