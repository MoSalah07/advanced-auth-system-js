import { Resend } from "resend";
import "dotenv/config";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

if (!process.env.RESEND_TOKEN) {
  throw new Error("RESEND_TOKEN is not defined");
}

const resend = new Resend(process.env.RESEND_TOKEN.toString());

export const sendVerificationEmail = async (email, token) => {
  try {
    const res = await resend.emails.send({
      from: "welcome to our app <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to Our App - Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(`verificationCode`, token),
    });
    console.log(`Email to ${email} Sent Successfully`);
    return res;
  } catch (err) {
    console.error(`Error Sending Email Verification: ${err}`);
    throw new Error(`Error Sending Email Verification: ${err}`);
  }
};

export const sendVerifedEmail = async (email) => {
  try {
    const res = await resend.emails.send({
      from: "welcome to our app <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to Our App - Verify your email",
      html: VERIFICATION_EMAIL.replace(`email`, email),
    });
    console.log(`sendVerifedEmail to ${email} Sent Successfully`);
    return res;
  } catch (err) {
    console.error(`Error Sending Email Verification: ${err}`);
    throw new Error(`Error Sending Email Verification: ${err}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const res = await resend.emails.send({
      from: "Reset Password <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log(`Password Reset Email Sent Successfully`, res);
    return res;
  } catch (err) {
    console.error(`Error Sending Password Reset Email: ${err}`);
    throw new Error(`Error Sending Password Reset Email: ${err}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const res = await resend.emails.send({
      from: "Reset Password <onboarding@resend.dev>",
      to: email,
      subject: `Password ${email} Reset Successful`,
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log(`Password Reset Email: ${email} Sent Successfully`, res);
  } catch (err) {
    console.error(`Error Sending Password Reset Success Email: ${err}`);
    throw new Error(`Error Sending Password Reset Success Email: ${err}`);
  }
};
