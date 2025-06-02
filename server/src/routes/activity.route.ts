import express from "express";
import { authorizeRoles, protect } from "../middleware/auth.middleware";
import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivityById,
  updateActivity,
} from "../controllers/activity.controller";

const router = express.Router();

router.get("/", getActivities);
router.get("/:id", getActivityById);

router.post("/", protect, authorizeRoles("admin"), createActivity);
router.put("/:id", protect, authorizeRoles("admin"), updateActivity);
router.delete("/:id", protect, authorizeRoles("admin"), deleteActivity);

export default router;
