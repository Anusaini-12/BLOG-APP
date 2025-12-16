import express from "express";
import { 
  deleteAllUsers, 
  deleteAllBlogs,
  getAllUsers,
  getAllBlogs,
  deleteUserById,
  deleteBlogById,
  getDashboardStats,
  getViewers
} from "../controllers/adminController.js";
import protect from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Get all users
router.get("/users", protect, isAdmin, getAllUsers);

// Get all blogs
router.get("/blogs", protect, isAdmin, getAllBlogs);

// Delete all users
router.delete("/users", protect, isAdmin, deleteAllUsers);

// Delete all blogs
router.delete("/blogs", protect, isAdmin, deleteAllBlogs);

// Delete single user
router.delete("/users/:id", protect, isAdmin, deleteUserById);

// Delete single blog
router.delete("/blogs/:id", protect, isAdmin, deleteBlogById);

// Get dashboard stats
router.get("/dashboard", protect, isAdmin, getDashboardStats);

router.get("/:id/viewers", protect, isAdmin, getViewers);

export default router;
