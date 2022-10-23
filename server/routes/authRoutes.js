import express from "express";
import {
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/authControllers.js";
const router = express.Router();

router.post("/register", register);
router.get("/:id/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
export default router;
