import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { JWT_ACCESS_SECRET_KEY } from "../config/configs.js";

interface Payload {
  userId: string;
  role?: string;
}

export const generateToken = (
  payload: Payload,
  secret: string,
  expiresIn: string = "2m"
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): Payload => {
  try {
    const decoded = jwt.verify(token, secret) as Payload;
    return decoded;
  } catch (error) {
    console.log("JWT verification failed : ", error);
    throw new Error("Invalid or Expired Token");
  }
};

export interface AuthRequest extends Request {
  user?: { userId: string; role?: string };
  token?: string;
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "token missing or malformed",
    });
  }

  const token: string = authHeader.split(" ")[1]!;

  try {
    const user = verifyToken(token, JWT_ACCESS_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "invalid or expired token" });
  }
};
