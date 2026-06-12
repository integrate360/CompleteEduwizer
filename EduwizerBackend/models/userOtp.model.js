
const mongoose = require("../database/mongodb");
const usersVerficationCode = mongoose.Schema(
  {
    userId: { type: String, require: false },
    verificationCode :   { type: Number, require: true , default : 0},
    emailId : { type: String, require: true , default : "NA"},
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
let userOtp = null;
try {
  userOtp = mongoose.model("usersVerficationCode");
} catch (error) {
  userOtp = mongoose.model("usersVerficationCode", usersVerficationCode);
}
const models = {
  dbAddUserOtp: async function (body) {
    const userOtpObj = new userOtp(body);
    const data = await userOtpObj.save();
    return data;
  },
  getuserData:  async function (find,select,sort) {
    const data = await userOtp.findOne(find).select(select).sort(sort);
    return data;
  }
};

module.exports = models;
