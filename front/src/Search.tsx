import { useState, useEffect } from "react";
import axios from "axios";
import { Category, SearchBarProps } from "./types/element";




const SearchPage = ({ onSearch = () => {} }: SearchBarProps) => {
 
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get(`/api/v1/search?q=${query}`);
        setSuggestions(data.categories || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching suggestions.");
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Search categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && <p className="text-gray-500 mt-2">Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="mt-2 bg-white shadow-lg rounded-lg overflow-hidden">
          {suggestions.map((category) => (
            <li
              key={category._id}
              onClick={() => onSearch(category.name)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
