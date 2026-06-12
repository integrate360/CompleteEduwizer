const mongoose = require("../database/mongodb");
const usersSchema = mongoose.Schema(
  {
    email: { type: String, require: true, unique: true },
  },
  {
    timestamps: {
      createdAt: "createdTimestamp",
      updatedAt: false,
    },
  }
);
const contactUsSchema = mongoose.Schema(
  {
    email: { type: String, require: true },
    phone: { type: Number, require: true },
    name: { type: String, require: true },
    message: { type: String, require: true },
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
let subscribeInformation = null;
try {
  subscribeInformation = mongoose.model("subscribeInformation");
} catch (error) {
  subscribeInformation = mongoose.model("subscribeInformation", usersSchema);
}

/**
 * @type {mongoose.Model}
 */
let contactUs = null;
try {
  contactUs = mongoose.model("contactUs");
} catch (error) {
  contactUs = mongoose.model("contactUs", contactUsSchema);
}
const models = {
  dbSubscribeUser: async function (body) {
    const subscribeData = new subscribeInformation(body);
    const data = await subscribeData.save();
    return data;
  },
  dbContactUs: async function (body) {
    const contactUsData = new contactUs(body);
    const data = await contactUsData.save();
    return data;
  },
  getAllContactUsData: async function () {
    try {
      const data = await contactUs.find({}); 
      return data;
    } catch (error) {
      throw new Error("Error fetching contactUs data: " + error.message);
    }
  },
  getContactMessagesPaged: async function (page, limit, search) {
    try {
      let query = {};
      if (search) {
        const searchRegex = new RegExp(search, "i");
        query = {
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { message: searchRegex }
          ]
        };
        if (!isNaN(search) && search.trim() !== "") {
          query.$or.push({ phone: Number(search) });
        }
      }
      const p = parseInt(page) || 1;
      const l = parseInt(limit) || 10;
      const skip = (p - 1) * l;
      
      const total = await contactUs.countDocuments(query);
      const data = await contactUs.find(query)
        .sort({ createdTimestamp: -1 })
        .skip(skip)
        .limit(l);
        
      return { data, total, page: p, limit: l, pages: Math.ceil(total / l) };
    } catch (error) {
      throw new Error("Error fetching paged contactUs data: " + error.message);
    }
  },
  dbDeleteContactUs: async function (find) {
    try {
      const result = await contactUs.findOneAndDelete(find);
      return result;
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
};

module.exports = models;


