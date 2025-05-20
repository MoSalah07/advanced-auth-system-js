export const validationAuth = (data) => {
  if ("email" in data && !data.email?.trim()) {
    return new Error("Email is required");
  }

  if ("password" in data && !data.password?.trim()) {
    return new Error("Password is required");
  }

  if ("password" in data && data.password && data.password.trim().length < 6) {
    return new Error("password must be at least 6 characters");
  }

  if ("username" in data && !data.username?.trim()) {
    return new Error("Username is required");
  }

  if ("username" in data && data.username && data.username.trim().length < 4) {
    return new Error("Username must be at least 4 characters");
  }

  if ("token" in data && !data.token?.trim()) {
    return new Error("Token is invalid");
  }

  if ("code" in data && !data.code?.trim()) {
    return new Error("Code is invalid");
  }

  return null;
};
