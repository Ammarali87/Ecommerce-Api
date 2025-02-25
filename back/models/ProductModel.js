import { Schema, model } from 'mongoose';
import './ReviewModel.js';  


const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Too short product title'],
      maxlength: [100, 'Too long product title'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [20, 'Too short product description'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      trim: true,
      max: [200000, 'Too long product price'],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, 'Product Image cover is required'],
    },
    images: [String],
    category: {
      type: Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must be belong to category'],
    },
    subcategories: [
      {
        type: Schema.ObjectId,
        ref: 'SubCategory',
      },
    ],
    brand: {
      type: Schema.ObjectId,
      ref: 'Brand',
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
      // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id',
  });
  next();
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
// findOne, findAll and update
productSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
productSchema.post('save', (doc) => {
  setImageURL(doc);
});

export default model('Product', productSchema);








// import { Schema, model } from 'mongoose';
// // const mostSale = await Product.find({feat:true})
// // await Product.findByIdAndUpdate(productId, { featured: true });
// // tybe can be obj or value  message:string or message:{ type:Number , min 1 , max 5  }  
// // ed required: true,
// //  new Schema({})
// //  max or maxlength
// {/* <input type="number" min="10"> */}

  
// // Remove or modify the setImageURL function
// const setImageURL = (doc) => {
//   // Remove URL modification
//   if (doc.imageCover) {
//     doc.imageCover = doc.imageCover;
//   }
//   // Keep image array handling if needed
//   if (doc.images) {
//     const imagesList = [];
//     doc.images.forEach((image) => {
//       imagesList.push(image);
//     });
//     doc.images = imagesList;
//   }
// };    
// // img with server  put your domin 
 
// // const setImageURL = (doc) => {
// //   if (doc.imageCover) {
// //     const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}
// //     `;
// //     doc.imageCover = imageUrl;
// //   }
// //   if (doc.images) {
// //     const imagesList = [];
// //     doc.images.forEach((image) => {
// //       const imageUrl = `${process.env.BASE_URL}/products/${image}`;
// //       imagesList.push(imageUrl);
// //     });
// //     doc.images = imagesList;
// //   }
// // };
// // findOne, findAll and update
// productSchema.post('init', (doc) => {
//   setImageURL(doc);
// });

// // create
// productSchema.post('save', (doc) => {
//   setImageURL(doc);
// });


// export default model('Product', productSchema);






// //////////////////////////////////////

//   // perfect project schema 


// // import mongoose from 'mongoose';
// // import slugify from 'slugify';

// // const productSchema = new mongoose.Schema(
// //   {
// //     title: {
// //       type: String,
// //       required: [true, 'Product title is required'],
// //       trim: true,
// //       minlength: [3, 'Too short product title'],
// //       maxlength: [100, 'Too long product title'],
// //     },
// //     slug: {
// //       type: String,
// //       unique: true,
// //       lowercase: true,
// //     },
// //     description: {
// //       type: String,
// //       required: [true, 'Product description is required'],
// //       minlength: [20, 'Too short product description'],
// //     },
// //     quantity: {
// //       type: Number,
// //       required: [true, 'Product quantity is required'],
// //     },
// //     sold: {
// //       type: Number,
// //       default: 0,
// //     },
// //     price: {
// //       type: Number,
// //       required: [true, 'Product price is required'],
// //       trim: true,
// //       max: [200000, 'Too high product price'],
// //     },
// //     priceAfterDiscount: {
// //       type: Number,
// //       min: 0,
// //       validate: {
// //         validator: function (val) {
// //           return val < this.price; // Ensure discount is lower than price
// //         },
// //         message: 'Discount price must be lower than original price',
// //       },
// //     },
// //     colors: [String], // Array of available colors

// //     imageCover: {
// //       type: String,
// //       required: [true, 'Product cover image is required'],
// //     },
// //     images: [
// //       {
// //         url: String,
// //         public_id: String,
// //       },
// //     ],
// //     category: {
// //       type: mongoose.Schema.ObjectId,
// //       ref: 'Category',
// //       required: [true, 'Product must belong to a category'],
// //     },
// //     subcategories: [
// //       {
// //         type: mongoose.Schema.ObjectId,
// //         ref: 'SubCategory',
// //       },
// //     ],
// //     brand: {
// //       type: mongoose.Schema.ObjectId,
// //       ref: 'Brand',
// //     },
// //     ratingsAverage: {
// //       type: Number,
// //       min: [1, 'Rating must be at least 1.0'],
// //       max: [5, 'Rating must be at most 5.0'],
// //       default: 0,
// //     },
// //     ratingsQuantity: {
// //       type: Number,
// //       default: 0,
// //     },
// //     ratingMessages: [
// //       {
// //         user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// //         message: String,
// //         rating: { type: Number, min: 1, max: 5 },
// //         createdAt: { type: Date, default: Date.now },
// //       },
// //     ],
// //     featured: {
// //       type: Boolean,
// //       default: false,
// //     },
// //   },
// //   {
// //     timestamps: true,
// //     toJSON: { virtuals: true },
// //     toObject: { virtuals: true },
// //   }
// // );

// // // **Auto-generate slug before saving**
// // productSchema.pre('save', function (next) {
// //   if (this.isModified('title')) {
// //     this.slug = slugify(this.title, { lower: true, strict: true });
// //   }
// //   next();
// // });

// // // **Virtual populate for reviews**
// // productSchema.virtual('reviews', {
// //   ref: 'Review',
// //   foreignField: 'product',
// //   localField: '_id',
// // });

// // // **Middleware to populate category details**
// // productSchema.pre(/^find/, function (next) {
// //   this.populate({
// //     path: 'category',
// //     select: 'name -_id',
// //   });
// //   next();
// // });

// // // **Set image URLs**
// // const setImageURL = (doc) => {
// //   if (doc.imageCover) {
// //     doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
// //   }
// //   if (doc.images) {
// //     doc.images = doc.images.map((img) => ({
// //       url: `${process.env.BASE_URL}/products/${img.url}`,
// //       public_id: img.public_id,
// //     }));
// //   }
// // };

// // // **Apply image URL formatting**
// // productSchema.post('init', (doc) => {
// //   setImageURL(doc);
// // });
// // productSchema.post('save', (doc) => {
// //   setImageURL(doc);
// // });

// // const Product = mongoose.model('Product', productSchema);
// // export default Product;
