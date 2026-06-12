const mongoose = require("../database/mongodb");
const usersSchema = mongoose.Schema(
  {
    firstName: { type: String, require: false },
    lastName: { type: String, require: false },
    userName: { type: String, require: false },
    url: { type: String, require: false },
    fileType: { type: String, require: false },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    age: { type: Number, require: true },
    experience: { type: Number, require: true },
    pincode: { type: Number, require: true },
    city: { type: String, require: true },
    board: { type: String, require: true },
    preference: { type: String, require: true },
    userType: { type: String, require: true },
    phone: { type: Number, require: true },
    phoneVerified: { type: Number, require: false, default: 0 },
    emailVerified: { type: Number, require: false, default: 0 },
  },
  {
    strict: false,
    timestamps: {
      createdAt: "createdTimestamp",
      updatedAt: false,
    },
  }
);
/**
 * @type {mongoose.Model}
 */
let userInformation = null;
try {
  userInformation = mongoose.model("users");
} catch (error) {
  userInformation = mongoose.model("users", usersSchema);
}
const models = {
  // dbAddUser: async function (body) {
  //   const userData = new userInformation(body);
  //   const data = await userData.save();
  //   return data;
  // },
  dbAddUser: async function (userData) {
    try {
      const user = new userInformation(userData);
      const savedUser = await user.save();
      return savedUser; // Make sure to return the full user with _id
    } catch (error) {
      throw error;
    }
  },
  getuserData: async function (find, select) {
    const data = await userInformation.findOne(find, select);
    return data;
  },
  updateUserData: async function (find, select, option) {
    try {
      const data = await userInformation.findOneAndUpdate(find, select, option);
      if (!data) {
        throw new Error("User not found or not updated.");
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteUser: async function (find) {
    try {
      const result = await userInformation.findOneAndDelete(find);
      return result;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
  
};

module.exports = models;
