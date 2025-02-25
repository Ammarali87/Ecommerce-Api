import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review must have a rating']
  },
  comment: {
    type: String,
    required: [true, 'Review must have a comment']
  }
}, {
  timestamps: true
});

export default model('Review', reviewSchema);