import { useState, useEffect } from "react";
import axios from "axios";
import { Category } from "./types/element"; // تأكد أن الملف موجود

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data } = await axios.get("http://localhost:3000/api/v1/categories");
        console.log("Fetched categories:", data); // تأكد من البيانات

        if (data?.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          throw new Error("Invalid data format: categories not found.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>

      {error && <p className="text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : categories.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <li
              key={category._id}
              className="flex flex-col items-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              <img
                src={category.image}
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
        <p>No categories found.</p>
      )}
    </div>
  );
};

export default HomePage;
