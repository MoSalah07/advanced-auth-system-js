import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const jwtSecret = process.env.JWT_SECRET_KEY;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }

  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};
