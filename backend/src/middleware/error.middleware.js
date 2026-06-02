const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  
  const isDev = process.env.NODE_ENV !== "production";
  
  const response = {
    status: status,
    code: err.code || "INTERNAL_ERROR",
    message: (status === 500 && !isDev) ? "Internal Server Error" : (err.message || "Something went wrong"),
    details: isDev ? err.details : undefined
  };

  if (status === 500) {
    console.error(err);
  } else {
    console.log(`[Error] ${status}: ${response.message}`);
  }

  return res.status(status).json(response);
};

module.exports = { errorHandler };