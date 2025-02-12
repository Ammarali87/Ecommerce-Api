const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const response = {
    status: err.status,
    message: err.message,
  };
     // just add stack and statusCode in dev
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack ;
    response.statusCode =  err.statusCode
  }
   // run every seinario
  res.status(err.statusCode).json(response);
};

export default errorHandler;
