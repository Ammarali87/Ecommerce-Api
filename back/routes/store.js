import { Router } from "express";
import { 
  addCategory, 
  getOneCategory, 
  getCategories, 
  searchCategories, 
  theFuzzySearch, 
  updateCategory, 
  deleteCategory 
} from "../controller/storeController.js";
import upload from "../middleware/uploadMiddleware.js";
import { param, validationResult } from "express-validator";

const router = Router();

// Validation middleware for ID
const validateId = [
  param("id").isMongoId().withMessage("Invalid ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed to the actual handler
  }
];

// Add Category (POST)
router.post("/add-category", upload.single("image"), addCategory);

// Get all categories
router.get("/categories", getCategories);

// Get a single category by ID
router.get("/category/:id", validateId, getOneCategory);

// Search categories
router.get("/search", searchCategories);
router.get("/fuzzy-search", theFuzzySearch); 

// Update and Delete a category by ID
router
  .route("/:id")
  .post(validateId, updateCategory) // Use PUT instead of POST for updating
  .delete(validateId, deleteCategory);

export default router;




























// // router.post('/newcategory', addCategory);


// router
//   .route("/:id")
//   .get(validateId, getOneCategory) // Apply validation before executing getOneCategory
//   .post(updateCategory) // No ID validation needed here (unless required)
//   .delete(validateId, deleteCategory); // Apply validation before executing deleteCategory

// export default router;



// // nested post get delete use this  
// // router.route("/:id").get(getOneCategory)
// //  one use this router.get("",fun)

// // router.get('/search', searchCategories); // Example: /api/v1/search?query=tv



