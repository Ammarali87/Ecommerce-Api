import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from "cors";
import compression from 'compression';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

import errorMiddleware from './middleware/errorMiddleware.js';
import { connect } from './config/mongo.js';
import amarRoutes from './routes/amar.js';
import authRoutes from './routes/authRoute.js';
import storeRoutes from './routes/store.js';
import brandRoute from './routes/brandRoute.js';
import productRoutes from './routes/productRoute.js';
import subCategoryRoute from './routes/subCategoryRoute.js';
import ApiError from './utils/ApiError.js';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.options('*', cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log("Morgan enabled in development");
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour in mili second
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
  app.use  
// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true,
   limit: '10kb' }));
      
// Security middleware
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
  whitelist: ['price', 
    'sold', 'quantity', 
    'ratingsAverage',
     'ratingsQuantity']
}));
app.use(compression());

// Handle favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Connect to database
connect();

// Routes
app.use("/api/v1/auth", authRoutes);   
app.use("/api/v1/amar", amarRoutes);   
app.use("/api/v1", storeRoutes);   
app.use("/api/v1/products", productRoutes);   
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/categories/:categoryId/subcategories', subCategoryRoute);
app.use("/api/v1/brands", brandRoute);

// Base route
app.get('/', (req, res) => {
  res.send("Hello World");
});

// Handle 404 routes
app.all("*", (req, res, next) => {
   next(new ApiError(400, `Route not found: ${req.originalUrl}`));
});    

// Global error handler
app.use(errorMiddleware);

export default app;




// import errorMiddleware from './middleware/errorMiddleware.js';
// import dotenv from 'dotenv';
// import express, { urlencoded } from 'express';
// import { connect } from './config/mongo.js';
// import amarRoutes from './routes/amar.js';
// import authRoutes from './routes/authRoute.js';
// import storeRoutes from './routes/store.js';
// import brandRoute from './routes/brandRoute.js';
// import productRoutes from './routes/productRoute.js';
// import subCategoryRoute from './routes/subCategoryRoute.js';
// import cors from "cors";
// import ApiError from './utils/ApiError.js';

// dotenv.config(); // 📌 يجب أن يكون في البداية قبل استخدام أي متغير بيئي

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors()); 

// app.get('/favicon.ico', (req, res) =>
//    res.status(204));

// // الاتصال بقاعدة البيانات
// connect()

// // استخدام المسارات
// app.use("/api/v1/auth", authRoutes);   
// app.use("/api/v1/amar", amarRoutes);   
// app.use("/api/v1", storeRoutes);   
// app.use("/api/v1/products", productRoutes);   
// // مفروض يكون زي ده
// //       /api/v1/categories'
// app.use('/api/v1/subcategories', subCategoryRoute);
// //   nested routes GET/POST
// app.use('/api/v1/categories/:categoryId/subcategories', subCategoryRoute);
// app.use("/api/v1/brands", brandRoute);

// // نقطة الوصول الأساسية
// app.get('/', (req, res) => {
//   res.send("Hello donkey World");
// });

// // إذا حد حاول يزور مسار غير موجود، هيرجع 
// // JSON زي ده:
// app.all("*", (req, res, next) => {
//    next(new ApiError(400 , "Route not Found "+req.originalUrl)); // pass to global error function
// });    

// app.use(errorMiddleware); // Handles all errors



// const PORT = process.env.PORT || 4000;
// const server = app.listen(PORT, () => {
//   console.log(`Server started at http://localhost:${PORT}`);
// });
    
// // any error not stop the server in promise
// // handle error outside express
// process.on("unhandledRejection", (err) => {
//   console.log(`Unhandled Rejection: ${err.message} |  ${err.name}`);
//   console.log(err.stack);
//   server.close(()=>{
//     console.err("shuting down...")
//   // exit the process in production use ejx
//     process.exit(1);
//   })  
// });




// // import errorMiddleware from './middleware/errorMiddleware.js'
// // import dotenv from 'dotenv';
// // import express, { urlencoded } from 'express';
// // import { connect } from './config/mongo.js';
// // import amarRoutes from './routes/amar.js';
// // import authRoutes from './routes/authRoute.js';
// // import storeRoutes from './routes/store.js';
// // import brandRoute from './routes/brandRoute.js';
// // import productRoutes from './routes/productRoute.js';
// // import subCategoryRoute from './routes/subCategoryRoute.js';
// // import cors from "cors";
// // import ApiError from './utils/ApiError.js';

// // dotenv.config(); // 📌 يجب أن يكون في البداية قبل استخدام أي متغير بيئي

// // const app = express();

// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(cors()); 

// // app.get('/favicon.ico', (req, res) =>
// //    res.status(204));

// // // الاتصال بقاعدة البيانات
// // connect()

// // // استخدام المسارات
// // app.use("/api/v1/auth", authRoutes);   
// // app.use("/api/v1/amar", amarRoutes);   
// // app.use("/api/v1", storeRoutes);   
// // app.use("/api/v1/products", productRoutes);   
// // // مفروض يكون زي ده
// // //       /api/v1/categories'
// // app.use('/api/v1/subcategories', subCategoryRoute);
// // //   nested routes GET/POST
// // app.use('/api/v1/categories/:categoryId/subcategories', subCategoryRoute);
// // app.use("/api/v1/brands", brandRoute);

// // // نقطة الوصول الأساسية
// // app.get('/', (req, res) => {
// //   res.send("Hello donkey World");
// // });

// // // إذا حد حاول يزور مسار غير موجود، هيرجع 
// // // JSON زي ده:
// // app.all("*", (req, res, next) => {
// //    next(new ApiError(400 , "Route not Found "+req.originalUrl)); // pass to global error function
// // });    

// // app.use(errorMiddleware); // Handles all errors

// // const PORT = process.env.PORT || 4000;
// // const server = app.listen(PORT, () => {
// //   console.log(`Server started at http://localhost:${PORT}`);
// // });
    
// // // any error not stop the server in promise
// // // handle error outside express
// // process.on("unhandledRejection", (err) => {
// //   console.log(`Unhandled Rejection: ${err.message} |  ${err.name}`);
// //   console.log(err.stack);
// //   server.close(()=>{
// //     console.err("shuting down...")
// //   // exit the process in production use ejx
// //     process.exit(1);
// //   })  
// // });


