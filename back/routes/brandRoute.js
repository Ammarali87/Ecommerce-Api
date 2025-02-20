import { Router } from "express";
import { 
  CreateBrand, 
  getOneBrand, 
  getBrands,  
  updateBrand, 
  deleteBrand 
} from "../controller/BrandController.js";
import upload from "../middleware/uploadMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import { validateDelete, validateId, validateUpdate } from "../utils/validator/validateId.js";

const router = Router();

// ✅ إضافة علامة تجارية جديدة
router.post("/add-brand", upload.single("image"), CreateBrand);

// ✅ جلب جميع العلامات التجارية
router.get("/brands", getBrands);

// ✅ جلب علامة تجارية واحدة باستخدام الـ ID
router.get("/brand/:id", validateId, validationMiddleware, getOneBrand);

// ✅ تحديث وحذف العلامة التجارية باستخدام ID
router
  .route("/:id")
  .put(validateUpdate, validationMiddleware, updateBrand)
  .delete(validateDelete, validationMiddleware, deleteBrand);

export default router;

