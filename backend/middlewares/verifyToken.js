import jwt from "jsonwebtoken";
import { sendApiResponse } from "../utils/sendApiResponse.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      sendApiResponse(res, {
        status: 401,
        message: "Unauthorized - no token provided",
        success: false,
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY.toString());

    if (typeof decoded === "string" || !("userId" in decoded)) {
      sendApiResponse(res, {
        status: 401,
        message: "Unauthorized - invalid token",
        success: false,
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(`Error in verifyToken middleware: ${err}`);
    sendApiResponse(res, {
      status: 500,
      message: "server error",
      success: false,
    });
    return;
  }
};
