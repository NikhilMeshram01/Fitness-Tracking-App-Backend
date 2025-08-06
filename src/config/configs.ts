import dotenv from "dotenv";
dotenv.config();

export const PORT: string = process.env.PORT!;
export const NODE_ENV: string = process.env.NODE_ENV!;

export const MONGODB_URI: string = process.env.MONGODB_URI!;

export const JWT_ACCESS_SECRET_KEY: string = process.env.JWT_ACCESS_SECRET_KEY!;
export const JWT_ACCESS_EXPIRES_IN: string = process.env.JWT_ACCESS_EXPIRES_IN!;

export const JWT_REFRESH_SECRET_KEY: string =
  process.env.JWT_REFRESH_SECRET_KEY!;
export const JWT_REFRESH_EXPIRES_IN: string =
  process.env.JWT_REFRESH_EXPIRES_IN!;
