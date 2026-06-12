const Advertising = require("../models/advertising.Model");
const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-south-1",
});

const advertisingController = {
  parsePagination: (query) => {
    const hasPage = query.page !== undefined && query.page !== "";
    const hasLimit = query.limit !== undefined && query.limit !== "";
    const hasSearch = query.search !== undefined && query.search !== "";
    if (!hasPage && !hasLimit && !hasSearch) return null;
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(200, Number(query.limit) || 10));
    return { page, limit, search: query.search };
  },
  uploadImage: async (file) => {
    if (!file) throw new Error("File not provided");

    const fileStream = fs.createReadStream(file.path);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: fileStream,
      ACL: "public-read",
    };

    const s3Data = await s3.upload(params).promise();
    return s3Data.Location;
  },

  createAd: async (req, res) => {
    try {
      const { targetAudience, link, isActive } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Image file is required." });
      }

      const imageUrl = await advertisingController.uploadImage(req.file);

      const newAd = new Advertising({
        targetAudience,
        image: imageUrl,
        link,
        isActive,
      });

      await newAd.save();

      res.status(201).json({
        message: "Ad created successfully",
        data: newAd,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating ad",
        error: error.message,
      });
    }
  },

  getAllAds: async (req, res) => {
    try {
      const pagination = advertisingController.parsePagination(req.query);
      let filter = {};
      if (pagination && pagination.search) {
        const searchRegex = new RegExp(pagination.search, "i");
        filter.$or = [
          { targetAudience: searchRegex },
          { link: searchRegex }
        ];
      }
      if (pagination) {
        const skip = (pagination.page - 1) * pagination.limit;
        const [items, total] = await Promise.all([
          Advertising.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pagination.limit),
          Advertising.countDocuments(filter),
        ]);
        return res.status(200).json({
          message: "Ads retrieved successfully",
          data: items,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / pagination.limit)),
          },
        });
      }

      const ads = await Advertising.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ message: "Ads retrieved successfully", data: ads });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving ads", error: error.message });
    }
  },

  getAdById: async (req, res) => {
    try {
      const { id } = req.params;
      const ad = await Advertising.findById(id);

      if (!ad) return res.status(404).json({ message: "Ad not found" });

      res.status(200).json({ message: "Ad retrieved successfully", data: ad });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving ad", error: error.message });
    }
  },

  updateAd: async (req, res) => {
    try {
      const { id } = req.params;
      const { targetAudience, link, isActive } = req.body;

      let updatedFields = { targetAudience, link, isActive };

      if (req.file) {
        const imageUrl = await advertisingController.uploadImage(req.file);
        updatedFields.image = imageUrl;
      }

      const updatedAd = await Advertising.findByIdAndUpdate(id, updatedFields, {
        new: true,
      });

      if (!updatedAd) return res.status(404).json({ message: "Ad not found" });

      res.status(200).json({
        message: "Ad updated successfully",
        data: updatedAd,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating ad", error: error.message });
    }
  },

  deleteAd: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedAd = await Advertising.findByIdAndDelete(id);

      if (!deletedAd) return res.status(404).json({ message: "Ad not found" });

      res.status(200).json({
        message: "Ad deleted successfully",
        data: deletedAd,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting ad", error: error.message });
    }
  },
};

module.exports = advertisingController;
