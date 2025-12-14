import User from "../models/userModel.js";
import Blog from "../models/blog.js";


/* ------------------ Get all users (Admin Only) ------------------ */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/* ------------------ Get all Blogs (Admin Only) ------------------ */
export const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find()
    .populate("author", "name profilePic");
  res.json(blogs);
}

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

/* Delete single user */
export const deleteUserById = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

/* Delete single blog */
export const deleteBlogById = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
};

/* ------------------ Get Dashboard Stats (Admin Only) ------------------ */
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    // sum up views
    const totalViewsAgg = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = totalViewsAgg[0]?.totalViews || 0;

    res.status(200).json({ totalUsers, totalBlogs, totalViews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
