import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendVerifedEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../email/index.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { sendApiResponse } from "../utils/sendApiResponse.js";
import { validationAuth } from "../utils/validation.js";

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // ✅ Validation
    const error = validationAuth({ email, password, username });
    if (error) {
      sendApiResponse(res, {
        status: 400,
        message: error.message,
        success: false,
      });
      return;
    }
    // ✅ Check for existing user
    const userAleradyExists = await User.findOne({ email });
    if (userAleradyExists) {
      sendApiResponse(res, {
        status: 400,
        message: "User already exists",
        success: false,
      });
      return;
    }
    // ✅ Hash password and generate verification token
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();
    // ✅ Create user
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // ✅ Set JWT cookie
    generateTokenAndSetCookie(res, newUser._id.toString());

    // ✅ Send verification email
    sendVerificationEmail(newUser.email, verificationToken);
    // ✅ Success response
    sendApiResponse(res, {
      status: 201,
      message: "user created",
      success: true,
      data: {
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        isVerified: newUser.isVerified,
        lastLogin: newUser.lastLogin,
      },
    });
    return;
  } catch (err) {
    sendApiResponse(res, { status: 500, message: `some went wrong ${err}` });
    return;
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const error = validationAuth({ email, password });
    if (error) {
      return sendApiResponse(res, {
        status: 400,
        message: error.message,
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendApiResponse(res, {
        status: 404,
        message: `User not found`,
        success: false,
      });
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return sendApiResponse(res, {
        status: 401,
        message: `Invalid credentials`,
        success: false,
      });
    }

    // ✅ Set JWT cookie
    generateTokenAndSetCookie(res, user._id.toString());

    // ✅ Set Last Login
    user.lastLogin = new Date();
    await user.save();

    // ✅ Success response
    sendApiResponse(res, {
      status: 200,
      message: "user logged in",
      success: true,
      data: {
        email: user.email,
        username: user.username,
        _id: user._id,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified,
        verificationToken: user.verificationToken,
        verificationTokenExpiresAt: user.verificationTokenExpiresAt,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

export const logout = async (_req, res) => {
  try {
    res.clearCookie("token");
    sendApiResponse(res, {
      status: 200,
      message: "User is logged out successfully",
      success: true,
    });
    return;
  } catch (err) {
    console.log(err);
    sendApiResponse(res, { status: 500, message: `Internal server error` });
    return;
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const error = validationAuth({ code });
    if (error) {
      sendApiResponse(res, {
        status: 400,
        message: error.message,
        success: false,
      });
      return;
    }
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      sendApiResponse(res, {
        status: 400,
        message: "Invalid verification code",
        success: false,
      });
      return;
    }
    user.isVerified = false;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendVerifedEmail(user.email);
    sendApiResponse(res, {
      status: 201,
      message: "Email verified successfully",
      success: true,
      data: {
        email: user.email,
        username: user.username,
        _id: user._id,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified,
      },
    });
    return;
  } catch (err) {
    console.log(err);
    sendApiResponse(res, {
      status: 500,
      success: false,
      message: `Internal server error`,
    });
    return;
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const error = validationAuth({ email });
    if (error) {
      sendApiResponse(res, {
        status: 400,
        message: error.message,
        success: false,
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      sendApiResponse(res, {
        status: 400,
        message: "User not found",
        success: false,
      });
      return;
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    sendApiResponse(res, {
      status: 200,
      message: "Password reset email sent successfully",
      success: true,
    });
    return;
  } catch (err) {
    console.log(err);
    sendApiResponse(res, { status: 500, message: `Internal server error` });
    return;
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const error = validationAuth({ token, password });
    if (error) {
      sendApiResponse(res, {
        status: 400,
        message: error.message,
        success: false,
      });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      sendApiResponse(res, {
        status: 400,
        message: "Invalid or expired token",
        success: false,
      });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    sendApiResponse(res, {
      status: 200,
      message: "Password reset successfully",
      success: true,
    });
    return;
  } catch (err) {
    console.log(err);
    sendApiResponse(res, { status: 500, message: `Internal server error` });
    return;
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      sendApiResponse(res, {
        status: 401,
        message: "Unauthorized - no token provided",
        success: false,
      });
      return;
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      sendApiResponse(res, {
        status: 401,
        message: "Unauthorized - user not found",
        success: false,
      });
      return;
    }

    sendApiResponse(res, {
      status: 200,
      message: "User is authenticated successfully",
      success: true,
      data: {
        email: user.email,
        username: user.username,
        _id: user._id,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified,
      },
    });
    return;
  } catch (err) {
    console.log(`Error in checkAuthCtr: ${err}`);
    sendApiResponse(res, { status: 500, message: `Internal server error` });
    return;
  }
};
