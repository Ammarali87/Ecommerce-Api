import catchAsync from '../utils/catchAsync.js'
import SubCategory from "../models/SubCategoriesModel.js"



export const subCategory = catchAsync( async (req,res,next) => {
  const {name , category} = req.name ; 

  if (!name) return next(new ApiError(400, "Category name is required"));
  const newSubCategory = SubCategory.create({
   name , 
   slug:slugify(name,{lower:true,strict:true})
   ,category
 }) 
 res.status(201).json({ status: "success", newSubCategory });
})