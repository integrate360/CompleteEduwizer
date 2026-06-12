const Joi = require("./validator");


const validator = {
  susbcribe : async function (req, res, next) {
    try {

      const susbcribe = Joi.object({
        email: Joi.string().email().required(),
      });
      req.body = await susbcribe.validateAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({success:0,data:[], message: error.message });
    }
  },
  contactUs : async function (req, res, next) {
    try {
      const contactUs = Joi.object({
        name: Joi.string().max(25).required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required(),
        message: Joi.string().max(1000).required(),
      });
      console.log(contactUs, "bekfbsfbsf")
      req.body = await contactUs.validateAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({success:0,data:[], message: error.message });
    }
  },
};
module.exports = validator;
