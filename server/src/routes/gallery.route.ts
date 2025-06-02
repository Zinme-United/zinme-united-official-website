import express from "express";
import { authorizeRoles, protect } from "../middleware/auth.middleware";
import {
  createGallery,
  deleteGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  uploadGalleryImage,
} from "../controllers/gallery.controller";
import { uploadSingle } from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", getGalleries);
router.get("/:id", getGalleryById);

router.post(
  "/upload-image",
  protect,
  authorizeRoles("admin"),
  uploadSingle,
  uploadGalleryImage
);
router.post("/", protect, authorizeRoles("admin"), createGallery);
router.put("/:id", protect, authorizeRoles("admin"), updateGallery);
router.delete("/:id", protect, authorizeRoles("admin"), deleteGallery);

export default router;
