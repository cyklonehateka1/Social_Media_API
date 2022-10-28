import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import cookieParser from "cookie-parser";
import conversationsRoutes from "./routes/conversationRoutes.js";
import messagesRoutes from "./routes/messageRoutes.js";
import { socket } from "./socket/socket.js";
dotenv.config();
const app = express();

const server = http.createServer(app);
socket(server);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    success: false,
    status,
    message,
  });
});

server.listen(8000, () => {
  connection();

  console.log("Sever started on PORT 8000");
});
