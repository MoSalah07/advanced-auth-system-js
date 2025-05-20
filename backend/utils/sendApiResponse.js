export const sendApiResponse = (
  res,
  { status = 200, message = "", success = true, data = null }
) => {
  return res.status(status).json({
    status,
    message,
    success,
    data,
  });
};
