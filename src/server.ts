import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import { PORT } from "./config/configs.js";
import { globalErrorHandler } from "./utils/errorHandler.js";

dotenv.config();

const server = express();

// middlewares
server.use(helmet());
server.use(cors());
server.use(express.json());

// health check
server.get("/health", (req, res) => res.json({ status: "OK" }));

// routes
server.use("/api/v1/users", authRoutes);
server.use("/api/v1/workouts", workoutRoutes);
server.use("/api/v1/goals", goalRoutes);

// 404 handler
server.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// global error handler
server.use(globalErrorHandler);

// connect to DB and start server
connectDB()
  .then(() => {
    console.log("mongodb connected successfully");
    const port = PORT || 5001;
    server.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("mongodb connection failed:", error);
    process.exit(1);
  });
