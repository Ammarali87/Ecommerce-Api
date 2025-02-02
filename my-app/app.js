import dotenv from 'dotenv';
import express from 'express';
import { connect } from './config/mongo.js';
import amarRoutes from './routes/amar.js';
import authRoutes from './routes/authRoute.js';
import storeRoutes from './routes/store.js';
  
dotenv.config(); // 📌 يجب أن يكون في البداية قبل استخدام أي متغير بيئي

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الاتصال بقاعدة البيانات
connect()

// استخدام المسارات
app.use("/api/v1/auth", authRoutes);  // كل مسارات التوثيق داخل /api/auth
app.use("/api/v1/amar", amarRoutes);  // مسارات "أمار" داخل /api/amar
app.use("/api/v1", storeRoutes);  // مسارات "أمار" داخل /api/amar
  //  no name of route jsut any name with any string

// نقطة الوصول الأساسية
app.get('/', (req, res) => {
  res.send("Hello donkey World");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
