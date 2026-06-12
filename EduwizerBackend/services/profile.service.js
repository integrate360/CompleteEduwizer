const mongoose = require("../database/mongodb");

const usersSchemaNew = mongoose.Schema(
  {
    availableForHire: { type: Boolean, default: false },
    firstName: { type: String, maxlength: 25 },
    firstNameShowOnProfile: { type: Boolean, default: false },
    lastName: { type: String, maxlength: 25 },
    lastNameShowOnProfile: { type: Boolean, default: false },
    userName: { type: String, maxlength: 25 },
    userNameShowOnProfile: { type: Boolean, default: false },
    password: { type: String },
    url: { type: String },
    resume: { type: String },
    type: { type: String },
    phone: { type: Number },
    contactShowOnProfile: { type: Boolean, default: false },
    whatsapp: { type: Number },
    whatsappShowOnProfile: { type: Boolean, default: false },
    emailShowOnProfile: { type: Boolean, default: false },
    address: { type: String, maxlength: 100 },
    addressShowOnProfile: { type: Boolean, default: false },
    experience: { type: Number },
    experienceCondition: { type: Boolean, default: false },
    city: { type: String },
    aboutMe: { type: String, maxlength: 1000 },
    aboutMeShowOnProfile: { type: Boolean, default: false },
    cityShowOnProfile: { type: Boolean, default: false },
    education: { type: String },
    educationShowOnProfile: { type: Boolean, default: false },
    educationBoard: {
      type: String,
      enum: ["icse", "cbse", "igse", "state board", "ib"],
      default: "state board",
    },
    educationBoardShowOnProfile: { type: Boolean, default: false },
    ctc: {
      type: String,
      enum: [
        "1to3lpa",
        "3to5lpa",
        "5to10lpa",
        "10to15pa",
        "15to25lpa",
        "25+lpa",
      ],
      default: "1to3lpa",
    },
    ctcShowOnProfile: { type: Boolean, default: false },
    expectedCtc: {
      type: String,
      enum: [
        "1to3lpa",
        "3to5lpa",
        "5to10lpa",
        "10to15pa",
        "15to25lpa",
        "25+lpa",
      ],
      default: "1to3lpa",
    },
    expectedCtcShowOnProfile: { type: Boolean, default: false },
    boardCondition: { type: Boolean, default: false },
    preference: {
      type: String,
      enum: ["school", "college", "private institutions"],
      default: "school",
    },
    skills: { type: String },
    skillsShowOnProfile: { type: Boolean, default: false },
    languages: { type: String },
    languagesShowOnProfile: { type: Boolean, default: false },
    awardsAndRecognition: { type: String },
    awardsAndRecognitionShowOnProfile: { type: Boolean, default: false },
    country: { type: String },
    countryShowOnProfile: { type: Boolean, default: false },
    state: { type: String },
    stateShowOnProfile: { type: Boolean, default: false },
    experienceShowOnProfile: { type: Boolean, default: false },
    resumeURL: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { strict: false },
);

let userInformationIthoutStrict;
try {
  userInformationIthoutStrict = mongoose.model("users");
} catch {
  userInformationIthoutStrict = mongoose.model("users", usersSchemaNew);
}

const models = {
  dbUpdateUser: async function (updatedFields) {
    try {
      const { userId, ...updateData } = updatedFields;
      const filter = { _id: new mongoose.Types.ObjectId(userId) };
      const update = { $set: updateData };
      const options = { new: true };

      console.log("Filter: ", filter);
      console.log("Update: ", update);

      const result = await userInformationIthoutStrict.findOneAndUpdate(
        filter,
        update,
        options,
      );

      console.log("Result: ", result);
      return result;
    } catch (error) {
      console.error("Error updating user: ", error);
      throw new Error("Failed to update user data");
    }
  },
  updateProfile: async function (profileData, userId) {
    const filter = { _id: new mongoose.Types.ObjectId(userId) }; // Use userId for filtering
    const update = { $set: { ...profileData } }; // Ensure profileData is being applied as a partial update

    const options = { new: true }; // Return the updated document

    try {
      const result = await userInformationIthoutStrict.findOneAndUpdate(
        filter,
        update,
        options,
      );

      // If no document was found and updated, return null
      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async function (userId, select) {
    try {
      if (userId) {
        const profile = await userInformationIthoutStrict
          .findOne({ _id: userId })
          .select(select);
        return profile;
      } else {
        // If no userId is passed, you may want to fetch all users or a subset
        const users = await userInformationIthoutStrict.find({}).select(select);
        return users;
      }
    } catch (error) {
      throw error;
    }
  },
  dbGetUsersData: async function (find, select, sort, skip, limit) {
    try {
      return await userInformationIthoutStrict
        .find(find)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error("Error fetching users data: ", error);
      throw new Error("Failed to fetch users data");
    }
  },
  dbCountUsers: async function (find) {
    try {
      return await userInformationIthoutStrict.countDocuments(find);
    } catch (error) {
      console.error("Error counting users data: ", error);
      throw new Error("Failed to count users data");
    }
  },

  dbDeleteUserData: async function (filter) {
    try {
      return await userInformationIthoutStrict.deleteOne(filter);
    } catch (error) {
      console.error("Error deleting user data: ", error);
      throw new Error("Failed to delete user data");
    }
  },
  getAllUserProfiles: async function (
    select = null,
    sort = null,
    skip = 0,
    limit = 100,
  ) {
    try {
      const users = await userInformationIthoutStrict
        .find({})
        .select(select)
        .sort(sort || { createdAt: -1 }) // sort by newest by default
        .skip(skip)
        .limit(limit);

      return users;
    } catch (error) {
      console.error("Error fetching all user profiles: ", error);
      throw new Error("Failed to fetch user profiles");
    }
  },
};

module.exports = models;
