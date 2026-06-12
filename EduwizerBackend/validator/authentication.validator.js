const Joi = require("./validator");

const validator = {
  loginValidator: async function (req, res, next) {
    try {
      const login = Joi.object({
        userName: Joi.string().max(100).optional(),
        email: Joi.string().lowercase().email().optional(),
        password: Joi.string().max(25).required(),
      }).xor("userName", "email");
      const { error } = await login.validateAsync(req.body);
      if (error) {
        throw error;
      }
      next();
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message });
    }
  },

  signUpValidator: async function (req, res, next) {
    try {
      const signUpSchema = Joi.object({
        firstName: Joi.string().max(25),
        lastName: Joi.string().max(25),
        userName: Joi.string().max(25),
        password: Joi.string().max(25),
        email: Joi.string().email(),
        phone: Joi.number(),
        url: Joi.string().required(),
        resume: Joi.string().required(),
        fileType: Joi.string().required(),
        age: Joi.number(),
        experience: Joi.number(),
        pincode: Joi.number(),
        country: Joi.string(),
        state: Joi.string(),
        city: Joi.string().allow(null, ''),
        userType: Joi.string(),
        board: Joi.string()
          .valid("icse", "cbse", "igse", "state board", "ib")
          .error(new Error("Board must be ICSE, CBSE, IGSE, State Board, IB")),
        preference: Joi.string(),
        // .valid('school', 'college', 'private institutions')
        // .error(new Error('Preference must be School, College, Private Institutions'))
      });

      const { error, value } = await signUpSchema.validateAsync(req.body);

      if (error) {
        throw error;
      }

      next();
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message });
    }
  },

  sendOtp: async function (req, res, next) {
    try {
      const otp = Joi.object({
        userId: Joi.string().required(),
      });
      req.body = await otp.validateAsync(req.body);
      const { error, value } = await otp.validateAsync(req.body);
      if (error) {
        throw error;
      }
      next();
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message });
    }
  },
  forgotPassword: async function (req, res, next) {
    try {
      const forgotPasswordSchema = Joi.object({
        email: Joi.string().email().required(),
      });

      const { error, value } = await forgotPasswordSchema.validateAsync(
        req.body
      );

      if (error) {
        throw error;
      }

      next();
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message });
    }
  },
  verifyOtp: async function (req, res, next) {
    try {
      const otp = Joi.object({
        code: Joi.number().required(),
        userId: Joi.string().required(),
      });
      req.body = await otp.validateAsync(req.body);
      const { error, value } = await otp.validateAsync(req.body);
      if (error) {
        throw error;
      }
      next();
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message });
    }
  },

  setNewPasswordValidator: async function (req, res, next) {
    try {
      const setPasswordSchema = Joi.object({
        token: Joi.string().required(),
        newPassword: Joi.string().required(),
      });
      

      const { error, value } = await setPasswordSchema.validateAsync(req.body);

      if (error) {
        throw error;
      }

      next();
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message });
    }
  },
};
module.exports = validator;
