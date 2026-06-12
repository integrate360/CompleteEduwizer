const mongoose = require("../database/mongodb");

const pendingUsersSchema = mongoose.Schema(
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

    // Auto-delete pending users after 10 minutes
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
      expires: 0,
    },
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
let pendingUsers = null;
try {
  pendingUsers = mongoose.model("pending_users");
} catch (error) {
  pendingUsers = mongoose.model("pending_users", pendingUsersSchema);
}

const models = {
  dbAddPendingUser: async function (userData) {
    const user = new pendingUsers(userData);
    const savedUser = await user.save();
    return savedUser;
  },
  getPendingUserData: async function (find, select) {
    const data = await pendingUsers.findOne(find, select);
    return data;
  },
  deletePendingUser: async function (find) {
    const result = await pendingUsers.findOneAndDelete(find);
    return result;
  },
};

module.exports = models;

