import catchAsync from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/ApiFeatures.js';
import cloudinary from '../config/cloudinaryConfig.js';

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

// ✅ حذف مستند
export function deleteOne(Model) {
  return catchAsync(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

    if (!document) {
      return next(new ApiError(`No document found with id ${req.params.id}`, 404));
    }

    res.status(204).end(); // لا توجد بيانات لإرسالها
  });
}

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

    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });
}


export function getOne(Model, populationOpt) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populationOpt) query = query.populate(populationOpt);

    const document = await query;

    if (!document) {
      return next(new ApiError(404, `No document found with id ${req.params.id}`));
    }

    res.status(200).json({ data: document });
  });
}
// ✅ جلب مستند واحد مع دعم `populate`
// export function getOne(Model, populationOpt) {
//   return catchAsync(async (req, res, next) => {
//     let query = Model.findById(req.params.id);
//     if (populationOpt) query = query.populate(populationOpt);

//     const document = await query;

//     if (!document) {
//       return next(new ApiError(`No document found with id ${req.params.id}`, 404));
//     }

//     res.status(200).json({ data: document });
//   });
// }

export function getAll(Model, modelName = '') {
  return catchAsync(async (req, res, next) => {
    try {
      const filter = req.filterObj || {};
      
      // Validate inputs
      const page = parseInt(req.query.page) || 1;
      if (page < 1) {
        return next(new ApiError(400, 'Page number must be greater than 0'));
      }

      // Get total count with error handling
      const totalCount = await Model.countDocuments(filter)
        .catch(err => {
          throw new ApiError(500, 'Error counting documents: ' + err.message);
        });

      const features = new ApiFeatures(Model.find(filter), req.query)
        .filter()
        .search(modelName)
        .sort()
        .limitFields()
        .paginate(totalCount);

      const documents = await features.query;

      // Check if documents were found
      if (!documents) {
        return next(new ApiError(404, 'No documents found'));
      }

      res.status(200).json({
        status: 'success',
        metadata: {
          total: totalCount,
          currentPage: features.paginationReslut.currentPage, 
          totalPages: features.paginationReslut.numOfPages,
          limit: features.paginationReslut.limit,
          hasNext: !!features.paginationReslut.next,
          hasPrev: !!features.paginationReslut.prev,
          nextPage: features.paginationReslut.next || null, 
          prevPage: features.paginationReslut.prev || null,
          resultsOnPage: documents.length,
        },
        results: documents.length,
        data: documents,
      });
    } catch (error) {
      next(new ApiError(500, `Error fetching documents: ${error.message}`));
    }
  });
}







// import catchAsync from 'express-async-handler';
// import ApiError from '../utils/ApiError.js';
// import ApiFeatures from '../utils/ApiFeatures.js';

// // ✅ حذف مستند
// export function deleteOne(Model) {
//   return catchAsync(async (req, res, next) => {
//     const document = await Model.findById(req.params.id);

//     if (!document) {
//       return next(new ApiError(`No document found with id ${req.params.id}`, 404));
//     }

//     await document.remove();
//     res.status(204).end(); // لا توجد بيانات لإرسالها
//   });
// }

// // ✅ تحديث مستند
// export function updateOne(Model) {
//   return catchAsync(async (req, res, next) => {
//     const document = await Model.findById(req.params.id);

//     if (!document) {
//       return next(new ApiError(`No document found with id ${req.params.id}`, 404));
//     }  
//       // to grigger the pre,post save middleware
//     Object.assign(document, req.body);
//     await document.save({ validateBeforeSave: false });

//     res.status(200).json({
//       status: 'success',
//       data: document,
//     });
//   });
// }

// // ✅ إنشاء مستند جديد
// export function createOne(Model) {
//   return catchAsync(async (req, res) => {
//     const newDoc = await Model.create(req.body);
//     res.status(201).json({ data: newDoc });
//   });
// }

// // ✅ جلب مستند واحد مع دعم `populate`
// export function getOne(Model, populationOpt) {
//   return catchAsync(async (req, res, next) => {
//     let query = Model.findById(req.params.id);
//     if (populationOpt) query = query.populate(populationOpt);

//     const document = await query;

//     if (!document) {
//       return next(new ApiError(`No document found with id ${req.params.id}`, 404));
//     }

//     res.status(200).json({ data: document });
//   });
// }
// export function getAll(Model, modelName = '') {
//   return catchAsync(async (req, res, next) => {
//     try {
//       const filter = req.filterObj || {};
      
//       // Validate inputs
//       const page = parseInt(req.query.page) || 1;
//       if (page < 1) {  // optional 
//         return next(new ApiError(400, 'Page number must be greater than 0'));
//       }

//       // Get total count with error handling
//       const totalCount = await Model.countDocuments(filter)
//         .catch(err => {   // optional
//           throw new ApiError(500, 'Error counting documents: ' + err.message);
//         });

//       const features = new ApiFeatures(Model.find(filter), req.query)
//         .filter()
//         .search(modelName)
//         .sort()
//         .limitFields()
//         .paginate(totalCount);

//       const documents = await features.query;

//       // Check if documents were found
//       if (!documents) {
//         return next(new ApiError(404, 'No documents found'));
//       }

//       res.status(200).json({
//         status: 'success',
//         metadata: {
//           total: totalCount,
//           currentPage: features.paginationReslut.currentPage, 
//           totalPages: features.paginationReslut.numOfPages,
//           limit: features.paginationReslut.limit,
//           hasNext: !!features.paginationReslut.next,
//           hasPrev: !!features.paginationReslut.prev,
//           nextPage: features.paginationReslut.next || null, 
//           prevPage: features.paginationReslut.prev || null,
//           resultsOnPage: documents.length,
//         },
//         results: documents.length,
//         data: documents,
//       });
//     } catch (error) {
//       next(new ApiError(500, `Error fetching documents: ${error.message}`));
//     }
//   });
// }
