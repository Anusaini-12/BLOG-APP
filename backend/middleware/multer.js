import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB limit
});

export default upload;
