import { useState, useEffect } from "react";
import axios from "axios";
import { Category } from "./types/element"; // تأكد أن هذا الملف موجود
  //  error was setcategroy(data.categories) not setto categers
   
const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/v1/categories");
        console.log("Fetched categories:", data);

        // تأكد إنك بتحصل على المصفوفة فقط من الكائن المسترجع
        setCategories(data.categories); 
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category._id}>{category.name}</li>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
