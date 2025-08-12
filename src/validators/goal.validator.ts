import { z } from "zod";

export const goalSchema = z.object({
  goalType: z
    .enum([
      "weight_loss",
      "weight_gain",
      "workout_frequency",
      "calories",
      "distance",
    ])
    .refine(
      (val) =>
        [
          "weight_loss",
          "weight_gain",
          "workout_frequency",
          "calories",
          "distance",
        ].includes(val),
      {
        message: "Goal type must be either 'loss' or 'gain'",
      }
    ),

  currentValue: z.number().min(0, "Currnt value must be a positive number"),

  targetValue: z.number().min(0, "Target value must be a positive number"),

  unit: z
    .string()
    .transform((val) => val.trim() || "kg")
    .refine(
      (val) => ["kg", "lbs", "km", "calories", "workouts/week"].includes(val),
      {
        message: "Unit must be either 'kg' or 'lbs' or 'km'",
      }
    ),

  targetDate: z
    .string()
    .nonempty("Start date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Start date must be a valid date string",
    }),

  title: z.string().nonempty("title date is required"),

  description: z.string().optional(),

  isCompleted: z.boolean().default(false),
});
