
const mongoose = require("../database/mongodb");
const testimonialsSchema = mongoose.Schema(
  {
    name: { type: String, require: true  },
    title: { type: String, require: false  },
    rating: { type: Number, require: true  },
    date: { type: String, require: true  },
    description: { type: String, require: true  },
    isActive : { type: Boolean, require: true , default : true },
  },
  {
    timestamps: {
      createdAt: "createdTimestamp",
      updatedAt: false,
    },
  }
);

/**
 * @type {mongoose.Model}
 */
let testimonialsInformation = null;
try {
    testimonialsInformation = mongoose.model("testimonialsData");
} catch (error) {
    testimonialsInformation = mongoose.model("testimonialsData", testimonialsSchema);
}

const models = {
  dbGetTestimonialsData: async function (testimonialId, pagination) {
    let data
    let filter
    if(testimonialId) {
      filter = {
        _id: new mongoose.Types.ObjectId(testimonialId),
        isActive : true
      }
      data = await testimonialsInformation.find(filter);
    } else {
      filter = { isActive : true }
      if (pagination && pagination.search) {
        const searchRegex = new RegExp(pagination.search, "i");
        filter.$or = [
          { name: searchRegex },
          { title: searchRegex },
          { description: searchRegex }
        ];
      }
      if (pagination && pagination.page && pagination.limit) {
        const page = Math.max(1, Number(pagination.page) || 1);
        const limit = Math.max(1, Math.min(200, Number(pagination.limit) || 10));
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
          testimonialsInformation
            .find(filter)
            .sort({ createdTimestamp: -1 })
            .skip(skip)
            .limit(limit),
          testimonialsInformation.countDocuments(filter),
        ]);
        return { items, total, page, limit };
      }
      data = await testimonialsInformation.find(filter).sort({"createdTimestamp": -1});
    }
    return data;
  },
  dbAddTestimonialsData: async function (body) {
    const testimonialData = new testimonialsInformation(body);
    const data = await testimonialData.save();
    return data;
  },
  dbUpdateTestimonialsData : async  function (body) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(body.testimonialId) };
      delete body.testimonialId;
      const update = { $set: { ...body } };
      const options = { returnOriginal: false, new: false, upsert: true };
      const result = await testimonialsInformation.updateOne(filter, update, options);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  dbDeleteTestimonialsData : async  function ({testimonialId}) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(testimonialId) };
      const update = { $set: {
        isActive : false
      } };
      const options = { returnOriginal: false, new: false, upsert: true };
      const result = await testimonialsInformation.updateOne(filter, update, options);
      console.log("Result: ", result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

module.exports = models;
