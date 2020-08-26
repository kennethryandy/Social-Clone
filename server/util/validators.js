const Joi = require('@hapi/joi')

// exports.loginValidators = Joi.object({
//   email: Joi.string().trim().email({ tlds: { allow: false } }),
//   password: Joi.string()
//       .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
//       .trim()
//       .min(6)
//       .max(30)
//       .required(),
// })
exports.signupValidators = Joi.object({
  username: Joi.string()
      .trim()
      .min(3)
      .max(30)
      .required(),

  password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
      .trim()
      .min(6)
      .max(30)
      .required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }),
})