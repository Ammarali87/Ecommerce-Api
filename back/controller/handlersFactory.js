import catchAsync from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/ApiFeatures.js';
import cloudinary from '../config/cloudinaryConfig.js';
import { count } from 'console';

// Function to handle image uploads
const uploadImage = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(new ApiError(500, 'Error uploading image'));
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
};

// ✅ حذف مستند  how it delete no delete method
export function deleteOne(Model) {
  return catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    
    if (!document) {
      return next(new ApiError(`No document found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      status: 'success deleted ',
      data: null
    });
  });
}
 // the code 204 give no conntent in post man 
  // the code 202 give table 

  
// ✅ تحديث مستند
export function updateOne(Model) {
  return catchAsync(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(new ApiError(`No document found with id ${req.params.id}`, 404));
    }

    if (req.file) {
      const imageUrl = await uploadImage(req.file, 'uploads');
      req.body.image = imageUrl;
    }
      // make copy 
      // Object.assign( );
    Object.assign(document, req.body);
    await document.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: document,
    });
  });
}



// ✅ إنشاء مستند جديد
export function createOne(Model) {
  return catchAsync(async (req, res) => {
    if (req.file) {
 const imageUrl = await uploadImage(req.file, 'uploads');
      req.body.image = imageUrl;
    }   

    const document = await Model.create(req.body);
    if (!document) {
      return next(new ApiError(`No document create with id ${req.params.id}`, 404));
    }
    res.status(201).json({ data: document });
  });  
}



export function getOne(Model, populationOpt) {
  return catchAsync(async (req, res, next) => {
    let query;  
             // forgot .modeNAme  also let out side if
    // تحقق إذا كان الموديل هو Cart (من خلال الاسم)
    if (Model.modelName === 'Cart') {
      query = Model.findOne({ user: req.user._id });
    } else {
      query = Model.findById(req.params.id);
    }            

    // إضافة populate لو موجود
    if (populationOpt) query = query.populate(populationOpt);
          // not write awit in every findOne just after end 
    const doc = await query;

    if (!doc) {
      return next(
        new ApiError(404, `No document found for this id`)
      );
    }             
    

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
}


export function getAll(Model, modelName = '') {
  return catchAsync(async (req, res, next) => {
    try {  // سلسلة   if not work change to filter 
      // const filter = req.filterObj || {};
      const filter = req.filter || {};

      // Validate inputs
      const page = parseInt(req.query.page) || 1;
      if (page < 1) {
        return next(new ApiError(400, 'Page number must be greater than 0'));
      }

      // Get total count with error handling
       // سلسلة
      const totalCount = await Model.countDocuments(filter)
        .catch(err => {
          throw new ApiError(500, 'Error counting documents: ' + err.message);
        });    

        const features = new ApiFeatures(Model.find(filter), req.query)
        .filter()
        .search(modelName)
        .sort()   
        .limitFields()
        .paginate(totalCount);  // سلسلة

        const documents = await features.query;

      // Check if documents were found
      if (!documents) {
        return next(new ApiError(404, 'No documents found'));
      }

      res.status(200).json({
        status: 'success',
        metadata: {  
          total: totalCount,  // سلسلة
          currentPage: features.paginationResult.currentPage, 
         // remove reslut :doc.length or this line 
          totalPages: features.paginationResult.numOfPages,
          limit: features.paginationResult.limit,
          hasNext: !!features.paginationResult.next,
          hasPrev: !!features.paginationResult.prev,
          nextPage: features.paginationResult.next || null,  // null to remove undefind
          prevPage: features.paginationResult.prev || null,
        },     
        results: documents.length,
        data: documents,
      });
    } catch (error) {
      next(new ApiError(500, `Error fetching documents: ${error.message}`));
    }
  });
}


