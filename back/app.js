import errorMiddleware from './middleware/errorMiddleware.js'
import dotenv from 'dotenv';
import express from 'express';
import { connect } from './config/mongo.js';
import amarRoutes from './routes/amar.js';
import authRoutes from './routes/authRoute.js';
import storeRoutes from './routes/store.js';
import cors from "cors";

dotenv.config(); // 📌 يجب أن يكون في البداية قبل استخدام أي متغير بيئي

const app = express();

app.use(cors()); // Allow frontend to call backend
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
// إذا حد حاول يزور مسار غير موجود، هيرجع 
// JSON زي ده:
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find this route: ${req.originalUrl}`);
  next(err); // لازم تمرر الـ error object كامل
});    

app.use(errorMiddleware); // Handles all errors

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
    



 // front Search Bar + Searchpage

// import { useState } from "react";

// const SearchBar = ({ onSearch }) => {
//   const [query, setQuery] = useState("");

//   const handleSearch = () => {
//     if (query.trim() !== "") {
//       onSearch(query);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search categories..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <button onClick={handleSearch}>Search</button>
//     </div>
//   );
// };

// export default SearchBar;



// import { useState } from "react";
// import axios from "axios";
// import SearchBar from "./SearchBar";

// const SearchPage = () => {
//   const [categories, setCategories] = useState([]);

//   const handleSearch = async (query) => {
//     try {
//       const { data } = await axios.get(`/api/v1/search?query=${query}`);
//       setCategories(data.categories);
//     } catch (error) {
//       console.error("Search error:", error);
//     }
//   };

//   return (
//     <div>
//       <SearchBar onSearch={handleSearch} />
//       <ul>
//         {categories.map((category) => (
//           <li key={category._id}>{category.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchPage;
