const authentication = require("../controller/authentication");
const profileController = require("../controller/profile");
const dashBoardCollectionController = require("../controller/dashboard");
const paymentController = require("../controller/paymentcontroller");
const authenticationValidator = require("../validator/authentication.validator");
const dashboardValidator = require("../validator/dashboard.validation");
const profileValidator = require("../validator/profile.validator");
const Package = require("../models/package.model");
const checkAuthorizationKey = require("../config/jwt.config");
// const resizeImage = require("../helper/upload")
const multer = require("multer");
const handleUpload = require("../helper/upload");
const upload = multer({ dest: "uploads/" });

module.exports = function (app) {
  // ========================Authentication======================
  app.get(
    "/eduwizer/contact-messages",
    dashBoardCollectionController.getContactMessages
  );

  app
    .route("/eduwizer/login")
    .post(authenticationValidator.loginValidator, authentication.login);



  app
    .route("/eduwizer/signup")
    .post(authenticationValidator.signUpValidator, authentication.signUp);

  app.route("/eduwizer/loginGoogle").post(authentication.loginFromGoogle);
  app.route("/eduwizer/loginFacebook").post(authentication.loginFromLinkedin);

  // ============================Profile ===========================
  app
    .route("/eduwizer/updateProfile")
    .post(checkAuthorizationKey.checkToken, profileController.updateProfile);

  app
    .route("/eduwizer/getProfile")
    .get(checkAuthorizationKey.checkToken, profileController.getProfile);

  app
    .route("/eduwizer/getAllProfiles")
    .get(profileController.getAllProfiles);

  app
    .route("/eduwizer/searchProfile")
    .post(checkAuthorizationKey.checkToken, profileController.serachProfile);

  // OAuth Callbacks
  app.route("/auth/google/callback").post(authentication.googleCallBack);
  app.route("/auth/linkedin/callback").post(authentication.linkedinCallBack);

  // OTP Verification
  app
    .route("/eduwizer/send/otp")
    .post(authenticationValidator.sendOtp, authentication.sendOtp);

  app
    .route("/eduwizer/verify/otp")
    .post(authenticationValidator.verifyOtp, authentication.verifyOtp);

  // Forgot & Reset Password
  app
    .route("/eduwizer/forgotPassword")
    .post(
      authenticationValidator.forgotPassword,
      authentication.forgotPassword
    );

  app
    .route("/eduwizer/setNewPassword")
    .post(
      authenticationValidator.setNewPasswordValidator,
      authentication.setNewPassword
    );

  // ==================== Vendor Package Routes ===================
  app.post("/createpackage", async (req, res) => {
    try {
      const { prize, specialPrize, user, months } = req.body;
      const newPackage = new Package({ prize, specialPrize, user, months });
      const savedPackage = await newPackage.save();
      res.status(201).json(savedPackage);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Could not create package", details: error.message });
    }
  });

  // READ all packages
  app.get("/packages", async (req, res) => {
    try {
      const packages = await Package.find();
      res.json(packages);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Could not retrieve packages", details: error.message });
    }
  });

  // Fetch package by ID
  app.get("/package/:id", async (req, res) => {
    try {
      const package = await Package.findById(req.params.id);
      if (!package) {
        res.status(404).json({ error: "Package not found" });
      } else {
        res.json(package);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Could not retrieve package", details: error.message });
    }
  });

  // Fetch packages based on user
  app.get("/packages/:user", async (req, res) => {
    try {
      const { user } = req.params;
      const packages = await Package.find({ user });
      if (packages.length === 0) {
        return res
          .status(404)
          .json({ error: "No packages found for this user" });
      }
      res.json(packages);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Could not retrieve packages", details: error.message });
    }
  });

  // UPDATE a package by ID
  app.put("/updatepackage/:id", async (req, res) => {
    try {
      const { prize, specialPrize } = req.body;
      const updatedPackage = await Package.findByIdAndUpdate(
        req.params.id,
        { prize, specialPrize },
        { new: true }
      );
      if (!updatedPackage) {
        res.status(404).json({ error: "Package not found" });
      } else {
        res.json(updatedPackage);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Could not update package", details: error.message });
    }
  });

  app.delete("/deletepackage/:id", async (req, res) => {
    try {
      const packageId = req.params.id;

      // Find all payments referencing this package
      const Payment = require("../models/paymentModel");
      const payments = await Payment.find({ packageId });
      const userIds = payments.map(p => p.userId).filter(Boolean);

      if (userIds.length > 0) {
        const mongoose = require("mongoose");
        const User = mongoose.model("users");
        await User.updateMany(
          { _id: { $in: userIds } },
          {
            $unset: {
              packageName: "",
              packageStartDate: "",
              packageExpiryDate: ""
            }
          }
        );
      }

      // Delete payments associated with this package
      await Payment.deleteMany({ packageId });

      const deletedPackage = await Package.findByIdAndDelete(packageId);
      if (!deletedPackage) {
        res.status(404).json({ error: "Package not found" });
      } else {
        res.json({ message: "Package deleted successfully" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Could not delete package", details: error.message });
    }
  });

  // Subscriber Channel
  app
    .route("/eduwizer/susbcribe")
    .post(
      dashboardValidator.susbcribe,
      dashBoardCollectionController.susbcribe
    );

  // Resume Upload
  app.route("/uploadResume").post(upload.single("file"), profileController.uploadResume);

  // User-related routes
  app
    .route("/eduwizer/getUsers/_Id")
    .get(checkAuthorizationKey.checkToken, profileController.getUsers);
  app
    .route("/eduwizer/getUsers")
    .get(checkAuthorizationKey.checkToken, profileController.getUsers);
  app
    .route("/eduwizer/:userType")
    .get(checkAuthorizationKey.checkToken, profileController.serachProfile);
  app
    .route("/eduwizer/deleteUsers/:emailId")
    .delete(checkAuthorizationKey.checkToken, profileController.deleteUser);
  app
    .route("/eduwizer/deleteContact/:id")
    .delete(checkAuthorizationKey.checkToken, dashBoardCollectionController.deleteContactMessage);

  // Contact Us route
  app
    .route("/eduwizer/contact-us")
    .post(
      dashboardValidator.contactUs,
      dashBoardCollectionController.contactUs
    );

  // ================== Payment Routes ==================
  app
    .route("/createPayment")
    .post(
      checkAuthorizationKey.checkToken,
      upload.single("screenshot"),
      paymentController.createPayment
    );
  app.route("/getAllPayments").get(paymentController.getAllPayments);
  app
    .route("/getUsersWithoutPayments")
    .get(paymentController.getUsersWithoutPayments);
  app
    .route("/checkPaymentStatus/:userId")
    .get(paymentController.checkUserPaymentStatus);
  app
    .route("/getPaymentById/:id")
    .get(checkAuthorizationKey.checkToken, paymentController.getPaymentById);
  app
    .route("/updatePayment/:id")
    .put(checkAuthorizationKey.checkToken, paymentController.updatePayment);
  app
    .route("/deletePayment/:id")
    .delete(checkAuthorizationKey.checkToken, paymentController.deletePayment);
  app
    .route("/approvePayment/:id")
    .put(checkAuthorizationKey.checkToken, paymentController.approvePayment);
  app
    .route("/rejectPayment/:id")
    .put(checkAuthorizationKey.checkToken, paymentController.rejectPayment);
  app
    .route("/markPaymentsSeen")
    .put(checkAuthorizationKey.checkToken, paymentController.markAllSeen);
};
