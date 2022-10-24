import UserSchema from "../models/UserModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import bcrypt from "bcrypt";

export const getUser = async (req, res, next) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const search = req.query.search;
    const limit = req.query.limit;
    const skip = req.query.skip;

    let users;

    if (search) {
      users = await UserSchema.find({
        $regex: search,
        $options: "i",
        $or: [
          {
            firstName: {
              $regex: search,
              $options: "i",
            },
          },
          {
            middleNames: {
              $regex: search,
              $options: "i",
            },
          },
          {
            lastName: {
              $regex: search,
              $options: "i",
            },
          },
          {
            username: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      })
        .limit(limit)
        .sort({ createdAt: -1 });
    } else {
      users = await UserSchema.find().limit(limit);
    }
    if (users.length === 0) return res.status(200).json("No user found");
    res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email first"));
    if (req.user.id === req.params.id) {
      let user = await UserSchema.findById(req.params.id);

      if (!req.body.password)
        return next(errorHandler(404, "Please enter your password"));

      const checkPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!checkPassword) return next(errorHandler(403, "Incorrect password"));

      user = await UserSchema.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account deleted");
    } else {
      return next(errorHandler(403, "You are not authorized"));
    }
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email first"));
    if (req.user.id === req.params.id) {
      const { password, email, phone, ...otherDetails } = req.body;
      const user = await UserSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: otherDetails,
        },
        { new: true }
      );
      return res.status(200).json(user);
    }
    return next(errorHandler(403, "You are not authorized"));
  } catch (error) {
    return next(error);
  }
};

export const getUserFollowers = async (req, res, next) => {
  try {
    if (!req.user.emailIsVerified)
      return next(errorHandler(403, "Please verify your email"));
    const user = await UserSchema.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));
    const userFollowers = await Promise.all(
      user.followers.map((followerId) => {
        return UserSchema.find({ _id: followerId });
      })
    );
    res.status(200).json(userFollowers);
  } catch (error) {
    return next(error);
  }
};
