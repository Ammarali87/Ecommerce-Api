const errorHandler = (err, req, res, next) => {
  // const statusCode = err.statusCode || 500;
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};
export default errorHandler