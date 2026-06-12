const profileService = require("../services/profile.service");
const mongoose = require("mongoose");
const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "AP-SOUTH-1",
});

const controllers = {
  uploadResume: async (req, res) => {
    try {
      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: "Please choose a file" });
      }

      // Check if the file size is greater than 2MB (2MB = 1024 * 1024 * 2)
      if (req.file.size > 1024 * 1024 * 2) {
        return res
          .status(400)
          .json({
            message:
              "Sorry, can't upload image. The file size is too large. Maximum allowed size is 2MB.",
          });
      }

      // Create a readable stream for the uploaded file
      const fileStream = fs.createReadStream(req.file.path);

      // Define the S3 upload parameters
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
        Key: req.file.originalname, // Use the original file name as the key
        Body: fileStream, // The file content stream
        ACL: "public-read", // Make the file publicly accessible
      };

      // Upload the file to S3 and get the response
      const s3Data = await s3.upload(params).promise();

      // If the user is authenticated (has payload with userId), update the profile
      if (req.payload && req.payload.userId) {
        await profileService.updateProfile({
          userId: req.payload.userId,
          // Save both the URL and resumeURL with the uploaded file's public URL
          url: s3Data.Location,
          resumeURL: s3Data.Location,
        });
      }

      // Return the uploaded file's URL as a response
      return res.status(200).json({
        success: 1,
        data: s3Data.Location,
        message: "File uploaded successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 0,
        message: "Error uploading file: " + error.message,
      });
    }
  },

  updateProfile: async function (req, res) {
    let response;
    try {
      req.body.userId = req.payload.userId; // Ensure userId is set from the payload

      // Make sure req.body contains the fields to be updated
      const updateData = req.body;
      delete updateData.userId; // Remove userId from update data, it's for filtering

      // Pass the updateData to the service function
      const data = await profileService.updateProfile(
        updateData,
        req.payload.userId,
      );

      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Successfully Updated User",
        };
      } else {
        response = {
          success: 0,
          data: {},
          message:
            "No user was updated. User may not exist or data did not change.",
        };
      }
    } catch (error) {
      console.error(error);

      response = {
        success: 0,
        data: {},
        message: "Error updating user: " + error.message,
      };

      if (error.code === 11000) {
        response.message = "Email Already Exists";
      }
    }
    return res.send(response);
  },

  serachProfile: async function (req, res) {
    let response;
    try {
      let { preference, educationBoard, location, expectedCtc, age, userType } =
        req.body;
      const arrayOfFilters = [];
      if (preference) {
        arrayOfFilters.push({
          preference: { $regex: new RegExp(preference, "i") },
        });
      }
      if (educationBoard) {
        arrayOfFilters.push({
          educationBoard: { $regex: new RegExp(educationBoard, "i") },
        });
      }
      if (location) {
        arrayOfFilters.push({
          location: { $regex: new RegExp(location, "i") },
        });
      }
      if (expectedCtc) {
        arrayOfFilters.push({
          expectedCtc: { $regex: new RegExp(expectedCtc, "i") },
        });
      }
      if (age) {
        arrayOfFilters.push({ age: { $regex: new RegExp(age, "i") } });
      }
      if (userType) {
        arrayOfFilters.push({
          userType: { $regex: new RegExp(userType, "i") },
        });
      }
      let find = {};
      if (arrayOfFilters && arrayOfFilters.length) {
        find = {
          $and: arrayOfFilters,
        };
      }

      let select = {
        _id: 0,
        password: 0,
      };

      let sort = {
        _id: -1,
      };

      let skip = 0;
      let limit = 100;

      let data = await profileService.dbGetUsersData(
        find,
        select,
        sort,
        skip,
        limit,
      );

      if (data && data.length > 0) {
        response = {
          success: 1,
          data: data,
          message: "Successfully Fetched User",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Successfully Fetched User",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },

  getProfile: async function (req, res) {
    let response;
    try {
      console.log("req.payload.userId", req.payload.userId);
      let find = {
        _id: req.payload.userId,
      };
      let select = {
        _id: 0,
      };
      let data = await profileService.getProfile(find, select);

      if (data && data.length > 0) {
        response = {
          success: 1,
          data: data[0] || {},
          message: "Successfully Fetched User",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Successfully Fetched User",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },

  getUsers: async function (req, res) {
    let response;
    try {
      let select = {
        password: 0,
      };

      const userId = req.query.userId;

      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).send({
            success: 0,
            message: "Invalid userId format",
          });
        }

        let data = await profileService.getProfile(userId, select);

        if (data) {
          response = {
            success: 1,
            data: data,
            message: "Successfully Fetched User",
          };
        } else {
          response = {
            success: 0,
            data: {},
            message: "User not found",
          };
        }
      } else {
        const {
          page,
          limit,
          search,
          preference,
          educationBoard,
          availableForHire,
          userType,
        } = req.query;

        if (
          page ||
          limit ||
          search ||
          preference ||
          educationBoard ||
          availableForHire ||
          userType
        ) {
          const p = parseInt(page) || 1;
          const l = parseInt(limit) || 10;
          const skip = (p - 1) * l;

          let query = {};
          const arrayOfFilters = [];

          if (search) {
            const searchRegex = new RegExp(search, "i");
            arrayOfFilters.push({
              $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { userName: searchRegex },
                { city: searchRegex },
                { educationBoard: searchRegex },
                { preference: searchRegex },
              ],
            });
          }

          if (preference) {
            arrayOfFilters.push({ preference });
          }

          if (educationBoard) {
            arrayOfFilters.push({ educationBoard });
          }

          if (availableForHire) {
            arrayOfFilters.push({
              availableForHire: availableForHire === "true",
            });
          }

          if (userType) {
            arrayOfFilters.push({ userType });
          }

          if (arrayOfFilters.length > 0) {
            query = { $and: arrayOfFilters };
          }

          const total = await profileService.dbCountUsers(query);
          const data = await profileService.dbGetUsersData(
            query,
            select,
            { createdTimestamp: -1 },
            skip,
            l,
          );

          response = {
            success: 1,
            data: data,
            pagination: {
              total,
              page: p,
              limit: l,
              pages: Math.ceil(total / l),
            },
            message: "Successfully Fetched Users",
          };
        } else {
          let data = await profileService.getProfile(null, select);

          if (data && data.length > 0) {
            response = {
              success: 1,
              data: data,
              message: "Successfully Fetched Users",
            };
          } else {
            response = {
              success: 0,
              data: [],
              message: "No users found",
            };
          }
        }
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },

  deleteUser: async function (req, res) {
    try {
      const { emailId } = req.params;

      if (!emailId) {
        return res.status(400).send({
          success: 0,
          data: {},
          message: "Email ID is required",
        });
      }

      const filter = { email: emailId };
      const mongoose = require("mongoose");
      const user = await mongoose.model("users").findOne(filter);
      if (user) {
        const Payment = require("../models/paymentModel");
        await Payment.deleteMany({ userId: user._id });
      }

      const deletedUser = await profileService.dbDeleteUserData(filter);

      if (deletedUser) {
        return res.status(200).send({
          success: 1,
          data: deletedUser,
          message: "Successfully deleted user",
        });
      } else {
        return res.status(404).send({
          success: 0,
          data: {},
          message: "User not found or deletion failed",
        });
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
      return res.status(500).send({
        success: 0,
        data: {},
        message: "Internal server error",
      });
    }
  },

  getAllProfiles: async function (req, res) {
    try {
      // Optional: You can apply filters here if needed in the future
      const find = {}; // Get all profiles
      const select = {
        password: 0, // Exclude sensitive fields like password
      };

      const data = await profileService.getAllUserProfiles(find, select);

      if (data && data.length > 0) {
        return res.status(200).send({
          success: 1,
          data,
          message: "All profiles fetched successfully",
        });
      } else {
        return res.status(404).send({
          success: 0,
          data: [],
          message: "No profiles found",
        });
      }
    } catch (error) {
      console.error("Error fetching all profiles: ", error);
      return res.status(500).send({
        success: 0,
        data: {},
        message: "Internal server error: " + error.message,
      });
    }
  },
};

module.exports = controllers;
