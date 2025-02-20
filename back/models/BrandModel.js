import {Schema ,model} from "mongoose";

// required: [inArray] [true, "Subcategory name is required"],
// trim true !important 
// slug lowercase 
const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      minlength: [3, "Subcategory name is too short"],
      maxlength: [50, "Subcategory name is too long"],
    },
    image: {
      type: String,
    }, 
   
  },
  { timestamps: true }
);

// ✅ إنشاء الموديل
const Brand = model("Brand", BrandSchema);

export default Brand;
