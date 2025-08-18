import dotenv from "dotenv";
dotenv.config();

import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import { CLIENT_URL, PORT } from "./config/configs.js";
import { globalErrorHandler } from "./utils/errorHandler.js";
import { apiLimiter } from "./config/rateLimiter.js";

const server: Application = express();
const upload = multer({ dest: "uploads/" });

// CORS setup
server.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Allow cookies, authorization headers
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// // middlewares
server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

// // health check
server.get("/health", (req: Request, res: Response) =>
  res.json({ status: "OK" })
);

// RATE LIMITER
server.use("/api", apiLimiter);

// server static files
// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // routes
const API_PREFIX = "/api/v1";
server.use(`${API_PREFIX}/users`, authRoutes);
server.use(`${API_PREFIX}/workouts`, workoutRoutes);
server.use(`${API_PREFIX}/goals`, goalRoutes);

// 404 handler
// server.all("*", (req: Request, res: Response) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // global error handler
server.use(globalErrorHandler);

// // connect to DB and start server
connectDB()
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((error) => {
    console.error("mongodb connection failed:", error);
    process.exit(1);
  });

const port = PORT || 5001;
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
