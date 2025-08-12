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

    console.log(req.body);
    console.log(userId);

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

// export const createGoal = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.user?.userId;

//     const { goalType, currentVal, targetVal, unit, startDate, endDate } =
//       req.body;

//     // Basic validation
//     if (
//       !goalType ||
//       !currentVal ||
//       !targetVal ||
//       !unit ||
//       !startDate ||
//       !endDate
//     ) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     const newGoal = await Goal.create({
//       user: userId,
//       goalType,
//       currentVal,
//       targetVal,
//       unit,
//       startDate,
//       endDate,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Goal created successfully.",
//       goal: newGoal,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAllGoals = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.user?.userId;

//     const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: goals.length,
//       goals,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
