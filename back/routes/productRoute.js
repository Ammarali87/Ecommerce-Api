import { Router } from "express";
import { 
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getFeaturedProducts,
  updateProductRating
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
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/",getProductValidator, getProducts);
router.get("/:id", getProduct);

// Protected routes (add auth middleware later)
router.post(
  "/add-product", createProductValidator,
  upload.single("imageCover"),
  createProduct
);

router
  .route("/:id")
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

// Rating route
router.patch(
  "/:id/rating",
  updateProductRating
);

export default router;