import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      role?: string;
      // add other properties your auth middleware attaches
    };
  }
}
