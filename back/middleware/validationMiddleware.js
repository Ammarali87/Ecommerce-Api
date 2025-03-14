import { validationResult } from "express-validator";

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();  
  }
  res.status(400).json({ errors: errors.array() }); // إرجاع الأخطاء كـ JSON
};

export default validationMiddleware;



// import { validationResult } from "express-validator";

// const validationMiddleware = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   next(); // إذا لم تكن هناك أخطاء، انتقل إلى المعالج التالي
// };

// export default validationMiddleware;
