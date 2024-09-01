import express from "express";
import eventRoutes from "./routes/EventRoutes";
import { connectDB } from "./utils/db";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/event", eventRoutes);

// handler for undefined routes
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);

// Database Connection
connectDB();

export default app;
