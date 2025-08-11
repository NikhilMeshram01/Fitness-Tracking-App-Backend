import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controllers.js";
import { authenticateJWT } from "../utils/jwt.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { loginLimiter } from "../config/rateLimiter.js";

const router = express.Router();

router.post("/register", loginLimiter, validate(registerSchema), registerUser);
router.post("/login", loginLimiter, validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authenticateJWT, getUserProfile);

export default router;
