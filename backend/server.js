import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import logger from './middleware/logger.js';
import userRoute from './routes/userRoute.js';
import blogRoute from './routes/blogRoute.js'
import { errorHandler } from './middleware/error.js';
import uploadRoute from "./routes/uploadRoute.js";
import profileRoute from "./routes/profileRoute.js";
import adminRoute from "./routes/adminRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", adminRoute);

app.use("/api/user", userRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/profile", profileRoute);

app.use(errorHandler);


connectDB();

app.get("/", (req, res) => {
  res.send("Blog API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});