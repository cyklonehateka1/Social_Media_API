import express from "express";
import { jwtVerification } from "../middlewares/jwt.js";
import {
  createMessage,
  deleteMessage,
  recieveMessage,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.post("/send", jwtVerification, createMessage);
router.get("/:conversationId", jwtVerification, recieveMessage);
router.delete("/delete/:messageId", jwtVerification, deleteMessage);

export default router;
