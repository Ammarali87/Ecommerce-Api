import errorMiddleware from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import express from 'express';
import { connect } from './config/mongo.js';
import amarRoutes from './routes/amar.js';
import authRoutes from './routes/authRoute.js';
import storeRoutes from './routes/store.js';
import brandRoute from './routes/brandRoute.js';
import productRoutes from './routes/productRoute.js';
import subCategoryRoute from './routes/subCategoryRoute.js';
import cors from "cors";
import ApiError from './utils/ApiError.js';

dotenv.config(); // 📌 يجب أن يكون في البداية قبل استخدام أي متغير بيئي

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

app.get('/favicon.ico', (req, res) =>
   res.status(204));

// الاتصال بقاعدة البيانات
connect()

// استخدام المسارات
app.use("/api/v1/auth", authRoutes);   
app.use("/api/v1/amar", amarRoutes);   
app.use("/api/v1", storeRoutes);   
app.use("/api/v1/products", productRoutes);   
// مفروض يكون زي ده
//       /api/v1/categories'
app.use('/api/v1/subcategories', subCategoryRoute);
//   nested routes GET/POST
app.use('/api/v1/categories/:categoryId/subcategories', subCategoryRoute);
app.use("/api/v1/brands", brandRoute);

// نقطة الوصول الأساسية
app.get('/', (req, res) => {
  res.send("Hello donkey World");
});

// إذا حد حاول يزور مسار غير موجود، هيرجع 
// JSON زي ده:
app.all("*", (req, res, next) => {
   next(new ApiError(400 , "Route not Found "+req.originalUrl)); // pass to global error function
});    

app.use(errorMiddleware); // Handles all errors

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
    
// any error not stop the server in promise
// handle error outside express
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection: ${err.message} |  ${err.name}`);
  console.log(err.stack);
  server.close(()=>{
    console.err("shuting down...")
  // exit the process in production use ejx
    process.exit(1);
  })  
});


 

