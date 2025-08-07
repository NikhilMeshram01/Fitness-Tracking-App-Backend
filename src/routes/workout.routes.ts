import express from "express";
import {
  createNewWorkout,
  deleteWorkout,
  getAllWorkouts,
  getWorkout,
  updateWorkout,
} from "../controllers/workout.controllers.js";
import { authenticateJWT } from "../utils/jwt.js";
import { validate } from "../middlewares/validate.js";
import { workoutSchema } from "../validators/workout.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.post("/", validate(workoutSchema), createNewWorkout);
router.get("/", getAllWorkouts);
router.get("/:id", getWorkout);
router.put("/:id", validate(workoutSchema), updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
