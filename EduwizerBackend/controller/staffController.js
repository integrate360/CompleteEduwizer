const staffService = require("../services/staff.service");

const controllers = {
  getStaff: async function (req, res) {
    try {
      const { staffId } = req.query;
      const data = await staffService.getStaff(staffId);
      if (data) {
        return res.send({
          success: 1,
          data,
          message: "Successfully fetched staff list",
        });
      }
      return res.send({
        success: 0,
        data: [],
        message: "No staff records found",
      });
    } catch (error) {
      console.error(error);
      return res.send({ success: 0, data: [], message: error.message });
    }
  },
  addStaff: async function (req, res) {
    try {
      const data = await staffService.addStaff(req.body);
      return res.send({
        success: 1,
        data,
        message: "Successfully added staff",
      });
    } catch (error) {
      console.error(error);
      return res.send({ success: 0, data: {}, message: error.message });
    }
  },
  updateStaff: async function (req, res) {
    try {
      const data = await staffService.updateStaff(req.body);
      return res.send({
        success: 1,
        data,
        message: "Successfully updated staff",
      });
    } catch (error) {
      console.error(error);
      return res.send({ success: 0, data: {}, message: error.message });
    }
  },
  removeStaff: async function (req, res) {
    try {
      const data = await staffService.removeStaff(req.body);
      return res.send({
        success: 1,
        data,
        message: "Successfully removed staff",
      });
    } catch (error) {
      console.error(error);
      return res.send({ success: 0, data: {}, message: error.message });
    }
  },
  getAttendanceLogs: async function (req, res) {
    try {
      const query = {
        staffId: req.query.staffId,
        date: req.query.date,
        year: req.query.year,
      };
      const data = await staffService.getAttendanceLogs(query);
      return res.send({
        success: 1,
        data,
        message: "Successfully fetched attendance logs",
      });
    } catch (error) {
      console.error(error);
      return res.send({ success: 0, data: [], message: error.message });
    }
  },
  checkinAttendance: async function (req, res) {
    try {
      const data = await staffService.checkinAttendance(req.body);
      return res.send({
        success: 1,
        data,
        message: "Successfully checked in staff",
      });
    } catch (error) {
      console.error(error);
      return res.send({ success: 0, data: {}, message: error.message });
    }
  },
  checkoutAttendance: async function (req, res) {
    try {
      const data = await staffService.checkoutAttendance(req.body);
      return res.send({
        success: 1,
        data,
        message: "Successfully checked out staff",
      });
    } catch (error) {
      console.error(error);
      return res.send({ success: 0, data: {}, message: error.message });
    }
  },
};

module.exports = controllers;
