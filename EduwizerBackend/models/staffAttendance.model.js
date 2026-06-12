const mongoose = require("../database/mongodb");

const staffAttendanceSchema = mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "staffData",
    },
    date: { type: String, require: true },
    checkIn: { type: String, require: false },
    checkOut: { type: String, require: false },
    status: { type: String, require: true },
    isActive: { type: Boolean, require: true, default: true },
  },
  {
    timestamps: {
      createdAt: "createdTimestamp",
      updatedAt: false,
    },
  },
);

let staffAttendanceInformation;
try {
  staffAttendanceInformation = mongoose.model("staffAttendance");
} catch (error) {
  staffAttendanceInformation = mongoose.model(
    "staffAttendance",
    staffAttendanceSchema,
  );
}

const models = {
  dbGetAttendanceLogs: async function ({ staffId, date, year } = {}) {
    const filter = { isActive: true };
    if (staffId) {
      filter.staffId = new mongoose.Types.ObjectId(staffId);
    }
    if (date) {
      filter.date = date;
    }
    if (year) {
      filter.date = { $regex: `^${year}-` };
    }
    const data = await staffAttendanceInformation
      .find(filter)
      .sort({ date: -1 });
    return data;
  },
  dbCheckinAttendance: async function (body) {
    const filter = {
      staffId: new mongoose.Types.ObjectId(body.staffId),
      date: body.date,
      isActive: true,
    };
    const update = {
      $set: {
        checkIn: body.checkIn,
        status: body.status,
      },
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const data = await staffAttendanceInformation.findOneAndUpdate(
      filter,
      update,
      options,
    );
    return data;
  },
  dbCheckoutAttendance: async function (body) {
    const filter = {
      staffId: new mongoose.Types.ObjectId(body.staffId),
      date: body.date,
      isActive: true,
    };
    const update = {
      $set: {
        checkOut: body.checkOut,
      },
    };
    const options = { new: true };
    const data = await staffAttendanceInformation.findOneAndUpdate(
      filter,
      update,
      options,
    );
    return data;
  },
  dbDeleteAttendanceByStaffId: async function (staffId) {
    const filter = {
      staffId: new mongoose.Types.ObjectId(staffId),
      isActive: true,
    };
    const update = { $set: { isActive: false } };
    const result = await staffAttendanceInformation.updateMany(filter, update);
    return result;
  },
};

module.exports = models;
