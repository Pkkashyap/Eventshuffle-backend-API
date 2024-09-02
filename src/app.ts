import express from "express";
import eventRoutes from "./routes/EventRoutes";
import { connectDB } from "./utils/db";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/AuthRoutes";
import { config } from "dotenv";
import { authorize } from "../src/middlewares/authorize";

config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/event", authorize, eventRoutes);

// handler for undefined routes
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);

// Database Connection
connectDB();

export default app;
