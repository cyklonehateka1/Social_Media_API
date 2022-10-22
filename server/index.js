import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./utils/db.js";
dotenv.config();
const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(express.json);

// Routes

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
