
const mongoose = require("../database/mongodb");
const teachersSchema = mongoose.Schema(
  {
    country: { type: String, require: true  },
    location: { type: String, require: true  },
    name: { type: String, require: true  },
    position: { type: String, require: true  },
    url : { type: String, require: true  },
    fileType : { type: String, require: true  },
    linkedIn: { type: String, require: false  },
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
let teachersInformation = null;
try {
    teachersInformation = mongoose.model("teachersData");
} catch (error) {
    teachersInformation = mongoose.model("teachersData", teachersSchema);
}

const models = {
  dbGetTeachersData: async function (teacherId, pagination) {
    let data
    let filter
    if(teacherId) {
      filter = {
        _id: new mongoose.Types.ObjectId(teacherId),
        isActive : true
      }
      data = await teachersInformation.find(filter);
    } else {
      filter = { isActive : true }
      if (pagination && pagination.search) {
        const searchRegex = new RegExp(pagination.search, "i");
        filter.$or = [
          { name: searchRegex },
          { position: searchRegex },
          { location: searchRegex },
          { country: searchRegex }
        ];
      }
      if (pagination && pagination.page && pagination.limit) {
        const page = Math.max(1, Number(pagination.page) || 1);
        const limit = Math.max(1, Math.min(200, Number(pagination.limit) || 10));
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
          teachersInformation
            .find(filter)
            .sort({ createdTimestamp: -1 })
            .skip(skip)
            .limit(limit),
          teachersInformation.countDocuments(filter),
        ]);
        return { items, total, page, limit };
      }
      data = await teachersInformation.find(filter).sort({"createdTimestamp": -1});
    }
    return data;
  },
  dbAddTeachersData: async function (body) {
    const teacherData = new teachersInformation(body);
    const data = await teacherData.save();
    return data;
  },
  dbUpdateTeachersData : async  function (body) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(body.teacherId) };
      delete body.teacherId;
      const update = { $set: { ...body } };
      const options = { returnOriginal: false, new: false, upsert: true };
      const result = await teachersInformation.updateOne(filter, update, options);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  dbDeleteTeachersData : async  function ({teacherId}) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(teacherId) };
      const update = { $set: {
        isActive : false
      } };
      const options = { returnOriginal: false, new: false, upsert: true };
      const result = await teachersInformation.updateOne(filter, update, options);
      console.log("Result: ", result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

module.exports = models;
