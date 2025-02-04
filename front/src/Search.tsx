import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Category } from "./types/element"; // Importing the Category interface

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await
         axios.get(`/api/v1/search?q=${query}`);
        setResults(data.categories);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div>
      <h2>Search Results for: {query}</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {results.length > 0 ? (
        <ul>
          {results.map((category) => (
            <li key={category._id}>{category.name}</li>
          ))}
        </ul>
      ) : (
        !loading && <p>No results found</p>
      )}
    </div>
  );
};

export default SearchPage;
