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
// if any input like name id must add vaildate

// ✅ إضافة علامة تجارية جديدة
router.post("/add-brand", upload.single("image"), CreateBrand);

// ✅ جلب جميع العلامات التجارية
router.get("/getbrands", getBrands);


router   
.route("/:id")
// ✅ جلب علامة تجارية واحدة باستخدام الـ ID
.get(validateId, validationMiddleware,getOneBrand)
// ✅ تحديث وحذف العلامة التجارية باستخدام ID
  .put(validateUpdate, validationMiddleware, updateBrand)
  .delete(validateDelete, validationMiddleware, deleteBrand);

export default router;

