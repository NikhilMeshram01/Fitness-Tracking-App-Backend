import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  role: string;
  level: "beginner" | "intermediate" | "advanced";
  profilePicture: string;
  createdAt: Date;
  updatedAt: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase:true
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    dob: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    height: Number,
    weight: Number,
    profilePicture:String,
    level: {
        type:String,
        enum:["beginner", "intermediate" , "advanced"],
        default:'beginner'
    }
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
