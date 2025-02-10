class ApiError extends Error {
    constructor(statusCode, message) {
      super(message); // Call parent constructor (Error)
      this.statusCode = 
      statusCode; // Store HTTP status code
     
    }
  }
  
  export default ApiError;

  
//   If you prefer a function, you can do this:

// const ApiError = (statusCode, message) => {
//   const error = new Error(message);
//   error.statusCode = statusCode;
//   return error;
// };

// export default ApiError;