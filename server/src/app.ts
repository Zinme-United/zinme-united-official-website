import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";

import requestLogger from "./middleware/requestLogger";

import playerRoutes from "./routes/player.route";
import authRoutes from "./routes/auth.route";
import coachRoutes from "./routes/coach.route";

import errorHandler from "./middleware/error.middleware";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(requestLogger);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/coaches", coachRoutes);

app.get("/", (req, res) => {
  res.send("Football Team Website Backend API is running...");
});

app.use(errorHandler);

export default app;
