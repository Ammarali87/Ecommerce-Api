class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'field', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Handle filters
    const filterObject = { ...queryObj };

    // Add keyword search
    if (this.queryString.search) {
      filterObject.$or = [
        { title: { $regex: this.queryString.search, $options: 'i' } },
        { description: { $regex: this.queryString.search, $options: 'i' } }
      ];
    }

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
      if (this.queryString.priceMin) filterObject.price.$gte = parseFloat(this.queryString.priceMin);
      if (this.queryString.priceMax) filterObject.price.$lte = parseFloat(this.queryString.priceMax);
    }

    this.query = this.query.find(filterObject);
    return this; // return object to chain methods
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.replace(/,/g, ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
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

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    // prev page
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.query = this.query.skip(skip).limit(limit);
    this.paginationReslut = pagination; // This is the property name used

    return this;
  }

  search(modelName) {
    if (this.queryString.search) {
      const searchObj = {
        $or: [
          { title: { $regex: this.queryString.search, $options: 'i' } },
          { description: { $regex: this.queryString.search, $options: 'i' } }
        ]
      };
      this.query = this.query.find(searchObj);
    }
    return this;
  }
}

export default ApiFeatures;