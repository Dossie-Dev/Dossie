class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let newQuery = {
      ...this.queryString,
    };
    let queryObject = ["sort", "filter", "fields", "limit", "page"];
    queryObject = queryObject.forEach((element) => {
      delete newQuery[element];
    });

    let queryStr = JSON.stringify(newQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);
    this.query = this.query.find(queryStr);

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else this.query = this.query.sort("-createdAt");

    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  count() {
    this.query = this.query.countDocuments({});
    return this;
  }
  field() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else this.query = this.query.select("-__v");

    return this;
  }
  populate() {
    let populated = [
      { path: "user", options: { strictPopulate: false } },
      { path: "company", option: { strictPopulate: false } },
      { path: "companyId", option: { strictPopulate: false } },
    ]; // Fix path

    let populateObj = [];

    if (this.queryString.fields) {
      const result = this.queryString.fields
        .split(",")
        .map((value) => value.trim());

      populateObj = populated.filter((value) => result.includes(value.path));
    } else {
      populateObj = populated;
    }

    // Ensure populateObj is applied correctly
    if (populateObj.length > 0) {
      populateObj.forEach((populateField) => {
        this.query = this.query.populate(populateField);
      });
    }

    return this;
  }
}
module.exports = APIFeatures;
