import { useState, useEffect } from "react";
import './App.css'

import axios from "axios";


function App() {
  interface Category {
    _id: string;
    name: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories"); // Uses Vite proxy
        setCategories(data);
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
        {categories.map((category) => (
          <li key={category?._id}>{category?.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
