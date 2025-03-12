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

const router = Router();

// Public routes
router.get("/", getAllProducts);  // ✅ Changed from getProducts
router.get("/:id", getProductValidator, getProduct);

// Protected routes
router.post(
  "/add-product", 
  createProductValidator,
  upload.single("imageCover"),
  createProduct
);

router
  .route("/:id")
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

export default router;