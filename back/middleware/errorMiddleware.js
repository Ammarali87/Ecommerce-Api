const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const response = {
    status: err.status,
    message: err.message,
  };    
 // just add stack and statusCode in dev
  if (process.env.NODE_ENV === 'development') {
    response.statusCode =  err.statusCode
    response.stack = err.stack ;
  }
   // run every seinario
  res.status(err.statusCode).json(response);
  
  // console.log("Environment:", process.env.NODE_ENV);
};

export default errorHandler;
