import express from "express";
import {
  createCoach,
  deleteCoach,
  getCoachById,
  getCoaches,
  updateCoach,
} from "../controllers/coach.controller";
import { authorizeRoles, protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getCoaches);
router.get("/:id", getCoachById);

router.post("/", protect, authorizeRoles("admin", "editor"), createCoach);

router.put("/:id", protect, authorizeRoles("admin", "editor"), updateCoach);

router.delete("/:id", protect, authorizeRoles("admin"), deleteCoach);

export default router;
