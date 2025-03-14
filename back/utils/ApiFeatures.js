//  class name start with Cap
// add this to every thing
// no this in new var from var just one this 

// the use of class 
// const features = new ApiFeatures(Model.find()
// , req.query)     starit with search 
//   .search()     // First apply search
//   .filter()     // Then apply filters
//   .sort()       // Sort results
//   .limit()// Select specific fields
//   .paginate(totalCount); // Finally paginate
// can remove {} from if if one line 



class ApiFeatures {
  constructor(query, queryString) {
    // queryString == paramter
    // query  ready to find() 
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search) {
      // here can make fuzzy search 
      const searchObj = {
        // like ?  take logic 
        $or: [
          { title: {
             $regex: this.queryString.search,
              $options: 'i' } },
          { description: { $regex: this.queryString.search, $options: 'i' } }
        ]
      };
      this.query = this.query.find(searchObj);
    }  
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'field', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);
      // can make without exclude const 
    const filterObject = { ...queryObj };

    // Handle rating filters
    if (this.queryString.rating) {
      filterObject.ratingsAverage = {
        $gte: parseFloat(this.queryString.rating) - 0.4,
        $lte: parseFloat(this.queryString.rating) + 0.4
      }; 
    } else if (this.queryString.ratingMin || this.queryString.ratingMax) {
      filterObject.ratingsAverage = {};
      if (this.queryString.ratingMin) filterObject.ratingsAverage.$gte = parseFloat(this.queryString.ratingMin);
      if (this.queryString.ratingMax) filterObject.ratingsAverage.$lte = parseFloat(this.queryString.ratingMax);
    }

    // Handle price filters
    if (this.queryString.priceMin || this.queryString.priceMax) {
      filterObject.price = {};
      filterObject.price.$gte = parseFloat(this.queryString.priceMin) || 0;
      filterObject.price.$lte = parseFloat(this.queryString.priceMax) || 340; // Default max price
    }

    this.query = this.query.find(filterObject);
    return this;
  }

  sort() { 
    if (this.queryString.sort) {
      const sortBy = 
      this.queryString.sort.replace(/,/g, ' ');
      this.query = this.query.sort(sortBy);
    } else { 
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limit() {
    if (this.queryString.field) {
      const fields = this.queryString.field.replace(/,/g, ' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate(countDocuments) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 12;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

  const pagination = {
      currentPage: page,
      limit,
      numOfPages: Math.ceil(countDocuments / limit)
    };

    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.query = this.query.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }
}

export default ApiFeatures;