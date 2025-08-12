// import type { Request, Response, NextFunction } from "express";
// import Workout from "../models/workout.model.js";

import type { Request, Response, NextFunction } from "express";
import Workout from "../models/workout.model.js";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";

// Create a new workout
export const createNewWorkout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("createNewWorkout controller hit", req.body);
    const userId = req.user?.userId;
    const { duration, caloriesBurned, workoutDate, exerciseType, name } =
      req.body;
    // console.log("userId", userId);
    // console.log("req.body ->", req.body);

    const newWorkout = await Workout.create({
      user: userId,
      duration,
      caloriesBurned,
      workoutDate,
      exerciseType,
      name,
    });

    res.status(201).json({
      success: true,
      message: "workout created successfully",
      workout: newWorkout,
    });
  }
);

// Get all workouts for the current user (with pagination)
export const getAllWorkouts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    console.log("getAllWorkouts controller hit", userId);

    // Get page and limit from query params, defaulting to 1 and 10
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Total count (for pagination metadata)
    const total = await Workout.countDocuments({ user: userId });

    // Paginated data
    const workouts = await Workout.find({ user: userId })
      .sort({ workoutDate: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: workouts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      workouts,
    });
  }
);

// Get a single workout by ID
export const getWorkout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user?.userId,
    });

    if (!workout) {
      throw new AppError("Workout not found.", 404);

      // return res.status(404).json({ message: "Workout not found." });
    }

    res.status(200).json({ success: true, workout });
  }
);

// Update a workout
export const updateWorkout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.userId },
      req.body,
      { new: true, runValidators: true }
    );

    // if (!workout) {
    //   return res
    //     .status(404)
    //     .json({ message: "Workout not found or not authorized." });
    // }

    res.status(200).json({
      success: true,
      message: "Workout updated successfully.",
      workout,
    });
  }
);

// Delete a workout
export const deleteWorkout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.userId,
    });

    if (!workout) {
      throw new AppError("Workout not found or not authorized.", 404);

      // return res
      //   .status(404)
      //   .json({ message: "Workout not found or not authorized." });
    }

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully.",
    });
  }
);
