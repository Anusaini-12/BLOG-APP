import express from "express";
import { deleteAllUsers, deleteAllBlogs } from "../controllers/adminController.js";
import protect from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.delete("/users", protect, isAdmin, deleteAllUsers);
router.delete("/blogs", protect, isAdmin, deleteAllBlogs);

export default router;
