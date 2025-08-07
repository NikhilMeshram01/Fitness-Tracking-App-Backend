import express from "express";
import { createGoal, getAllGoals } from "../controllers/goal.controllers.js";
import { authenticateJWT } from "../utils/jwt.js";
import { validate } from "../middlewares/validate.js";
import { goalSchema } from "../validators/goal.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.post("/", validate(goalSchema), createGoal);
router.get("/", getAllGoals);

export default router;
