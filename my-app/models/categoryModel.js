import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // لضمان أن اسم الفئة يكون فريدًا
    trim: true, // إزالة المسافات الزائدة
  },
  description: {
    type: String,
    required: false,
    trim: true, // إزالة المسافات الزائدة
  },
  slug: {
    type: String,
    unique: true,
    required: false,
    lowercase: true, // لتخزين slug بالحروف الصغيرة
    trim: true, // إزالة المسافات الزائدة
  },
  image: {
    type: String, // لحفظ رابط الصورة
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // تعيين التاريخ الحالي عند إنشاء الفئة
  },
  updatedAt: {
    type: Date,
    default: Date.now, // تعيين التاريخ الحالي عند تعديل الفئة
  },
});

// تحديث التاريخ عند التعديل
categorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// // إنشاء الـ Slug تلقائيًا عند إضافة الفئة
// categorySchema.pre('save', function (next) {
//   if (this.name) {
//     this.slug = this.name
//       .toLowerCase()
//       .replace(/\s+/g, '-') // استبدال المسافات بعلامة "-"
//       .replace(/[^\w-]+/g, ''); // إزالة الحروف غير المطلوبة
//   }
//   next();
// });

// إنشاء النموذج
const Category = model('Category', categorySchema);

export default Category;
