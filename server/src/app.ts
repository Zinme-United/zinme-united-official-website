import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";

import requestLogger from "./middleware/requestLogger";

import playerRoutes from "./routes/player.route";
import authRoutes from "./routes/auth.route";
import coachRoutes from "./routes/coach.route";
import galleryRoutes from "./routes/gallery.route";
import activityRoutes from "./routes/activity.route";
import newsRoutes from "./routes/news.route";
import ourClubRoutes from "./routes/ourclub.route";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: [
      "https://zmutd.vercel.app",
      "https://zinme-united-official-website.onrender.com",
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(requestLogger);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/galleries", galleryRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/our-club", ourClubRoutes);

app.get("/", (req, res) => {
  res.send("Football Team Website Backend API is running...");
});

app.use(errorHandler);

export default app;
