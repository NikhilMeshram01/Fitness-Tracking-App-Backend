import type { Request, Response, NextFunction } from "express";
import Goal from "../models/goal.model.js";

export const createGoal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const { goalType, currentVal, targetVal, unit, startDate, endDate } =
      req.body;

    // Basic validation
    if (
      !goalType ||
      !currentVal ||
      !targetVal ||
      !unit ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newGoal = await Goal.create({
      user: userId,
      goalType,
      currentVal,
      targetVal,
      unit,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully.",
      goal: newGoal,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGoals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    next(error);
  }
};
