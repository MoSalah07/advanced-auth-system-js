import express from "express";
import "dotenv/config";
import { connectDB } from "./db.js";
import authRouter from "./routes/auth.route.js";
// Cookie parser
import cookieParser from "cookie-parser";
// Cors
import cors from "cors";

const PORT = process.env.PORT || 9000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
