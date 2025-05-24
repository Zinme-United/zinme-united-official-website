import express from "express";
import {
  forgotPassword,
  getUserProfile,
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);

router.get("/profile", protect, getUserProfile);
export default router;
