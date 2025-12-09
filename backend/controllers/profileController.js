import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";
import cloudinary from '../config/cloudinary.js';

/* ------------ UPDATE PROFILE (name, bio, profilePic) ------------ */
export const updateProfile = expressAsyncHandler(async (req, res) => {
  
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  const { name, bio, deletePic } = req.body;

  if (name) user.name = name;
  if (bio) user.bio = bio;

  // Delete profile picture if requested
  if (deletePic === "true") {
    user.profilePic = "";
  }

  // Upload new profile picture using memory buffer
if (req.file) {
  try {
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "profiles" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(req.file.buffer);
    });
    user.profilePic = uploaded.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500);
    throw new Error("Failed to upload profile picture");
  }
}

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

/* ------------ FOLLOW USER ------------ */
export const followUser = expressAsyncHandler(async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (!userToFollow) {
    res.status(404);
    throw new Error("User not found!");
  }

  if (userToFollow.followers.includes(currentUser._id)) {
    res.status(400);
    throw new Error("Already following this user");
  }

  userToFollow.followers.push(currentUser._id);
  currentUser.following.push(userToFollow._id);

  await userToFollow.save();
  await currentUser.save();

  res.status(200).json({ 
    message: "User followed successfully!",
    currentUser: currentUser,
    user: userToFollow,
  });
});


/* ------------ UNFOLLOW USER ------------ */
export const unfollowUser = expressAsyncHandler(async (req, res) => {
  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (!userToUnfollow) {
    res.status(404);
    throw new Error("User not found!");
  }

  userToUnfollow.followers = userToUnfollow.followers.filter(
    (id) => id.toString() !== currentUser._id.toString()
  );

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== userToUnfollow._id.toString()
  );

  await userToUnfollow.save();
  await currentUser.save();

  res.status(200).json({ 
    message: "User unfollowed successfully!",
    currentUser: currentUser,
    user: userToUnfollow,
  });
});

/* ------------ GET MY PROFILE ------------ */
export const getMyProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password")
    .populate("followers", "name profilePic")
    .populate("following", "name profilePic")
    .populate("savedBlogs"); 

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  res.status(200).json(user);
});


/* ------------ GET USER BY ID (PUBLIC PROFILE) ------------ */
export const getUserById = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("name profilePic bio followers following") 
    .populate("followers", "name profilePic")
    .populate("following", "name profilePic");

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  res.status(200).json({
    success: true,
    user,
  });
});

/* ------------ SAVE / UNSAVE BLOG ------------ */
export const toggleSaveBlog = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  const blogId = req.params.blogId;
  const idString = blogId.toString();

  let message = "";

  if (user.savedBlogs.includes(idString)) {
    user.savedBlogs = user.savedBlogs.filter(id => id.toString() !== idString);
    message = "Blog removed from saved posts.";
  } else {
    user.savedBlogs.push(idString);
    message = "Blog saved successfully.";
  }

  await user.save();

  return res.status(200).json({
    message,
    savedBlogs: user.savedBlogs,   
  });
});

