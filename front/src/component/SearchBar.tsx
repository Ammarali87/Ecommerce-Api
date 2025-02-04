import { useState, useEffect } from "react";
import axios from "axios";
import { Category , SearchBarProps } from "../types/element"; // Importing the Category interface



const SearchBar = ({ onSearch }: SearchBarProps) => {
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
        const { data } = await
         axios.get(`/api/v1/search?q=${query}`);
        setSuggestions(data.categories);
      } catch (err) {
        setError("Error fetching suggestions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce delay (300ms)

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (categoryName: string) => {
    setQuery(categoryName);
    setSuggestions([]);
    onSearch(categoryName);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Search Suggestions */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((category) => (
  <li key={category._id} onClick={() => handleSelect(category.name)}>
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
