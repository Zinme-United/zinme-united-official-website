import express from "express";
import { authorizeRoles, protect } from "../middleware/auth.middleware";
import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivityById,
  updateActivity,
  uploadTeamLogo,
} from "../controllers/activity.controller";
import {
  uploadActivityLogos,
  uploadSingle,
} from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", getActivities);
router.get("/:id", getActivityById);

router.post(
  "/upload-logo",
  protect,
  authorizeRoles("admin", "editor"),
  uploadSingle,
  uploadTeamLogo
);
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  uploadActivityLogos,
  createActivity
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  uploadActivityLogos,
  updateActivity
);
router.delete("/:id", protect, authorizeRoles("admin"), deleteActivity);

export default router;
