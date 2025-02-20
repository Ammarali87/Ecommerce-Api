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
import validationMiddleware from "../middleware/validationMiddleware.js";
import { validateId, validateUpdate, validateDelete } from "../utils/validator/validateId.js";

const router = Router();

// Public routes
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/", getProducts);
router.get("/:id", validateId, validationMiddleware, getProduct);

// Protected routes (add auth middleware later)
router.post(
  "/add-product", 
  upload.single("imageCover"),
  createProduct
);

router
  .route("/:id")
  .put(validateUpdate, validationMiddleware, updateProduct)
  .delete(validateDelete, validationMiddleware, deleteProduct);

// Rating route
router.patch(
  "/:id/rating",
  validateId,
  validationMiddleware,
  updateProductRating
);

export default router;