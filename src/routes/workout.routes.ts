import express from "express";
import {
  createNewWorkout,
  deleteWorkout,
  getAllWorkouts,
  getWorkout,
  updateWorkout,
} from "../controllers/workout.controllers.js";

const router = express.Router();

router.post("/", createNewWorkout)
router.get("/", getAllWorkouts);
router.get("/:id", getWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
