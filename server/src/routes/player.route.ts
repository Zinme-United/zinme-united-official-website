import express from "express";
import {
  createPlayer,
  deletePlayer,
  getPlayerById,
  getPlayers,
  updatePlayer,
  uploadPlayerImage,
} from "../controllers/player.controller";
import { authorizeRoles, protect } from "../middleware/auth.middleware";
import {
  handleUploadError,
  uploadSingle,
} from "../middleware/upload.middleware";

const router = express.Router();

router.post(
  "/upload-image",
  uploadSingle,
  handleUploadError,
  uploadPlayerImage
);

// Public Routes
router.get("/", getPlayers);
router.get("/:id", getPlayerById);

// Private Routes
router.post(
  "/",
  protect,
  authorizeRoles("admin", "editor"),
  uploadSingle,
  handleUploadError,
  createPlayer
);
router.put("/:id", protect, authorizeRoles("admin", "editor"), updatePlayer);
router.delete("/:id", protect, authorizeRoles("admin", "editor"), deletePlayer);

export default router;
