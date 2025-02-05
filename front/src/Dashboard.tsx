import  { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

export default function Dashboard() {
  const [categoryName, setCategoryName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  // Handle changes in the file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryName || !selectedFile) {
      setMessage("Please provide both a category name and an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", selectedFile);

    try {
      const { data } = await axios.post("/api/v1/add-category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Category added successfully!");
      console.log("Category added:", data);
      // Optionally reset the form fields:
      setCategoryName("");
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error adding category:", error);
      setMessage(
        error.response?.data?.message ||
          "An error occurred while adding the category."
      );
    }
  };

  return (
    <div className="dashboard p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {message && (
        <p className="mb-4 text-center text-sm text-red-500">{message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="block mb-1 font-medium">
            Category Name:
          </label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1 font-medium">
            Category Image:
          </label>
          <input
            id="image"
            type="file"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}






// import { useState, FormEvent, ChangeEvent } from "react";
// import axios from "axios";

// export default function Dashboard() {
//   const [categoryName, setCategoryName] = useState<string>("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null); // ✅ عرض معاينة للصورة
//   const [message, setMessage] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false); // ✅ حالة التحميل

//   // Handle file input change
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setSelectedFile(file);

//       // ✅ عرض معاينة للصورة قبل الرفع
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!categoryName || !selectedFile) {
//       setMessage("⚠️ Please provide both a category name and an image.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", categoryName);
//     formData.append("image", selectedFile);

//     try {
//       setLoading(true); // ✅ تفعيل التحميل
//       const { data } = await axios.post("/api/v1/add-category", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("✅ Category added successfully!");
//       console.log("Category added:", data);

//       // ✅ إعادة تعيين الحقول بعد الرفع
//       setCategoryName("");
//       setSelectedFile(null);
//       setPreview(null);
//     } catch (error: any) {
//       console.error("Error adding category:", error);
//       setMessage(
//         error.response?.data?.message || "❌ An error occurred while adding the category."
//       );
//     } finally {
//       setLoading(false); // ✅ إيقاف التحميل
//     }
//   };

//   return (
//     <div className="dashboard p-4 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

//       {message && <p className="mb-4 text-center text-sm text-red-500">{message}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Category Name Input */}
//         <div>
//           <label htmlFor="categoryName" className="block mb-1 font-medium">
//             Category Name:
//           </label>
//           <input
//             id="categoryName"
//             type="text"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter category name"
//           />
//         </div>

//         {/* Image Input */}
//         <div>
//           <label htmlFor="image" className="block mb-1 font-medium">
//             Category Image:
//           </label>
//           <input id="image" type="file" onChange={handleFileChange} className="w-full" />

//           {/* ✅ معاينة الصورة قبل الرفع */}
//           {preview && (
//             <div className="mt-2">
//               <p className="text-sm text-gray-500">Preview:</p>
//               <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow" />
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
//           disabled={loading} // ✅ تعطيل الزر أثناء التحميل
//         >
//           {loading ? "Uploading..." : "Add Category"}
//         </button>
//       </form>
//     </div>
//   );
// }
