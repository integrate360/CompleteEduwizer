const Joi = require("joi");

const MyJoi = Joi.defaults((schema) =>
  schema.options({
    errors: {
      wrap: {
        label:" ",
      },
    },
    messages: {
      'string.base': '{#label} must be a string',
        'string.email': '{#label} must be a valid email',
        'number.base': '{#label} must be a number',
        'number.min': '{#label} must be greater than or equal to {#limit}',
        'number.max': '{#label} must be less than or equal to {#limit}',
        'any.required': '{#label}is required',
    }
  })
);

module.exports = MyJoi;
