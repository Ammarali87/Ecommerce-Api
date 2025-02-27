import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Add these interfaces after the existing interfaces
// interface Category {
//   _id: string;
//   name: string;
// }

// interface Brand {
//   _id: string;
//   name: string;
// }

// Add these states inside your Dashboard component
// const [categories, setCategories] = useState<Category[]>([
//   { _id: "3454554343", name: "Electronics" },
//   { _id: "3454554344", name: "Clothing" },
//   { _id: "3454554345", name: "Books" },
//   // Add more categories as needed
// ]);

// const [brands, setBrands] = useState<Brand[]>([
//   { _id: "7454554343", name: "Apple" },
//   { _id: "7454554344", name: "Samsung" },
//   { _id: "7454554345", name: "Nike" },
//   // Add more brands as needed
// ]);

interface ProductData {
  title: string;
  description: string;
  quantity: string;  // Will be converted to number before sending
  price: string;     // Will be converted to number before sending
  category: string;
  brand: string;
}

interface UploadedImage {
  file: File;
  preview: string;
}

export default function Dashboard() {
  const [formData, setFormData] = useState<ProductData>({
    title: "",
    description: "",
    quantity: "",
    price: "",
    category: "",
    brand: "",
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setMessage("⚠️ Maximum 5 images allowed");
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };


const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (images.length === 0) {
    setMessage("⚠️ Please upload at least one image");
    return;
  }

  try {
    setLoading(true);
    const formDataToSend = new FormData();

    // Convert string values to appropriate types
    const processedData = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    };

    // Append form data one by one
    formDataToSend.append("title", processedData.title);
    formDataToSend.append("description", processedData.description);
    formDataToSend.append("price", processedData.price.toString());
    formDataToSend.append("quantity", processedData.quantity.toString());
    formDataToSend.append("category", processedData.category);
    formDataToSend.append("brand", processedData.brand);

    // Handle images separately
    // First image as cover
    formDataToSend.append("imageCover", images[0].file);
    
    // Additional images
    const additionalImages = images.slice(1);
    additionalImages.forEach((img) => {
      formDataToSend.append("images", img.file);
    });

    const { data } = await axios.post(
      "http://localhost:3000/api/v1/products/add-product",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMessage("✅ Product added successfully!");
    resetForm();
  } catch (error: any) {
    console.error("Error details:", error.response?.data);
    setMessage(error.response?.data?.message || "❌ Error adding product");
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      quantity: "",
      price: "",
      category: "",
      brand: "",
    });
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.includes("✅") ?
             "bg-green-50 text-green-700" :
              "bg-red-50 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Product Title"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
           
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Brand"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Product Images (Max 5)
              </label>
              <span className="text-sm text-gray-500">
                {images.length}/5 images
              </span>
            </div>
            
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="w-full"
              disabled={images.length >= 5}
            />

            <div className="grid grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6
                             flex items-center justify-center opacity-0 group-hover:opacity-100
                             transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700
                     transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Creating Product...
              </span>
            ) : (
              "Create Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}




// Replace the existing category and brand inputs with these select elements
{/* <select
  name="category"
  value={formData.category}
  onChange={handleInputChange}
  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
  required
>
  <option value="">Select Category</option>
  {categories.map((category) => (
    <option key={category._id} value={category._id}>
      {category.name}
    </option>
  ))}
</select> */}

// <select
//   name="brand"
//   value={formData.brand}
//   onChange={handleInputChange}
//   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//   required
// >
//   <option value="">Select Brand</option>
//   {brands.map((brand) => (
//     <option key={brand._id} value={brand._id}>
//       {brand.name}
//     </option>
//   ))}
// </select>