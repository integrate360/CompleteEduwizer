
const mongoose = require("../database/mongodb");
const featuredListingsSchema = mongoose.Schema(
  {
    url: { type: String, required: true },
    fileType: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
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
let featuredListingsInformation = null;
try {
  featuredListingsInformation = mongoose.model("featuredListingsData");
} catch (error) {
  featuredListingsInformation = mongoose.model("featuredListingsData", featuredListingsSchema);
}

const models = {
  dbGetFeaturedListingsData: async function (featuredListId, pagination) {
    let data;
    let filter;

    if (featuredListId) {
      filter = {
        _id: new mongoose.Types.ObjectId(featuredListId),
        isActive: true,
      };

      data = await featuredListingsInformation.findOne(filter);
    } else {
      filter = { isActive: true };
      if (pagination && pagination.type) {
        filter.fileType = new RegExp(pagination.type, "i");
      }
      if (pagination && pagination.search) {
        const searchRegex = new RegExp(pagination.search, "i");
        filter.$or = [
          { fileType: searchRegex },
          { url: searchRegex }
        ];
      }
      if (pagination && pagination.page && pagination.limit) {
        const page = Math.max(1, Number(pagination.page) || 1);
        const limit = Math.max(1, Math.min(200, Number(pagination.limit) || 10));
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
          featuredListingsInformation
            .find(filter)
            .sort({ createdTimestamp: -1 })
            .skip(skip)
            .limit(limit),

          featuredListingsInformation.countDocuments(filter),
        ]);

        return { items, total, page, limit };
      }

      data = await featuredListingsInformation
        .find(filter)
        .sort({ createdTimestamp: -1 });
    }

    return data;
  },
  dbAddFeaturedListingsData: async function (body) {
    const featuredListData = new featuredListingsInformation(body);
    const data = await featuredListData.save();
    return data;
  },
  dbUpdateFeaturedListingsData: async function (body) {
    try {
      const featuredListId = body.featuredListId;

      delete body.featuredListId;

      const result = await featuredListingsInformation.findByIdAndUpdate(
        featuredListId,
        {
          $set: body,
        },
        { new: true }
      );

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  dbDeleteFeaturedListingsData: async function ({ featuredListId }) {
    try {
      const result = await featuredListingsInformation.findByIdAndUpdate(
        featuredListId,
        { isActive: false },
        { new: true }
      );

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

module.exports = models;
