import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET_KEY,
  NODE_ENV,
} from "../config/configs.js";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      email,
      password,
      firstName,
      lastName,
      dob,
      gender,
      height,
      weight,
      level,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already in use.", 409));
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
      height,
      weight,
      level,
    });

    const accessToken = generateToken(
      { userId: user._id.toString() },
      JWT_ACCESS_SECRET_KEY,
      JWT_ACCESS_EXPIRES_IN
    );
    const refreshToken = generateToken(
      { userId: user._id.toString() },
      JWT_REFRESH_SECRET_KEY,
      JWT_REFRESH_EXPIRES_IN
    );

    if (!refreshToken || !accessToken) {
      return next(new AppError("Missing authentication tokens.", 401));
    }

    user.refreshToken = refreshToken;

    await user.save();

    const isProduction = NODE_ENV === "production";
    res.cookie("token", accessToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (protects against XSS attacks).
      sameSite: isProduction ? "strict" : "lax", // "strinct" -> the cookie will only be sent in same-site requests (more secure).
      secure: isProduction, // if true -> Ensures the cookie is only sent over HTTPS in production.
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "strict" : "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
      token: accessToken,
    });
  }
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const accessToken = generateToken(
      { userId: user._id.toString() },
      JWT_ACCESS_SECRET_KEY,
      JWT_ACCESS_EXPIRES_IN
    );
    const refreshToken = generateToken(
      { userId: user._id.toString() },
      JWT_REFRESH_SECRET_KEY,
      JWT_REFRESH_EXPIRES_IN
    );

    if (!refreshToken || !accessToken)
      return next(new AppError("Missing authentication tokens.", 401));

    user.refreshToken = refreshToken;

    await user.save();

    // Set token in HTTP-only cookie
    const isProduction = NODE_ENV === "production";
    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: isProduction ? "strict" : "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "strict" : "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Optionally exclude sensitive fields
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token: accessToken,
    });
  }
);

export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      await User.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } });
      await user.save();
    }
  }

  const isProduction = NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    secure: isProduction,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    secure: isProduction,
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const refreshTokenHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      return next(new AppError("Refresh token missing", 401));
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_REFRESH_SECRET_KEY);
    } catch (error) {
      console.log("error refreshing token", error);
      return next(new AppError("Invalid or expired refresh token", 403));
    }

    const user = await User.findById(payload.userId);

    if (!user || user.refreshToken !== token) {
      return next(new AppError("Refresh token mismatch", 403));
    }

    // Generate new tokens
    const newAccessToken = generateToken(
      { userId: user._id.toString() },
      JWT_ACCESS_SECRET_KEY,
      JWT_ACCESS_EXPIRES_IN
    );

    const newRefreshToken = generateToken(
      { userId: user._id.toString() },
      JWT_REFRESH_SECRET_KEY,
      JWT_REFRESH_EXPIRES_IN
    );

    if (!newRefreshToken || !newAccessToken)
      return next(new AppError("Missing authentication tokens.", 401));

    // Rotate refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 mins (or match your access token expiry)
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token: newAccessToken,
      message: "Token refreshed successfully",
    });
  }
);

export const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, firstName, lastName, dob, gender, height, weight, level } =
      req.body;

    const userId = req.user?.userId; // Assuming req.user is set by auth middleware
    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

    const user = await User.findById(userId).select("-refreshToken");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Optional: handle email/password changes with caution
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (level) user.level = level;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user,
    });
  }
);

export const uploadProfilePic = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const file = req.file as Express.Multer.File;
    // const localPath = file.path;

    const userId = req.user?.userId; // Assuming req.user is set by auth middleware
    if (!userId) return next(new AppError("User not authenticated", 401));

    const user = await User.findById(userId);

    if (!user) return next(new AppError("User not found", 404));

    if (!req.file) return next(new AppError("No image file provided", 400));

    let pic = req.file.path;
    const imageURL = await uploadOnCloudinary(pic);
    if (!imageURL) return next(new AppError("Failed to upload image", 400));

    if (imageURL) user.profilePicture = imageURL;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile Picture updated successfully",
      user,
    });
  }
);

// controllers/auth.controller.ts
export const getUserProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.userId) {
      return next(new AppError("Not authorized, no user ID found", 401));
    }

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
);
