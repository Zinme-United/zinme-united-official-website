import express from "express";
import multer from "multer";
import {
  createOurClub,
  deleteOurClub,
  getOurClub,
  patchOurClub,
  updateAbout,
  uploadOurClubHeroImage,
} from "../controllers/ourclub.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public
router.get("/", getOurClub);

// Admin (protect these in your app)
router.post("/", /*protect, admin,*/ createOurClub);
router.put("/", /*protect, admin,*/ updateAbout);
router.patch("/", /*protect, admin,*/ patchOurClub);
router.delete("/", /*protect, admin,*/ deleteOurClub);

// Image upload for hero
router.post(
  "/upload-image",
  /*protect, admin,*/ upload.single("image"),
  uploadOurClubHeroImage
);

export default router;
