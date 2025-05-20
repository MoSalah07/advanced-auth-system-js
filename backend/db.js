import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is not defined in environment variables");
    }
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
