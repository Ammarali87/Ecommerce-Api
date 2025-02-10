import { useState, useEffect } from "react";
import axios from "axios";
import { Category } from "./types/element";

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); 
  // 🔹 تتبع الصفحة الحالية
  const [totalPages, setTotalPages] = useState(1);
   // 🔹 عدد الصفحات الكلي
  const limit = 5; // 🔹 عدد الفئات لكل صفحة

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ✅ طلب البيانات مع الترقيم (Pagination)
        const { data } = await axios.get(`http://localhost:3000/api/v1/categories?page=${page}&limit=${limit}`);
        console.log("API Response:", data);

        setCategories(data.data);
        setTotalPages(Math.ceil(data.totalCount / limit)); // ✅ تصحيح الحساب
    } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [page]); // ✅ إعادة تحميل عند تغيير الصفحة

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>

      {error && <p className="text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : categories.length > 0 ? (
        <>
          <ul className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex flex-col items-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
              >
                <img
                  src={category.image || "https://via.placeholder.com/100"} // ✅ صورة افتراضية إن لم توجد صورة
                  alt={category.name}
                  className="w-20 h-20 object-cover rounded-md shadow"
                />
                <span className="mt-2 text-lg font-semibold text-gray-700 text-center">
                  {category.name}
                </span>
              </li>
            ))}
          </ul>

          {/* ✅ أزرار الترقيم (Pagination Buttons) */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              ◀ Previous
            </button>
            <span className="px-4 py-2 bg-gray-100 rounded">{`Page ${page} of ${totalPages}`}</span>
        
            <button
              onClick={() => setPage((prev) => 
                Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            > 
              Next ▶
            </button>
          </div>
        </>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
};

export default HomePage;




