import { Document, Schema, Types, model } from "mongoose";

export interface IWorkout extends Document {
  user: Types.ObjectId;
  duration: number;
  caloriesBurned: number;
  workoutDate: Date;
  exerciseType: "cardio" | "strength" | "yoga" | "flexibility";
}

const workoutSchema = new Schema<IWorkout>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    duration: Number,
    caloriesBurned: Number,
    workoutDate: Date,
    exerciseType: {
      type: String,
      enum: ["cardio", "strength", "yoga", "flexibilty"],
    },
  },
  { timestamps: true }
);

const workout = model<IWorkout>("workout", workoutSchema);
export default workout;
