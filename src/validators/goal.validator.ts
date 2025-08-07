import { z } from "zod";

export const goalSchema = z.object({
  user: z
    .string()
    .min(1, "User ID is required")
    .nonempty("User ID is required"),

  goalType: z
    .enum(["loss", "gain"])
    .refine((val) => ["loss", "gain"].includes(val), {
      message: "Goal type must be either 'loss' or 'gain'",
    }),

  currentVal: z.number().min(0, { message: "Current value must be positive" }),

  targetVal: z.number().min(0, { message: "Target value must be positive" }),

  unit: z.enum(["kg", "lbs"]).refine((val) => ["kg", "lbs"].includes(val), {
    message: "Unit must be either 'kg' or 'lbs'",
  }),

  startDate: z
    .string()
    .nonempty("Start date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Start date must be a valid date string",
    }),

  endDate: z
    .string()
    .nonempty("End date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "End date must be a valid date string",
    }),

  isAchieved: z.boolean().default(false),
});
