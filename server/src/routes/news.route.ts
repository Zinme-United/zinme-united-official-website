// server/src/routes/newsRoutes.ts
import express from "express";
import {
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews,
  uploadNewsImage,
} from "../controllers/news.controller";
import { authorizeRoles, protect } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";

const router = express.Router();

// Public routes for news
router.get("/", getNews);
router.get("/:id", getNewsById);

// Private routes for news management (Admin/Editor)
// Route for uploading a single news image (pre-upload for news articles)
router.post(
  "/upload-image",
  protect,
  authorizeRoles("admin", "editor"),
  uploadSingle,
  uploadNewsImage
);

router.post("/", protect, authorizeRoles("admin", "editor"), createNews);
router.put("/:id", protect, authorizeRoles("admin", "editor"), updateNews);
router.delete("/:id", protect, authorizeRoles("admin"), deleteNews);

export default router;
