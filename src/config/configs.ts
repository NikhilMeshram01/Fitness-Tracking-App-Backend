import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";
dotenv.config();

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const CLIENT_URL = getEnvVar("CLIENT_URL");
export const NODE_ENV = getEnvVar("NODE_ENV");
export const PORT = Number(process.env.PORT) || 5000; // ensure PORT is a number

export const MONGODB_URI = getEnvVar("MONGODB_URI");

export const JWT_ACCESS_SECRET_KEY = getEnvVar("JWT_ACCESS_SECRET_KEY");
export const JWT_ACCESS_EXPIRES_IN: SignOptions["expiresIn"] = (process.env
  .JWT_ACCESS_EXPIRES_IN || "5m") as SignOptions["expiresIn"];

export const JWT_REFRESH_SECRET_KEY = getEnvVar("JWT_REFRESH_SECRET_KEY");
export const JWT_REFRESH_EXPIRES_IN: SignOptions["expiresIn"] = (process.env
  .JWT_REFRESH_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
