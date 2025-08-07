// src/schemas/workout.schema.ts
import { z } from "zod";

export const workoutSchema = z.object({
  duration: z.coerce.number().positive("Duration must be a positive number"),

  caloriesBurned: z.coerce.number().refine((n) => n > 0, {
    message: "Duration must be a positive number",
  }),

  workoutDate: z
    .string()
    .nonempty("Workout date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),

  exerciseType: z
    .enum(["cardio", "strength", "yoga", "flexibility"])
    .refine(
      (val) => ["cardio", "strength", "yoga", "flexibility"].includes(val),
      {
        message:
          "Exercise type must be one of: cardio, strength, yoga, flexibility",
      }
    ),
});
