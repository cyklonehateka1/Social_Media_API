import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler";

export const jwtVerification = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "You are not authorized"));

  jwt.verify(token, process.env.JWT_SEC, (err, user) => {
    if (err) return next(errorHandler(403, "You are not authenticated"));
    req.user = user;
    next();
  });
};
