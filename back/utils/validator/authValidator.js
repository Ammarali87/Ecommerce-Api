const signupValidation = [
    check('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    
    check('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    
    check('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^\+[1-9]\d{1,14}$/)
      .withMessage('Please provide a valid phone number with country code'),
    
    validationMiddleware
  ];