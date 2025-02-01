import dotenv from 'dotenv';
import express from 'express';
import { connect } from './config/mongo.js';
import amarRoutes from './routes/amar.js';
import authRoutes from './routes/auth.js';

dotenv.config(); // 📌 يجب أن يكون في البداية قبل استخدام أي متغير بيئي

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الاتصال بقاعدة البيانات
connect().then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

// استخدام المسارات
app.use("/api/auth", authRoutes);  // كل مسارات التوثيق داخل /api/auth
app.use("/api/amar", amarRoutes);  // مسارات "أمار" داخل /api/amar

// نقطة الوصول الأساسية
app.get('/', (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
