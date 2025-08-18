// import type { Request, Response, NextFunction } from "express";
// import Goal from "../models/goal.model.js";

import type { Request, Response, NextFunction } from "express";
import Goal from "../models/goal.model.js";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";

// add one more API for achieve goal or not

export const createGoal = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    const {
      goalType,
      currentValue,
      targetValue,
      unit,
      targetDate,
      isCompleted,
      title,
      description,
    } = req.body;

    const newGoal = await Goal.create({
      user: userId,
      goalType,
      title,
      description,
      currentValue,
      targetValue,
      unit,
      targetDate,
      isCompleted,
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully.",
      goal: newGoal,
    });
  }
);

export const getAllGoals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  }
);

export const updateGoal = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const goalId = req.params.id;

    if (!goalId) {
      return next(new AppError("Goal ID is required", 400));
    }

    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: goalId, user: req.user?.userId }, // Ensure the goal belongs to the user
      req.body,
      {
        new: true, // Returns the updated document instead of the original.
        runValidators: true, // Ensures the update follows your Mongoose schema rules (important for type and value constraints).
      }
    );

    if (!updatedGoal) {
      return next(new AppError("Goal not found or not authorized", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Goal updated successfully",
      data: {
        goal: updatedGoal,
      },
    });
  }
);

export const markCompleted = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId } = req.params;

    if (!itemId) {
      return next(new AppError("Gaol ID is required", 400));
    }

    const updatedItem = await Goal.findByIdAndUpdate(
      itemId,
      { completed: true },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return next(new AppError("Item not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Item marked as completed",
      item: updatedItem,
    });
  }
);

export const getGoal = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user?.userId,
    });

    if (!goal) {
      throw new AppError("Goal not found.", 404);
    }

    res.status(200).json({ success: true, goal });
  }
);

export const deleteGoal = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.userId,
    });

    if (!goal) {
      throw new AppError("Goal not found or not authorized.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully.",
    });
  }
);
