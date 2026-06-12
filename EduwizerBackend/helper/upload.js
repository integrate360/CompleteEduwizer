const multer = require("multer");
const multerS3 = require("multer-s3");
const shortid = require("shortid");
const Cloud = require("./aws-sdk");
const path = require("path");
const sharp = require("sharp");  


const storage = multer.memoryStorage();

const config = {
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB for initial upload
};

// Multer middleware to handle image processing before upload
const upload = multer(config).single('file');

// Middleware for resizing image before uploading
const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Resize the image using sharp
    const resizedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1024, height: 1024, fit: 'inside' }) // Resize image to fit within 1024x1024
      .toBuffer();

    req.file.buffer = resizedBuffer;

    // Check if the file is under 1MB after resizing
    if (resizedBuffer.length > 1 * 1024 * 1024) {
      return res.status(400).send('Image size exceeds 1MB');
    }

    next();
  } catch (error) {
    return res.status(500).send('Error resizing image');
  }
};

// Multer S3 configuration to upload the processed file
const s3UploadConfig = {
  s3: Cloud.s3,
  bucket: process.env.AWS_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    const prefixPath = req.prefixPath || "";
    const filename =
      Date.now().toString() +
      "_" +
      shortid.generate() +
      path.extname(file.originalname);

    cb(
      null,
      path.format({
        root: prefixPath,
        base: filename,
      })
    );
  },
};

// Create multer instance for uploading to S3 after processing
const uploadToS3 = multer({ storage: multerS3(s3UploadConfig) }).single('file');

// Route or function to use the upload and resizeImage middleware
const handleUpload = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send(err.message);  // Handle multer errors
    }

    resizeImage(req, res, (err) => {
      if (err) {
        return res.status(400).send(err.message);  // Handle resize errors
      }

      uploadToS3(req, res, (err) => {
        if (err) {
          return res.status(400).send('Error uploading to S3');
        }

        res.send("File uploaded and resized successfully!");
      });
    });
  });
};

module.exports = {
  handleUpload,
};
