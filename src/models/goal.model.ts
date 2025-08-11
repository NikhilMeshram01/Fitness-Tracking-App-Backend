import { Document, Schema, Types, model } from "mongoose";

export interface IGoal extends Document {
  user: Types.ObjectId;
  goalType: "loss" | "gain";
  currentVal: number;
  targetVal: number;
  unit: "kg" | "lbs";
  startDate: Date;
  endDate: Date;
  isAchieved: boolean;
}

const goalSchema = new Schema<IGoal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    goalType: {
      type: String,
      enum: ["loss", "gain"],
    },
    currentVal: Number,
    targetVal: Number,
    unit: {
      type: String,
      enum: ["kg", "lbs"],
    },
    startDate: Date,
    endDate: Date,
    isAchieved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Goal = model<IGoal>("Goal", goalSchema);
export default Goal;
