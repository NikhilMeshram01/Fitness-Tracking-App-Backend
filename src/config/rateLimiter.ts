import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

interface RateLimiterOptions {
  windowMs: number;
  max?: number;
  message?: string;
  keyGenerator?: (req: Request) => string; // Optional function to generate a unique key per client (defaults to IP)
}

export const createRateLimiter = ({
  windowMs = 60 * 1000, // 1 minute
  max = 60, // 60 requests per window
  message = "Too many requests, please try again.",
  keyGenerator,
}: RateLimiterOptions) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Send rate limit info in standard headers (RateLimit-*)
    legacyHeaders: false, // Disable legacy rate limit headers (X-RateLimit-*)
    keyGenerator: (req: Request) => req.body?.email || req.ip, // Uses email from request body if available; otherwise defaults to IP address
    handler: (req: Request, res: Response, next: NextFunction) => {
      console.warn(`Rate limit exceeded for: ${req.ip}`);
      res.status(429).json({
        success: false,
        message,
      });
    },
  });
};

export const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1  minute
  max: 100,
});
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15  minute
  max: 100,
  message: "Too many attempts. Please try again later",
});
