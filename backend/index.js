import express from "express";
import "dotenv/config";
import { connectDB } from "./db.js";
import authRouter from "./routes/auth.route.js";

const PORT = process.env.PORT || 9000;
const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
