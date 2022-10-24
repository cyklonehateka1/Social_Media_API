import jwt from "jsonwebtoken";
import UserSchema from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../middlewares/errorHandler.js";
import TokenSchema from "../models/TokenModel.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { access } from "fs";

export const register = async (req, res, next) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName)
      return next(errorHandler(400, "Some fields are required"));
    let user = await UserSchema.findOne({ email });
    if (user) return next(errorHandler(409, "Email already used"));
    user = await UserSchema.findOne({ username });
    if (user) return next(errorHandler(409, "Username is not available"));

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new UserSchema({ ...req.body, password: hash });
    await newUser.save();

    const token = await new TokenSchema({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}/api/auth/${newUser._id}/verify/${token.token}`;
    await sendEmail(newUser.email, "Verify Email", url);
    res
      .status(201)
      .json(
        "An email has been sent to you, click on the link to verify your account"
      );
  } catch (error) {
    return next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));
    const token = await TokenSchema.findOne({
      userId: req.params.id,
      token: req.params.token,
    });

    if (!token)
      return next(
        errorHandler(
          404,
          "Invalid token, Maybe it has expired. Login to resend token"
        )
      );

    await UserSchema.findByIdAndUpdate(req.params.id, {
      $set: { emailIsVerified: true },
    });

    await token.remove();
    res.status(200).json("account verified");
  } catch (error) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { usernameOrEmail } = req.body;
    const user =
      (await UserSchema.findOne({ email: usernameOrEmail })) ||
      (await UserSchema.findOne({ username: usernameOrEmail }));
    if (!user) return next(errorHandler(404, "User not found"));
    const checkPassword = bcrypt.compareSync(req.body.password, user.password);

    if (!checkPassword) return next(errorHandler(400, "Wrong password"));

    if (!user.emailIsVerified) {
      let url;
      const token = await TokenSchema.findOne({
        userId: user._id,
      });
      if (!token) {
        const newToken = await new TokenSchema({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        url = `${process.env.BASE_URL}/api/auth/${user._id}/verify/${newToken.token}`;
        await sendEmail(user.email, "Verify Email", url);
      } else {
        url = `${process.env.BASE_URL}/api/auth/${user._id}/verify/${token.token}`;
        sendEmail(user.email, "Verify Email", url);
      }
      return res
        .status(200)
        .json("An email has been sent to you, click on the link to verify");
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        emailIsVerified: user.emailIsVerified,
        email: user.email,
      },
      process.env.JWT_SEC
    );

    const { password, ...others } = user._doc;

    res.cookie("access_token", jwtToken).status(200).json(others);
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  res
    .clearCookie("access_token", { sameSite: "none", secure: true })
    .status(200)
    .json("Logged out successfully");
};
