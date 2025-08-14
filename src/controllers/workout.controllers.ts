// import type { Request, Response, NextFunction } from "express";
// import Workout from "../models/workout.model.js";

import type { Request, Response, NextFunction } from "express";
import Workout from "../models/workout.model.js";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";
import mongoose from "mongoose";

// Create a new workout
export const createNewWorkout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("createNewWorkout controller hit", req.body);
    const userId = req.user?.userId;
    const { duration, caloriesBurned, workoutDate, exerciseType, name } =
      req.body;

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

    // Get page and limit from query params, defaulting to 1 and 10
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = (req.query.sortBy as string) || "workoutDate";
    const order = (req.query.order as string) === "asc" ? 1 : -1;
    console.log("req.query.order-->", req.query.order);
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortBy] = order;
    // console.log(sortBy, order);
    // Total count (for pagination metadata)
    const total = await Workout.countDocuments({ user: userId });

    // Aggregate total calories burned and total duration for this user
    const aggregates = await Workout.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user?.userId) } },
      {
        $group: {
          _id: null,
          totalCaloriesBurned: { $sum: "$caloriesBurned" },
          totalDuration: { $sum: "$duration" }, // assuming 'duration' field is number (minutes or seconds)
          totalWorkouts: { $sum: 1 },
          averageDuration: { $avg: "$duration" },
        },
      },
    ]);

    const {
      totalCaloriesBurned = 0,
      totalDuration = 0,
      totalWorkouts = 0,
      averageDuration = 0,
    } = aggregates[0] || {};

    // Paginated data
    const workouts = await Workout.find({
      user: new mongoose.Types.ObjectId(req.user?.userId),
    })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: workouts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      workouts,
      totalWorkouts,
      totalCaloriesBurned,
      totalDuration,
      averageDuration,
    });
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
    }

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully.",
    });
  }
);

// fetch workouts for the last 30 days
export const last30Days = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId; // adjust this based on your auth middleware

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const workouts = await Workout.find({
      user: userId,
      workoutDate: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    res.status(200).json({
      status: "success",
      results: workouts.length,
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
    }

    res.status(200).json({ success: true, workout });
  }
);
