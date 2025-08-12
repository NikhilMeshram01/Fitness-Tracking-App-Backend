import { Document, Schema, Types, model } from "mongoose";

export interface IGoal extends Document {
  user: Types.ObjectId;
  goalType:
    | "weight_loss"
    | "weight_gain"
    | "workout_frequency"
    | "calories"
    | "distance";
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: "kg" | "lbs" | "km" | "calories" | "workouts/week";
  targetDate: Date;
  isCompleted: boolean;
}

const goalSchema = new Schema<IGoal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    goalType: {
      type: String,
      enum: [
        "weight_loss",
        "weight_gain",
        "workout_frequency",
        "calories",
        "distance",
      ],
    },
    title: String,
    description: String,
    currentValue: Number,
    targetValue: Number,
    unit: {
      type: String,
      enum: ["kg", "lbs", "km", "calories", "workouts/week"],
    },
    targetDate: Date,
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Goal = model<IGoal>("Goal", goalSchema);
export default Goal;
