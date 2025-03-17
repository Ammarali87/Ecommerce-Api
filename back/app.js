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
import cookieParser from "cookie-parser";
import csrf from "csurf"; // Add this import

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
 // protect headers
app.use(helmet());
app.use(cors());
// why and what happen without 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.options('*', cors());
app.use(cookieParser());
// app.use(cookieParser(process.env.COOKIE_SECRET || 'your-secret-key'));
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Route to get CSRF token
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
}); 
 
// example of route we protected
app.post("/submit", (req, res) => {
  res.send("Form submitted successfully!");
});


// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log("Morgan enabled in development");
}

// Limit requests from same IP
// DDOS ATTACK  
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour in mili second
  message: 'Too many requests from this IP, please try again in an hour!'
}); 
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


   //  Security middleware
// sql/mongo injection 
app.use(mongoSanitize());
// protect comment /search/login input
app.use(xss());
// prevent parameter pollution 
// only take Array whatelist:["price","sold"]
// تمنع تمرير نفس المعامل أكثر من مرة.
// تضمن أن كل معامل يتم معالجته مرة واحدة فقط.
// القائمة البيضاء (whitelist) تسمح ببعض المعاملات التي قد تحتاج إلى قيم متعددة.
app.use(hpp({
  whitelist: ['price', 
    'sold', 'quantity', 
    'ratingsAverage',
     'ratingsQuantity']
})); 
app.use(compression()); // compress all resonses

// Handle favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Connect to database
connect();

// Routes
const apiRouter = express.Router();
app.use("/api/v1", apiRouter);

// Updated routes without /api/v1 prefix
apiRouter.use("/auth", authRoutes);   
apiRouter.use("/amar", amarRoutes);   
apiRouter.use("/", storeRoutes);   
apiRouter.use("/products", productRoutes);   
apiRouter.use('/subcategories', subCategoryRoute);
apiRouter.use('/categories/:categoryId/subcategories', subCategoryRoute);
apiRouter.use("/brands", brandRoute);


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



//  in front 

import axios from "axios";
//  // remove 
// async function getCsrfToken() {
//   const res = await axios.get("http://localhost:3000/csrf-token", {
//     withCredentials: true, // ضروري لإرسال واستقبال الـ Cookies
//   });
//   return res.data.csrfToken;
// }

// async function submitForm(data) {
//   const csrfToken = await getCsrfToken();

//   await axios.post("http://localhost:3000/submit", 
//     data, {
//     headers: {
//       "Content-Type": "application/json", // optional
//       "CSRF-Token": csrfToken, // إرسال التوكن مع الطلب
//     },
//     withCredentials: true, // ضروري لو السيرفر بيستخدم الـ Cookies
//   });
// }

 


// بدل ما تضيف withCredentials: true في كل طلب، ممكن تضبط Axios افتراضيًا:

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // تفعيل الكوكيز لكل الطلبات
});

// الحصول على التوكن
async function getCsrfToken() {
  const res = await axiosInstance.get("/csrf-token");
  return res.data.csrfToken;
} 

// إرسال البيانات
// send token in headers 
// يجبر الكلاينت على طلبه وإرساله يدويًا،
async function submitForm(data) {
  const csrfToken = await getCsrfToken();
  await axiosInstance.post("/submit", data, {
    headers: { "CSRF-Token": csrfToken },
  });
}   