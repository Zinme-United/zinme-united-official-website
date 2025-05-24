import express from "express";
import {
  createPlayer,
  deletePlayer,
  getPlayerById,
  getPlayers,
  updatePlayer,
} from "../controllers/player.controller";
import { authorizeRoles, protect } from "../middleware/auth.middleware";

const router = express.Router();

// Public Routes
router.get("/", getPlayers);
router.get("/:id", getPlayerById);

// Private Routes
router.post("/", protect, authorizeRoles("admin", "editor"), createPlayer);
router.put("/:id", protect, authorizeRoles("admin", "editor"), updatePlayer);
router.delete("/:id", protect, authorizeRoles("admin", "editor"), deletePlayer);

export default router;
