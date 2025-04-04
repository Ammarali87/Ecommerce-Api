import { Router } from "express";
import { 
  createProduct,
  getAllProducts,    // ✅ Changed from getProducts
  getProduct,
  updateProduct,
  deleteProduct
} from "../controller/productController.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductValidator,
} from '../utils/validator/prodcutValidate.js';

import { protect, allowedTo } from "../controller/authController.js";

const router = Router();

// Public routes - no authentication needed
router.get("/", getAllProducts);  // ✅ Changed from getProducts
router.get("/:id", getProductValidator, getProduct);


   // i forgot  upload.single("imageCover"),
// Protected routes - need authentication
router
  .route("/add-product")
  .post(     
    protect, // Check if user is logged in
    allowedTo("admin", "manager"), // Only allow admin/manager roles
    upload.single("imageCover"),
    createProduct
  );   


 
router
.route("/:id")
.put(
  protect,
  allowedTo("admin", "manager"),
  updateProductValidator,
  updateProduct
)
.delete(
  protect, 
  allowedTo("admin"), // Only admin can delete
 deleteProductValidator, deleteProduct
);

//////////////////

// Only authenticated users


// Admin or manager
router.post("/products",
   protect, allowedTo("admin", "manager"), createProduct);

// Multiple roles with different HTTP methods
router.route("/orders")
  .get(protect, allowedTo("admin", "manager", "user")) // All can view
  .post(protect, allowedTo("user")) // Only users can create
  .delete(protect, allowedTo("admin")); // Only admin can delete





export default router;







