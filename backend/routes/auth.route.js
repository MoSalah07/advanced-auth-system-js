import express from "express";
import { register } from "../controllers/auth.controller.js";
// import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

// router.get(`/check-auth`, verifyToken, checkAuthCtr);

router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", logout);

// router.post(`/verify-email`, verifyEmailCtr);
// router.post(`/forget-password`, forgetPasswordCtr);
// router.post(`/reset-password/:token`, resetPasswordCtr);

export default router;
