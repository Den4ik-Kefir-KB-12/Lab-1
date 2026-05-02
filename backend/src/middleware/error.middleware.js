const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  
  const response = {
    status: status,
    code: err.code || "INTERNAL_ERROR",
    message: err.message || "Something went wrong",
    details: err.details || undefined
  };

  if (status === 500) {
    console.error(err);
  } else {
    console.log(`[Error] ${status}: ${response.message}`);
  }

  return res.status(status).json(response);
};

module.exports = { errorHandler };