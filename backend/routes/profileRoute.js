import express from "express";
import upload from "../middleware/multer.js";
import protect from "../middleware/auth.js";
import {
  updateProfile,
  followUser,
  unfollowUser,
  getMyProfile,
  getUserById,
  toggleSaveBlog
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.put("/update", protect, upload.single("profilePic"), updateProfile);

router.put("/follow/:id", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);
router.put("/save-blog/:blogId", protect, toggleSaveBlog);

router.get("/:id", getUserById);

export default router;
