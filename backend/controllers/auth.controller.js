import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../email/index.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
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
