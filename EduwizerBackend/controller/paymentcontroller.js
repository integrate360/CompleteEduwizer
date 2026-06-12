const Payment = require("../models/paymentModel.js");
const mongoose = require("../database/mongodb");
const usersSchemaNew = mongoose.model("users");

const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "AP-SOUTH-1",
});

const paymentController = {
  getUsersWithoutPayments: async (req, res) => {
    try {
      const usersWithoutPayments = await usersSchemaNew.aggregate([
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "userId",
            as: "paymentInfo",
          },
        },
        {
          $match: {
            paymentInfo: { $size: 0 },
          },
        },
        {
          $project: {
            paymentInfo: 0,
          },
        },
      ]);

      if (usersWithoutPayments.length === 0) {
        return res
          .status(404)
          .json({ message: "No users without payments found." });
      }
      res.status(200).json(usersWithoutPayments);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching users without payments.",
        error: error.message,
      });
    }
  },

  checkUserPaymentStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await usersSchemaNew.findById(userId);

      if (!user) {
        return res.status(404).json({ success: 0, isUnpaid: true, unpaidReason: "new", message: "User not found." });
      }

      const currentDate = new Date();
      const isPaid = user.packageExpiryDate && new Date(user.packageExpiryDate) > currentDate;

      if (isPaid) {
        return res.status(200).json({
          success: 1,
          isUnpaid: false,
          unpaidReason: "paid"
        });
      }

      // If they are unpaid, find their latest payment record to see if it is pending verification
      const latestPayment = await Payment.findOne({ userId })
        .populate("packageId")
        .sort({ createdAt: -1 });

      let unpaidReason = "new";
      let pendingPackage = null;
      if (latestPayment && latestPayment.status === "Not Approved") {
        unpaidReason = "pending_verification";
        pendingPackage = latestPayment.packageId;
      } else if (latestPayment && latestPayment.status === "Rejected") {
        unpaidReason = "rejected";
      } else if (user.packageExpiryDate && new Date(user.packageExpiryDate) <= currentDate) {
        unpaidReason = "expired";
      }

      return res.status(200).json({
        success: 1,
        isUnpaid: true,
        unpaidReason,
        pendingPackage
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: "Error checking user payment status.",
        error: error.message
      });
    }
  },

  uploadscreenshot: async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "Please choose the file" });

      const fileStream = fs.createReadStream(req.file.path);
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.file.originalname,
        Body: fileStream,
        ACL: "public-read",
      };

      const s3Data = await s3.upload(params).promise();

      return s3Data.Location;
    } catch (error) {
      console.error(error);
      throw new Error("Error uploading screenshot: " + error.message);
    }
  },
  
  createPayment: async (req, res) => {
    try {
      const { userId, packageId } = req.body;

      if (!userId || !packageId || !req.file) {
        return res.status(400).json({ message: "All fields are required." });
      }
      const screenshotUrl = await paymentController.uploadscreenshot(req, res); 
      const newPayment = new Payment({
        userId,
        packageId,
        screenshot: screenshotUrl,
      });

      await newPayment.save();
      res.status(201).json({
        message: "Payment record created successfully.",
        payment: newPayment,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating payment record.",
        error: error.message,
      });
    }
  },

  getAllPayments: async (req, res) => {
    try {
      let query = {};
      const search = req.query.search;
      if (search) {
        const matchingUsers = await usersSchemaNew.find({
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { userName: { $regex: search, $options: "i" } }
          ]
        }).select("_id");
        
        const userIds = matchingUsers.map(u => u._id);
        query.userId = { $in: userIds };
      }

      const status = req.query.status;
      if (status && status !== "All") {
        query.status = status;
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await Payment.countDocuments(query);
      const pages = Math.ceil(total / limit);

      const payments = await Payment.find(query)
        .populate("userId")
        .populate("packageId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const unseenCount = await Payment.countDocuments({ status: "Not Approved", seen: { $ne: true } });

      res.status(200).json({
        success: 1,
        data: payments,
        unseenCount,
        pagination: {
          total,
          pages,
          page,
          limit
        }
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: "Error fetching payment records.",
        error: error.message,
        data: []
      });
    }
  },

  approvePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id).populate("packageId");

      if (!payment) {
        return res.status(404).json({ success: 0, message: "Payment record not found." });
      }

      payment.status = "Approved";
      payment.seen = true;
      await payment.save();

      // Update user details if user exists and package has details
      if (payment.userId && payment.packageId) {
        const startDate = new Date();
        const expiryDate = new Date();
        const months = payment.packageId.months || 1;
        expiryDate.setMonth(expiryDate.getMonth() + months);

        const packageName = `${months} Months Plan (${payment.packageId.user || "User"})`;

        await usersSchemaNew.findByIdAndUpdate(payment.userId, {
          packageName,
          packageStartDate: startDate,
          packageExpiryDate: expiryDate
        });
      }

      res.status(200).json({
        success: 1,
        message: "Payment approved successfully and user package activated.",
        payment
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: "Error approving payment.",
        error: error.message
      });
    }
  },

  rejectPayment: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id);

      if (!payment) {
        return res.status(404).json({ success: 0, message: "Payment record not found." });
      }

      payment.status = "Rejected";
      payment.seen = true;
      await payment.save();

      // Optionally clear user package details on rejection
      if (payment.userId) {
        await usersSchemaNew.findByIdAndUpdate(payment.userId, {
          $unset: {
            packageName: 1,
            packageStartDate: 1,
            packageExpiryDate: 1
          }
        });
      }

      res.status(200).json({
        success: 1,
        message: "Payment marked as Not Approved.",
        payment
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: "Error rejecting payment.",
        error: error.message
      });
    }
  },

  markAllSeen: async (req, res) => {
    try {
      await Payment.updateMany({ seen: false }, { $set: { seen: true } });
      res.status(200).json({
        success: 1,
        message: "All payments marked as seen."
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: "Error marking payments as seen.",
        error: error.message
      });
    }
  },

  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id)
        .populate("userId", "name email")
        .populate("packageId", "name specialPrize");

      if (!payment) {
        return res.status(404).json({ message: "Payment record not found." });
      }

      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching payment record.",
        error: error.message,
      });
    }
  },

  updatePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedPayment = await Payment.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      if (!updatedPayment) {
        return res.status(404).json({ message: "Payment record not found." });
      }

      res.status(200).json({
        message: "Payment record updated successfully.",
        payment: updatedPayment,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating payment record.",
        error: error.message,
      });
    }
  },

  deletePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPayment = await Payment.findByIdAndDelete(id);

      if (!deletedPayment) {
        return res.status(404).json({ message: "Payment record not found." });
      }

      if (deletedPayment.userId) {
        await usersSchemaNew.findByIdAndUpdate(deletedPayment.userId, {
          $unset: {
            packageName: 1,
            packageStartDate: 1,
            packageExpiryDate: 1
          }
        });
      }

      res.status(200).json({ success: 1, message: "Payment record deleted successfully." });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting payment record.",
        error: error.message,
      });
    }
  },
};

module.exports = paymentController;
