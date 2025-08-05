import express from "express";
import { createGoal, getAllGoals } from "../controllers/goal.controllers.js";

const router = express.Router();

router.post('/', createGoal)
router.get('/', getAllGoals)

export default router;
