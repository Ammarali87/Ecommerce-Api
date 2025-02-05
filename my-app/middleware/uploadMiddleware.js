import multer from "multer";


// (temporary storage before uploading 
// to Cloudinary)
const storage = multer.memoryStorage();

 //pass var Obj in multer to
 //  Store file in memory
const upload = multer({ storage });

export default upload;
