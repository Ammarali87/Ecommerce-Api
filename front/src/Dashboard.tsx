import { useState , ChangeEvent, FormEvent, useRef } from "react";
import axios from "axios";
// h-auto 
// reader.onloadend = ()=>{
  // reader.result
// }
// reader.readAsDataURL(file)
// reader.readAsText()
// reader.readAsArrayBuffer()
// useState<File | null>(null);
//onChange={(e)=>setFile()}
// e.tar.fileS.[0]  
//handleSubmit try{} Async(e:React.FormEvent)=>
//.files?.[0] || null  files?  files?.[0]or files[0]
// file input no need to value 

//  version 2
// e: ChangeEvent<> or FormEvent<HTMLFromElem orInputE..>
// && ()
{/* <button */} 
 //use disabe ? in btn
//           disabled={loading} // ✅ تعطيل الزر أثناء التحميل
//         >
//           {loading ? "Uploading..." : "Add Category"}
//  </button>

 //const {data} in axios.post toshow log(data,"")


 export default function Dashboard() {
  const [categoryName, setCategoryName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]|| null
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result ? String(reader.result) : "");
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoryName || !selectedFile) {
      setMessage("⚠️ Please provide both a category name and an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/add-category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Category added successfully!");
      console.log("Category added:", data);

      setCategoryName("");
      setSelectedFile(null);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // إعادة ضبط الإدخال
      }

    } catch (error: any) {
      console.error("Error adding category:", error);
      setMessage(error.response?.data?.message || "❌ An error occurred while adding the category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {message && <p className="mb-4 text-center text-sm text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="block mb-1 font-medium">Category Name:</label>
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
          <label htmlFor="image" className="block mb-1 font-medium">Category Image:</label>
          <input
            id="image"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full"
          />

          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Preview:</p>
              <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}

