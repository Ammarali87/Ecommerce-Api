import { useState, useEffect } from "react";
import axios from "axios";
import { Category } from "./types/element"; // تأكد أن هذا الملف موجود
  //  error was setcategroy(data.categories) not setto categers
  //  {cate.length > 0 ? ():() }
 //  useState(Categorites[])
 // intila load and repeat useEffect
 //  trigger fetchCategories() in useEffect


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
      {categories.length > 0 ? (
     <ul className="grid grid-cols-2 gap-4">
     {categories.map((category) => (
       <li
         key={category._id}
         className="flex flex-col items-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
       >
         <img
           src={category.image} // تأكد أن `category.image` يحتوي على رابط الصورة الصحيح
           alt={category.name}
           className="w-20 h-20 object-cover rounded-md shadow"
         />
         <span className="mt-2 text-lg font-semibold text-gray-700 text-center">
           {category.name}
         </span>
       </li>
     ))}
   </ul>
   
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HomePage;
