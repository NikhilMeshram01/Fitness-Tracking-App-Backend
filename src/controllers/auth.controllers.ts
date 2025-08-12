import type { NextFunction, Request, Response } from "express";
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
      // return res.status(409).json({ message: "Email already in use." });
      // throw new AppError("Email already in use.", 409);
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

    user.refrehToken = refreshToken;

    await user.save();

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
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

      // return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Invalid email or password.", 401));

      // return res.status(401).json({ message: "Invalid email or password." });
    }

    const accessToken = generateToken(
      { userId: user._id.toString() },
      JWT_ACCESS_SECRET_KEY,
      JWT_ACCESS_EXPIRES_IN
    );
    // const refreshToken = generateToken(
    //   { userId: user._id.toString() },
    //   JWT_REFRESH_SECRET_KEY,
    //   JWT_REFRESH_EXPIRES_IN
    // );

    // user.refrehToken = refreshToken;

    // await user.save();

    // Set token in HTTP-only cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
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
  console.log("cookies --->", req.cookies);

  res.clearCookie("token", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getUserProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId; // Assuming `req.user` is set by auth middleware

    if (!userId) {
      return next(new AppError("Unauthorized: No user ID found.", 401));

      // return res
      //   .status(401)
      //   .json({ message: "Unauthorized: No user ID found." });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return next(new AppError("User not found.", 404));

      // return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// export const registerUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const {
//       email,
//       password,
//       fname,
//       lname,
//       dob,
//       gender,
//       height,
//       weight,
//       level,
//     } = req.body;

//     // Basic input validation
//     if (
//       !email ||
//       !password ||
//       !fname ||
//       !lname ||
//       !dob ||
//       !gender ||
//       !height ||
//       !weight
//     ) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: "Email already in use." });
//     }

//     // Create new user
//     const user = new User({
//       email,
//       password,
//       fname,
//       lname,
//       dob,
//       gender,
//       height,
//       weight,
//       level,
//     });

//     await user.save();

//     // const token = generateToken(
//     //   user._id.toString(),
//     //   JWT_ACCESS_SECRET_KEY,
//     //   JWT_ACCESS_EXPIRES_IN
//     // );

//     // res.cookie("token", token, {
//     //   httpOnly: true,
//     //   secure: process.env.NODE_ENV === "production",
//     //   sameSite: "strict",
//     //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     // });

//     const { password: _, ...userData } = user.toObject();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: userData,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// export const loginUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res
//       .status(400)
//       .json({ message: "Email and password are required." });
//   }

//   try {
//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password." });
//     }

//     // const token = generateToken(
//     //   { userId: user._id.toString(), role: user.role },
//     //   JWT_ACCESS_SECRET_KEY,
//     //   JWT_ACCESS_EXPIRES_IN
//     // );

//     // // Set token in HTTP-only cookie
//     // res.cookie("token", token, {
//     //   httpOnly: true,
//     //   secure: process.env.NODE_ENV === "production",
//     //   sameSite: "strict",
//     //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     // });

//     // Optionally exclude sensitive fields
//     const { password: _, ...userData } = user.toObject();

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: userData,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const logoutUser = async (req: Request, res: Response) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// };

// export const getUserProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.user?.userId; // Assuming `req.user` is set by auth middleware

//     if (!userId) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: No user ID found." });
//     }

//     const user = await User.findById(userId).select("-password"); // Exclude password

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     next(error); // Pass errors to global error handler
//   }
// };
