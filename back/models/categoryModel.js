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
    type: String , 
    required:false
  },
}, { timestamps: true }); 


const Category = model('Category', categorySchema);

export default Category;
