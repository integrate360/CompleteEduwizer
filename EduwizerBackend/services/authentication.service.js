const userModel = require("../models/authentication.model");
const userOtpModel = require("../models/userOtp.model");
const pendingUserModel = require("../models/pendingUser.model");

const services = {
  addUser: async function (body) {
    let addUser = {};
    try {
      addUser = await userModel.dbAddUser(body);
    } catch (error) {
      console.error("❌ Error adding user:", error);
    }
    return addUser;
  },

  addPendingUser: async function (body) {
    let addUser = {};
    try {
      addUser = await pendingUserModel.dbAddPendingUser(body);
    } catch (error) {
      console.error("❌ Error adding pending user:", error);
      throw error;
    }
    return addUser;
  },

  getUserDetailsByUserId: async function (find, select) {
    let data = {};
    try {
      data = await userModel.getuserData(find, select);
      if (!data) {
        data = await pendingUserModel.getPendingUserData(find, select);
      }
    } catch (error) {
      console.error(error);
    }
    return data;
  },

  updateUserDetails: async function (find, update, option) {
    let data = {};
    try {
      data = await userModel.updateUserData(find, update, option);
    } catch (error) {
      // If user isn't created yet, promote from pending_users then retry update.
      try {
        const userId = find && find._id ? String(find._id) : null;
        const email = find && find.email ? String(find.email) : null;
        if (!userId) throw error;

        const pendingFind = { _id: userId };
        if (email) pendingFind.email = email;

        const pending = await pendingUserModel.getPendingUserData(pendingFind, {});
        if (!pending) throw error;

        const pendingObj =
          typeof pending.toObject === "function" ? pending.toObject() : pending;
        delete pendingObj.expiresAt;

        // Create real user with same _id so other references stay valid.
        await userModel.dbAddUser({ ...pendingObj, _id: pending._id });
        await pendingUserModel.deletePendingUser({ _id: pending._id });

        data = await userModel.updateUserData(find, update, option);
      } catch (promotionError) {
        console.error(promotionError);
        throw error;
      }
    }
    return data;
  },

  deleteUser: async function (find) {
    let result = {};
    try {
      result = await userModel.deleteUser(find);
    } catch (error) {
      console.error(error);
    }
    return result;
  },

  deletePendingUser: async function (find) {
    let result = {};
    try {
      result = await pendingUserModel.deletePendingUser(find);
    } catch (error) {
      console.error(error);
    }
    return result;
  },

  userOtpModel: async function (body) {
    let addUserOtpData = {};
    try {
      addUserOtpData = await userOtpModel.dbAddUserOtp(body);
    } catch (error) {
      console.error(error);
    }
    return addUserOtpData;
  },

  getUserVerificationCode: async function (find, select, sort) {
    let data = {};
    try {
      data = await userOtpModel.getuserData(find, select, sort);
    } catch (error) {
      console.error(error);
    }
    return data;
  },
};

module.exports = services;

