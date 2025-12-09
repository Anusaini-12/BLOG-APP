import mongoose from "mongoose";
import colors from 'colors';

const connectDB = async () => {
   try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected: ".cyan);
   } catch (err){
      console.log(`ERROR: ${err.message}`);
      process.exit(1);
   }
};

export default connectDB;