import { z } from "zod";

export const goalSchema = z.object({
  goalType: z
    .enum(["loss", "gain"])
    .refine((val) => ["loss", "gain"].includes(val), {
      message: "Goal type must be either 'loss' or 'gain'",
    }),

  currentVal: z
    .string()
    .nonempty("Current value is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Current value must be a positive number",
    })
    .transform((val) => Number(val)),

  targetVal: z
    .string()
    .nonempty("Target value is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Target value must be a positive number",
    })
    .transform((val) => Number(val)),

  unit: z
    .string()
    .transform((val) => val.trim() || "kg")
    .refine((val) => ["kg", "lbs"].includes(val), {
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
