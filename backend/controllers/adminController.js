import User from "../models/userModel.js";
import Blog from "../models/blog.js";
import expressAsyncHandler from "express-async-handler";


/* ------------------ Get all users (Admin Only) ------------------ */
export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/* ------------------ Get all Blogs (Admin Only) ------------------ */
export const getAllBlogs = expressAsyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate("author", "name profilePic");
  res.json(blogs);
});

/* ------------------ Delete all users (Admin Only) ------------------ */
export const deleteAllUsers = expressAsyncHandler(async (req, res) => {
  try {
    const result = await User.deleteMany({ role: { $ne: "admin" } });

    res.status(200).json({
      message: "All users deleted except admin",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------ Delete all blogs (Admin Only) ------------------ */
export const deleteAllBlogs = expressAsyncHandler(async (req, res) => {
  try {
    await Blog.deleteMany({});
    return res.status(200).json({ message: "All blogs deleted!" });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting blogs",
      error: error.message,
    });
  }
});

/* Delete single user */
export const deleteUserById = expressAsyncHandler(async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

/* Delete single blog */
export const deleteBlogById = expressAsyncHandler(async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
});

/* ------------------ Get Dashboard Stats (Admin Only) ------------------ */
export const getDashboardStats = expressAsyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    // ✅ Correct way to count total views (views is an array)
    const totalViewsAgg = await Blog.aggregate([
      { $unwind: "$views" },
      { $group: { _id: null, totalViews: { $sum: 1 } } }
    ]);

    const totalViews = totalViewsAgg[0]?.totalViews || 0;

    res.status(200).json({
      totalUsers,
      totalBlogs,
      totalViews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------ Get Blog Viewers (Admin Only) ------------------ */
export const getViewers = expressAsyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate("views.user", "name email");

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.status(200).json({
    totalViews: blog.views.length,
    viewers: blog.views
      .filter(v => v.user) 
      .map(v => ({
        _id: v.user._id,
        name: v.user.name,
        email: v.user.email,
        viewedAt: v.viewedAt,
      })),
  });
});
