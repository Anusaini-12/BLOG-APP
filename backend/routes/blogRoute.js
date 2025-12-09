import express from 'express';
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";
import protect from "../middleware/auth.js";
import { 
    addComment, 
    createBlog, 
    deleteBlog, 
    deleteComment,
    getBlog, 
    getBlogs, 
    getComments, 
    toggleLike, 
    updateBlog, 
    updateComment
} from '../controllers/blogController.js';

const router = express.Router();

router.post("/", protect, upload.single("image"), createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlog); 
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);   

router.put("/:id/like", protect, toggleLike);

router.get("/:id/comments", getComments)
router.post("/:id/comments", protect, addComment); 
router.put("/:id/comments/:commentId", protect, updateComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

export default router;
