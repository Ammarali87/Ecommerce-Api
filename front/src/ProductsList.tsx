import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

interface Product {
  _id: string;
  title: string;
  brand: string;
  price: number;
}

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceMin: "",
    priceMax: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: "6",
          ...filters,
        });

        const { data } = await axios.get(
          `http://localhost:3000/api/v1/products?${query}`
        );
        setProducts(data.products || []);
        setTotalPages(Math.ceil(data.totalCount / 6) || 1);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [page, filters]);

  // Fetch categories & brands
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [{ data: categories }, { data: brands }] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/categories"),
          axios.get("http://localhost:3000/api/v1/brands/getbrands"),
        ]);
        setCategories(categories.categories || []);
        setBrands(brands.brands || []);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchFilters();
  }, []);

  // Handle filter change
  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Products</h2>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <select name="category" onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select name="brand" onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <input type="number" name="priceMin" placeholder="Min Price" onChange={handleFilterChange} className="p-2 border rounded-md w-24" />
        <input type="number" name="priceMax" placeholder="Max Price" onChange={handleFilterChange} className="p-2 border rounded-md w-24" />
      </div>

      {/* Loading & Products */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p._id} className="p-4 border rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-gray-600">Brand: {p.brand}</p>
              <p className="text-gray-800 font-bold">${p.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">No products found</div>
      )}

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-30">
            Previous
          </button>
          <span className="text-lg font-medium">
            Page {page} of {totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-30">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
