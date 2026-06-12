const mongoose = require("../database/mongodb");

const staffSchema = mongoose.Schema(
  {
    staffCode: { type: String, require: true },
    name: { type: String, require: true },
    role: { type: String, require: true },
    department: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    status: { type: String, require: true, default: "Active" },
    joinDate: { type: String, require: true },
    avatarColor: { type: String, require: false },
    isActive: { type: Boolean, require: true, default: true },
  },
  {
    timestamps: {
      createdAt: "createdTimestamp",
      updatedAt: false,
    },
  },
);

let staffInformation;
try {
  staffInformation = mongoose.model("staffData");
} catch (error) {
  staffInformation = mongoose.model("staffData", staffSchema);
}

const models = {
  dbGetStaff: async function (staffId, pagination) {
    let data;
    const filter = { isActive: true };
    if (staffId) {
      filter._id = new mongoose.Types.ObjectId(staffId);
      data = await staffInformation.find(filter);
    } else {
      if (pagination && pagination.page && pagination.limit) {
        const page = Math.max(1, Number(pagination.page) || 1);
        const limit = Math.max(
          1,
          Math.min(200, Number(pagination.limit) || 10),
        );
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
          staffInformation
            .find(filter)
            .sort({ createdTimestamp: -1 })
            .skip(skip)
            .limit(limit),
          staffInformation.countDocuments(filter),
        ]);
        return { items, total, page, limit };
      }
      data = await staffInformation.find(filter).sort({ createdTimestamp: -1 });
    }
    return data;
  },
  dbAddStaff: async function (body) {
    const staffData = new staffInformation(body);
    const data = await staffData.save();
    return data;
  },
  dbUpdateStaff: async function (body) {
    const filter = { _id: new mongoose.Types.ObjectId(body.staffId) };
    const updateBody = { ...body };
    delete updateBody.staffId;
    const update = { $set: updateBody };
    const options = { returnOriginal: false, new: false, upsert: false };
    const result = await staffInformation.updateOne(filter, update, options);
    return result;
  },
  dbDeleteStaff: async function ({ staffId }) {
    const filter = { _id: new mongoose.Types.ObjectId(staffId) };
    const update = { $set: { isActive: false } };
    const options = { returnOriginal: false, new: false, upsert: false };
    const result = await staffInformation.updateOne(filter, update, options);
    return result;
  },
};

module.exports = models;
