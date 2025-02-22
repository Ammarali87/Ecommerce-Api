import { useState, ChangeEvent, FormEvent, useRef } from "react";
import axios from "axios";

export default function Dashboard() {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    quantity: "",
    price: "",
    category: "",
    brand: "",
    imageUrl: "" // Added imageUrl field
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setProductData(prev => ({ ...prev, imageUrl: "" })); // Clear imageUrl when file is selected

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProductData(prev => ({ ...prev, imageUrl: url }));
    setSelectedFile(null); // Clear selected file
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreview(url); // Show URL preview
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!productData.title || !productData.description || !productData.price || !productData.category) {
      setMessage("⚠️ Please fill all required fields");
      return;
    }

    if (!selectedFile && !productData.imageUrl) {
      setMessage("⚠️ Please provide either an image file or URL");
      return;
    }

    try {
      setLoading(true);
      let requestData;
      let headers = {};

      if (selectedFile) {
        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
          if (key !== 'imageUrl') formData.append(key, value);
        });
        formData.append("imageCover", selectedFile);
        requestData = formData;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        requestData = {
          ...productData,
          imageCover: productData.imageUrl
        };
        headers = { "Content-Type": "application/json" };
      }

      const { data } = await axios.post(
        "http://localhost:3000/api/v1/products/add-product",
        requestData,
        { headers }
      );

      setMessage("✅ Product added successfully!");
      console.log("Product added:", data);

      // Reset form
      setProductData({
        title: "",
        description: "",
        quantity: "",
        price: "",
        category: "",
        brand: "",
        imageUrl: ""
      });
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error: any) {
      console.error("Error adding product:", error);
      setMessage(error.response?.data?.message || "❌ Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

      {message && (
        <p className={`mb-4 text-center text-sm ${
          message.includes("✅") ? "text-green-500" : "text-red-500"
        }`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title:
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={productData.title}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Product description"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block mb-1 font-medium">
              Price:
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={productData.price}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block mb-1 font-medium">
              Quantity:
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={productData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block mb-1 font-medium">
            Category ID:
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={productData.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Category ID"
            required
          />
        </div>

        <div>
          <label htmlFor="brand" className="block mb-1 font-medium">
            Brand ID:
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={productData.brand}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brand ID"
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block mb-1 font-medium">
            Image URL:
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={productData.imageUrl}
            onChange={handleImageUrlChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="text-center text-sm text-gray-500 my-2">- OR -</div>

        <div>
          <label htmlFor="imageCover" className="block mb-1 font-medium">
            Upload Image:
          </label>
          <input
            id="imageCover"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full"
            accept="image/*"
          />
        </div>

        {preview && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Preview:</p>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-auto rounded-lg shadow" 
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}