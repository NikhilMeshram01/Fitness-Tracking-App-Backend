import express from "express";
import {
  createGoal,
  deleteGoal,
  getAllGoals,
  getGoal,
  updateGoal,
  markCompleted,
} from "../controllers/goal.controllers.js";
import { authenticateJWT } from "../utils/jwt.js";
import { validate } from "../middlewares/validate.js";
import { goalSchema } from "../validators/goal.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.post("/", validate(goalSchema), createGoal);
router.get("/", getAllGoals);
router.put("/:id", updateGoal);
router.patch("/:id", markCompleted);
router.delete("/:id", deleteGoal);
router.get("/:id", getGoal);

export default router;
