import User from "../models/userModel.js";
import Blog from "../models/blog.js";

/* ------------------ Delete all users (Admin Only) ------------------ */
export const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({ role: { $ne: "admin" } });

    res.status(200).json({
      message: "All users deleted except admin",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ Delete all blogs (Admin Only) ------------------ */
export const deleteAllBlogs = async (req, res) => {
  try {
    await Blog.deleteMany({});
    return res.status(200).json({ message: "All blogs deleted!" });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting blogs",
      error: error.message,
    });
  }
};
