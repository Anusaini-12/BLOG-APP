import cloudinary from "../config/cloudinary.js";
import expressAsyncHandler from "express-async-handler";

export const uploadImage = expressAsyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  const folder = req.body.folder || "general"; 
  
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(req.file.buffer);
  });

  res.status(200).json({
    success: true,
    url: result.secure_url,
  });
});
