import { jwtVerification } from "../middlewares/jwt.js";
import express from "express";
import {
  deleteUser,
  getUser,
  getUserFollowers,
  getUsers,
  updateUser,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/", jwtVerification, getUsers);
router.delete("/delete/:id", jwtVerification, deleteUser);
router.put("/update/:id", jwtVerification, updateUser);
router.get("/:id/followers", jwtVerification, getUserFollowers);

export default router;
