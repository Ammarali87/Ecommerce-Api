import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,default:null
  },
}, { timestamps: true }); // This automatically adds createdAt & updatedAt


const Category = model('Category', categorySchema);

export default Category;
