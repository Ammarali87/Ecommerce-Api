import {Schema ,model} from "mongoose";

// required: [inArray] [true, "Subcategory name is required"],
// trim true !important 
// slug lowercase 
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      minlength: [3, "Subcategory name is too short"],
      maxlength: [50, "Subcategory name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    }, 
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // 🔗 علاقة بالـ Category
      required: [true, "Subcategory must belong to a category"],
    },
  },
  { timestamps: true } // ⏱️ إضافة وقت الإنشاء والتحديث تلقائيًا
);

// ✅ إنشاء الموديل
const SubCategory = model("SubCategory", subCategorySchema);

export default SubCategory;
