const staffModel = require("../models/staff.model");
const attendanceModel = require("../models/staffAttendance.model");

const services = {
  getStaff: async function (staffId, pagination) {
    const staffData = await staffModel.dbGetStaff(staffId, pagination);
    return staffData;
  },
  addStaff: async function (body) {
    const existingStaff = await staffModel.dbGetStaff();
    const maxCode = existingStaff.reduce((highest, staff) => {
      const numeric = Number((staff.staffCode || "").replace(/\D/g, ""));
      return Number.isFinite(numeric) ? Math.max(highest, numeric) : highest;
    }, 0);

    body.staffCode = `STF${String(maxCode + 1).padStart(3, "0")}`;

    const createdStaff = await staffModel.dbAddStaff(body);
    return createdStaff;
  },
  updateStaff: async function (body) {
    const updatedStaff = await staffModel.dbUpdateStaff(body);
    return updatedStaff;
  },
  removeStaff: async function (body) {
    await attendanceModel.dbDeleteAttendanceByStaffId(body.staffId);
    const removedStaff = await staffModel.dbDeleteStaff(body);
    return removedStaff;
  },
  getAttendanceLogs: async function ({ staffId, date, year } = {}) {
    const attendanceLogs = await attendanceModel.dbGetAttendanceLogs({
      staffId,
      date,
      year,
    });
    return attendanceLogs;
  },
  checkinAttendance: async function (body) {
    const attendance = await attendanceModel.dbCheckinAttendance(body);
    return attendance;
  },
  checkoutAttendance: async function (body) {
    const attendance = await attendanceModel.dbCheckoutAttendance(body);
    return attendance;
  },
};

module.exports = services;
