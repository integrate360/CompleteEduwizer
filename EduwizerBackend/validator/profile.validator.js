const Joi = require('./validator')

const validator = {
  updateProfile: async function (req, res, next) {
    try {
      const signUpSchema = Joi.object({
        availableForHire: Joi.boolean().optional(),
        generalsShowOnProfile: Joi.boolean().optional(),
        instituteName: Joi.string().max(25).optional(),
        instituteNameShowOnProfile: Joi.boolean().optional(),
        firstName: Joi.string().max(25).optional(),
        firstNameShowOnProfile: Joi.boolean().optional(),
        location: Joi.string().max(25).optional(),
        locationShowOnProfile: Joi.boolean().optional(),
        lastName: Joi.string().max(25).optional(),
        lastNameShowOnProfile: Joi.boolean().optional(),
        userName: Joi.string().max(25).optional(),
        userNameShowOnProfile: Joi.boolean().optional(),
        password: Joi.string().optional(),
        phone: Joi.number().optional(),
        contactShowOnProfile: Joi.boolean().optional(),
        whatsapp: Joi.number().optional(),
        whatsappShowOnProfile: Joi.boolean().optional(),
        emailShowOnProfile: Joi.boolean().optional(),
        address: Joi.string().max(100).optional(),
        addressShowOnProfile: Joi.boolean().optional(),
        experience: Joi.number().optional(),
        experienceCondition: Joi.boolean().optional(),
        city: Joi.string().optional(),
        aboutMe: Joi.string().max(1000).optional(),
        aboutMeShowOnProfile: Joi.boolean().optional(),
        aboutUs: Joi.string().max(1000).optional(),
        aboutUsShowOnProfile: Joi.boolean().optional(),
        lifeAtInstitute: Joi.string().max(1000).optional(),
        lifeAtInstituteShowOnProfile: Joi.boolean().optional(),
        servicesProvided: Joi.string().max(1000).optional(),
        servicesProvidedShowOnProfile: Joi.boolean().optional(),
        cityShowOnProfile: Joi.string().optional(),
        education: Joi.string().optional(),
        educationShowOnProfile: Joi.boolean().optional(),
        educationBoard: Joi.string()
          .optional()
          // .valid("State Board")
          .error(new Error('Board must be State Board')),
        educationBoardShowOnProfile: Joi.boolean().optional(),
        ctc: Joi.string().optional(),
        ctcShowOnProfile: Joi.boolean().optional(),
        expectedCtc: Joi.string().optional(),
        expectedCtcShowOnProfile: Joi.boolean().optional(),
        boradCOndition: Joi.boolean().optional(),
        preference: Joi.string()
          .optional()
          // .valid("school")
          .error(new Error('Preference must be school')),
        skills: Joi.string().optional(),
        skillsShowOnProfile: Joi.boolean().optional(),
        languages: Joi.string().optional(),
        languagesShowOnProfile: Joi.boolean().optional(),
        awardsAndRecognition: Joi.string().optional(),
        awardsAndRecognitionShowOnProfile: Joi.boolean().optional(),
        country: Joi.string().optional(),
        countryShowOnProfile: Joi.boolean().optional(),
        state: Joi.string().optional(),
        stateShowOnProfile: Joi.boolean().optional(),
        experienceShowOnProfile: Joi.boolean().optional()
      })

      const { error, value } = await signUpSchema.validateAsync(req.body)

      if (error) {
        throw error
      }
      console.log('updateProfile', value)
      next()
    } catch (error) {
      console.error(error)
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },

  searchProfile: async function (req, res, next) {
    try {
      const searchProfileSchema = Joi.object({
        category: Joi.string().max(25).required()
      })

      const { error } = await searchProfileSchema.validateAsync(req.body)

      if (error) {
        throw error
      }
      console.log('searchProfile')
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  }
}
module.exports = validator
