const authenticationService = require("../services/authentication.service");
const jwtConfig = require("../config/jwt.config");
const sgMail = require("../services/mail.service");
const Payment = require("../models/paymentModel.js");
const controllers = {

  signUp: async function (req, res) {
    let response;

    try {
      req.body.email = req.body.email.toLowerCase();

      const find = { email: req.body.email };
      const select = { _id: 0 };

      // 🔍 Check if user already exists
      const existingUser = await authenticationService.getUserDetailsByUserId(find, select);
      if (existingUser) throw new Error("User Already Exists");

      // ➕ Create a new user
      const newUser = await authenticationService.addPendingUser(req.body);

      if (!newUser || !newUser._id) {
        throw new Error("User creation failed");
      }

      // ⏳ Wait 5 minutes to check for any payment
      setTimeout(async () => {
        try {
          const payment = await Payment.findOne({
            userId: newUser._id
          });

          if (!payment) {
            await authenticationService.deletePendingUser({ _id: newUser._id });
            console.log(`🗑️ User ${newUser.email} deleted due to no payment found.`);
          } else {
            console.log(`✅ Payment found for ${newUser.email}, user retained.`);
          }
        } catch (err) {
          console.error("❌ Error during payment check/deletion:", err);
        }
      }, 5 * 60 * 1000); // 5 minutes

      response = {
        success: 1,
        data: newUser,
        message: "Successfully Signed Up",
      };
    } catch (error) {
      console.error("❌ SignUp Error:", error.message);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }

    return res.send(response);
  },

  

  sendOtp: async function (req, res) {
    let response;
    try {
      const find = { _id: req.body.userId };
      const select = {
        __v: 0,
      };
      const userData = await authenticationService.getUserDetailsByUserId(
        find,
        select
      );
      if (userData) {
        const otp = Math.floor(100000 + Math.random() * 9000);
        const apiKey = sgMail.setApiKey(
          process.env.EMAIL_PROVIDER_AUTH_PASSWORD
        );
        const msg = {
          to: userData.email,
          from: process.env.EMAIL || "support@eduwizer.com",
          subject: "Eduwizer - OTP Verification",
          text: `Hello ${userData.firstName} ${userData.lastName},\n\nPlease use the following OTP to verify your Eduwizer Education account: ${otp}\n\nThank you,\nThe Eduwizer Team`,
          html: `<p>Hello ${userData.firstName} ${userData.lastName},</p><p>Please use the following OTP to verify your Eduwizer Education account: <strong>${otp}</strong></p><p>Thank you,<br>The Eduwizer Team</p>`,
        };

        const data = await apiKey.send(msg);

        console.log("data", data);

        if (data && data.length) {
          const obj = {
            userId: req.body.userId,
            verificationCode: otp,
            emailId: userData.email,
          };
          const addUserVerificationCode =
            await authenticationService.userOtpModel(obj);
          response = {
            success: 1,
            data: { userdata: addUserVerificationCode, otpData: data[0] },
            message: "SucessFully Send Otp",
          };
        } else {
          throw new Error("Internal Server Error");
        }
      } else {
        throw new Error("User Not Exists");
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },

  login: async function (req, res) {
    let response;
    let find;
    if (req.body.userName) {
      find = { email: req.body.userName };
    } else if (req.body.email) {
      find = { email: req.body.email };
    } else {
      throw new Error("Internal server Error");
    }
    const select = {
      _id: 1,
      email: 1,
      password: 1,
      userType: 1,
      emailVerified: 1,
      phoneVerified: 1,
    };

    try {
      const data = await authenticationService.getUserDetailsByUserId(
        find,
        select
      );

      if (data) {
        // if (data.emailVerified > 0) {
        if (data && data.password && data.password == req.body.password) {
          const dataForJwt = {
            userId: data._id,
            userType: data.userType,
            email: data.email,
          };

          const generateSession = await jwtConfig.generateToken(
            dataForJwt,
            process.env.secret
          );

          response = {
            success: 1,
            data: data,
            session: generateSession,
            message: "SucessFully Login",
          };
        } else {
          throw new Error("Invalid Crdentials");
        }
        // } else {
        //   throw new Error('Email has not been verified')
        // }
      } else {
        throw new Error("User Not Exists");
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },

  verifyOtp: async function (req, res) {
    // let userId = req.user
    const { code, userId } = req.body;
    const find = {
      userId: userId,
      verificationCode: code,
    };
    const select = {
      _id: 0,
      __v: 0,
    };
    const sort = {
      _id: -1,
    };
    let response;
    try {
      const userData = await authenticationService.getUserVerificationCode(
        find,
        select,
        sort
      );
      if (userData && userData.verificationCode === code) {
        const findUpdate = {
          _id: userId,
          email: userData.emailId,
        };
        const updateData = {
          $set: {
            emailVerified: 1,
          },
        };
        const option = {
          new: true,
        };
        console.log("query", findUpdate, updateData, option);
        const update = await authenticationService.updateUserDetails(
          findUpdate,
          updateData,
          option
        );
        console.log("update", update);
        if (update) {
          const dataForJwt = {
            userId: userId,
            userType: userData.userType,
            email: userData.email,
          };

          const generateSession = await jwtConfig.generateToken(
            dataForJwt,
            process.env.secret
          );

          // update.token = generateSession

          response = {
            success: 1,
            data: update,
            token: generateSession,
            message: "sucessFully verifyOtp",
          };
        } else {
          throw new Error("Internal Server Error");
        }
      } else {
        throw new Error("Invalid Information");
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },
  forgotPassword: async function (req, res) {
    let response;
    try {
      const find = { email: req.body.email };
      const select = {
        _id: 1,
        email: 1,
      };

      const userData = await authenticationService.getUserDetailsByUserId(
        find,
        select
      );

      if (userData) {
        // Generate a unique token for password reset
        const resetToken = await jwtConfig.generateToken(
          { userId: userData._id },
          process.env.secret,
          { expiresIn: "1h" } // Set expiration time for the reset token
        );

        // Construct the reset link
        const resetLink = `https://eduwizer.com/setNewPassword/${resetToken}`;

        // Send an email with a link to reset password
        const apiKey = sgMail.setApiKey(
          process.env.EMAIL_PROVIDER_AUTH_PASSWORD
        );
        const msg = {
          to: userData.email,
          from: process.env.EMAIL || "support@eduwizer.com",
          subject: "Eduwizer - Password Reset",
          text: `Hello,\n\nPlease click on the following link to reset your password: ${resetLink}\n\nThank you,\nThe Eduwizer Team`,
          html: `<p>Hello,</p><p>Please click on the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p><p>Thank you,<br>The Eduwizer Team</p>`,
        };

        await apiKey.send(msg);

        // Include the reset link in the response
        response = {
          success: 1,
          resetLink,
          message:
            "Password reset link sent to your email. Please check your inbox.",
        };
      } else {
        throw new Error("User Not Found");
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        message: error.message,
      };
    }
    return res.send(response);
  },
  setNewPassword: async function (req, res) {
    let response;
    try {
      const { token, newPassword } = req.body;

      const decodedToken = await jwtConfig.verifyToken(
        token,
        process.env.secret
      );
      console.log("Decoded token:", decodedToken);

      // Check if the token is valid
      if (decodedToken) {
        const find = { _id: decodedToken.userId };
        const updateData = {
          $set: {
            password: newPassword,
          },
        };
        const option = {
          new: true,
        };

        console.log("Update Data:", updateData);
        console.log("Option ygesdgjigyxdoylxrifxuif:", option);

        // Update the user's password
        const updatedUser = await authenticationService.updateUserDetails(
          find,
          updateData,
          option
        );
        console.log("Updated user:", updatedUser);

        if (updatedUser) {
          response = {
            success: 1,
            data: updatedUser,
            message: "Password successfully updated",
          };
        } else {
          throw new Error("Internal Server Error");
        }
      } else {
        throw new Error("Invalid or expired token");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 0,
        data: [],
        message: error.message,
      });
    }

    return res.send(response);
  },
  loginFromGoogle: async function () {},

  loginFromLinkedin: async function () {},
  googleCallBack: async function () {},
  linkedinCallBack: async function () {},
};

module.exports = controllers;
