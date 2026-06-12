const mongoose = require("../database/mongodb");
const usersSchemaNew = mongoose.Schema(
  {
    availableForHire: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      maxlength: 25,
    },
    firstNameShowOnProfile: {
      type: Boolean,
      default: false,
    },
    lastName: {
      type: String,
      maxlength: 25,
    },
    lastNameShowOnProfile: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
      maxlength: 25,
    },
    userNameShowOnProfile: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    url: {
      type: String,
    },
    resume: {
      type: String,
    },
    type: {
      type: String,
    },
    phone: {
      type: Number,
    },
    contactShowOnProfile: {
      type: Boolean,
      default: false,
    },
    whatsapp: {
      type: Number,
    },
    whatsappShowOnProfile: {
      type: Boolean,
      default: false,
    },
    emailShowOnProfile: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      maxlength: 100,
    },
    addressShowOnProfile: {
      type: Boolean,
      default: false,
    },
    experience: {
      type: Number,
    },
    experienceCondition: {
      type: Boolean,
      default: false,
    },
    city: {
      type: String,
    },
    aboutMe: {
      type: String,
      maxlength: 1000,
    },
    aboutMeShowOnProfile: {
      type: Boolean,
      default: false,
    },
    cityShowOnProfile: {
      type: String,
    },
    education: {
      type: String,
    },
    educationShowOnProfile: {
      type: Boolean,
      default: false,
    },
    educationBoard: {
      type: String,
      enum: ["icse", "cbse", "igse", "state board", "ib"],
      default: "state board",
    },
    educationBoardShowOnProfile: {
      type: Boolean,
      default: false,
    },
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
      default: "state board",
    },
    ctcShowOnProfile: {
      type: Boolean,
      default: false,
    },
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
      default: "state board",
    },
    expectedCtcShowOnProfile: {
      type: Boolean,
      default: false,
    },
    boardCondition: {
      type: Boolean,
      default: false,
    },
    preference: {
      type: String,
      enum: ["school", "college", "private institutions"],
      default: "school",
    },
    skills: {
      type: String,
    },
    skillsShowOnProfile: {
      type: Boolean,
      default: false,
    },
    languages: {
      type: String,
    },
    languagesShowOnProfile: {
      type: Boolean,
      default: false,
    },
    awardsAndRecognition: {
      type: String,
    },
    awardsAndRecognitionShowOnProfile: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
    },
    countryShowOnProfile: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
    },
    stateShowOnProfile: {
      type: Boolean,
      default: false,
    },
    experienceShowOnProfile: {
      type: Boolean,
      default: false,
    },
    resumeURL: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { strict: false },
);

let userInformationIthoutStrict = null;
try {
  userInformationIthoutStrict = mongoose.model("users");
} catch (error) {
  userInformationIthoutStrict = mongoose.model("users", usersSchemaNew);
}

const models = {
  dbUpdateUserData: async function (userId, updatedFields) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(userId) };
      const update = { $set: { ...updatedFields } };
      const options = { returnOriginal: false, new: false, upsert: true };

      console.log("Filter: ", filter);
      console.log("Update: ", update);
      console.log("Options: ", options);

      const result = await userInformationIthoutStrict.updateOne(
        filter,
        update,
        options,
      );

      console.log("Result: ", result);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  dbUpdateUser: async function (updatedFields) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(updatedFields.userId) };
      const update = { $set: { ...updatedFields } };
      const options = { returnOriginal: false, new: false, upsert: true };

      console.log("Filter: ", filter);
      console.log("Update: ", update);
      console.log("Options: ", options);

      const result = await userInformationIthoutStrict.updateOne(
        filter,
        update,
        options,
      );

      console.log("Result: ", result);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  dbGetUsersData: async function (find, select, sort, skip, limit) {
    try {
      const data = await Profile.find(find)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
      return data;
    } catch (error) {
      console.error("Error in profileService.serachProfile:", error);
      throw new Error("Failed to fetch profiles");
    }
  },

  dbDeleteUserData: async function (find) {
    try {
      const result = await userInformationIthoutStrict.deleteOne(find);
      return result;
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  },
};

module.exports = models;
