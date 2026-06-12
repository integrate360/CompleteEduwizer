const Joi = require('./validator')

const validator = {
  addBlogs: async function (req, res, next) {
    try {
      // title,description,author,image,data
      const addBlogs = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        author: Joi.string().required(),
        image: Joi.string().required(),
        data: Joi.string().required(),
      })
      req.body = await addBlogs.validateAsync(req.body)
      const { error } = await addBlogs.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  updateBlogs: async function (req, res, next) {
    try {
      // title,description,author,image,data
      const updateBlogs = Joi.object({
        blogId: Joi.string().required(),
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        author: Joi.string().optional(),
        image: Joi.string().optional(),
        data: Joi.string().optional(),
      })
      req.body = await updateBlogs.validateAsync(req.body)
      const { error } = await updateBlogs.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  deleteBlogs: async function (req, res, next) {
    try {
      // title,description,author,image,data
      const deleteBlogs = Joi.object({
        blogId: Joi.string().required()
      })
      req.body = await deleteBlogs.validateAsync(req.body)
      const { error } = await deleteBlogs.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  addTeachersData: async function (req, res, next) {
    try {
      const addTeachers = Joi.object({
        country: Joi.string().required(),
        location: Joi.string().required(),
        name: Joi.string().required(),
        position: Joi.string().required(),
        url: Joi.string().required(),
        fileType: Joi.string().required(),
        linkedIn: Joi.string().optional(),
      })
      req.body = await addTeachers.validateAsync(req.body)
      const { error } = await addTeachers.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  updateTeacherData: async function (req, res, next) {
    try {
      const updateTeachers = Joi.object({
        teacherId: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        name: Joi.string().required(),
        position: Joi.string().required(),
        url: Joi.string().required(),
        fileType: Joi.string().required(),
        linkedIn: Joi.optional(),
      })
      req.body = await updateTeachers.validateAsync(req.body)
      const { error } = await updateTeachers.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  deleteTeacherData: async function (req, res, next) {
    try {
      // title,description,author,image,data
      const deleteBlogs = Joi.object({
        teacherId: Joi.string().required()
      })
      req.body = await deleteBlogs.validateAsync(req.body)
      const { error } = await deleteBlogs.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },

  // featured listings
  addFeaturedListingsData: async function (req, res, next) {
    try {
      const addFeaturedListings = Joi.object({
        url: Joi.string().required(),
        fileType: Joi.string().required(),
      })
      req.body = await addFeaturedListings.validateAsync(req.body)
      const { error } = await addFeaturedListings.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  updateFeaturedListingData: async function (req, res, next) {
    try {
      const updateFeaturedListings = Joi.object({
        featuredListId: Joi.string().required(),
        url: Joi.string().required(),
        fileType: Joi.string().required(),
      })
      req.body = await updateFeaturedListings.validateAsync(req.body)
      const { error } = await updateFeaturedListings.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  deleteFeaturedListingData: async function (req, res, next) {
    try {
      // title,description,author,image,data
      const deleteFeaturedListings = Joi.object({
        featuredListId: Joi.string().required()
      })
      req.body = await deleteFeaturedListings.validateAsync(req.body)
      const { error } = await deleteFeaturedListings.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },

    // testimonials
    addTestimonialsData: async function (req, res, next) {
      try {
        const addTestimonials = Joi.object({
          name: Joi.string().required(),
          title: Joi.string().optional().allow(""),
          rating: Joi.number().required(),
          date: Joi.string().required(),
          description: Joi.string().required(),
        })
        req.body = await addTestimonials.validateAsync(req.body)
        const { error } = await addTestimonials.validateAsync(req.body)
        if (error) {
          throw error
        }
        next()
      } catch (error) {
        res.status(400).json({ success: 0, data: [], message: error.message })
      }
    },
    updateTestimonialData: async function (req, res, next) {
      try {
        const updateTestimonials = Joi.object({
          testimonialId: Joi.string().required(),
          name: Joi.string().required(),
          title: Joi.string().optional().allow(""),
          rating: Joi.number().required(),
          date: Joi.string().required(),
          description: Joi.string().required(),
        })
        req.body = await updateTestimonials.validateAsync(req.body)
        const { error } = await updateTestimonials.validateAsync(req.body)
        if (error) {
          throw error
        }
        next()
      } catch (error) {
        res.status(400).json({ success: 0, data: [], message: error.message })
      }
    },
    deleteTestimonialData: async function (req, res, next) {
      try {
        // title,description,author,image,data
        const deleteTestimonials = Joi.object({
          testimonialId: Joi.string().required()
        })
        req.body = await deleteTestimonials.validateAsync(req.body)
        const { error } = await deleteTestimonials.validateAsync(req.body)
        if (error) {
          throw error
        }
        next()
      } catch (error) {
        res.status(400).json({ success: 0, data: [], message: error.message })
      }
    },

    // Awards And Recognitions
    addAwardsAndRecognitionsData: async function (req, res, next) {
      try {
        const addAwardsAndRecognitions = Joi.object({
          url: Joi.string().required(),
          fileType: Joi.string().required(),
          title: Joi.string().required(),
        })
        req.body = await addAwardsAndRecognitions.validateAsync(req.body)
        const { error } = await addAwardsAndRecognitions.validateAsync(req.body)
        if (error) {
          throw error
        }
        next()
      } catch (error) {
        res.status(400).json({ success: 0, data: [], message: error.message })
      }
    },
    updateAwardsAndRecognitionData: async function (req, res, next) {
      try {
        const updateAwardsAndRecognitions = Joi.object({
          awardsAndRecognitionId: Joi.string().required(),
          url: Joi.string().required(),
          fileType: Joi.string().required(),
          title: Joi.string().required(),
        })
        req.body = await updateAwardsAndRecognitions.validateAsync(req.body)
        const { error } = await updateAwardsAndRecognitions.validateAsync(req.body)
        if (error) {
          throw error
        }
        next()
      } catch (error) {
        res.status(400).json({ success: 0, data: [], message: error.message })
      }
    },
    deleteAwardsAndRecognitionData: async function (req, res, next) {
      try {
        // title,description,author,image,data
        const deleteAwardsAndRecognitions = Joi.object({
          awardsAndRecognitionId: Joi.string().required()
        })
        req.body = await deleteAwardsAndRecognitions.validateAsync(req.body)
        const { error } = await deleteAwardsAndRecognitions.validateAsync(req.body)
        if (error) {
          throw error
        }
        next()
      } catch (error) {
        res.status(400).json({ success: 0, data: [], message: error.message })
      }
    },

  // about chancellors
  addAboutChancellorsData: async function (req, res, next) {
    try {
      const addAboutChancellors = Joi.object({
        country: Joi.string().required(),
        location: Joi.string().required(),
        name: Joi.string().required(),
        position: Joi.string().required(),
        url: Joi.string().required(),
        fileType: Joi.string().required(),
        linkedIn: Joi.string().optional().allow(""),
        email: Joi.string().optional().allow(""),
      })
      req.body = await addAboutChancellors.validateAsync(req.body)
      const { error } = await addAboutChancellors.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  updateAboutChancellorData: async function (req, res, next) {
    try {
      const updateAboutChancellors = Joi.object({
        aboutChancellorId: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        name: Joi.string().required(),
        position: Joi.string().required(),
        url: Joi.string().required(),
        fileType: Joi.string().required(),
        linkedIn: Joi.string(),
        email: Joi.string(),
      })
      req.body = await updateAboutChancellors.validateAsync(req.body)
      const { error } = await updateAboutChancellors.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  deleteAboutChancellorData: async function (req, res, next) {
    try {
      // title,description,author,image,data
      const deleteAboutChancellors = Joi.object({
        aboutChancellorId: Joi.string().required()
      })
      req.body = await deleteAboutChancellors.validateAsync(req.body)
      const { error } = await deleteAboutChancellors.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  addEvents: async function (req, res, next) {
    try {
      // title,description,image,data
      const addEvents = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        data: Joi.string().required(),
      })
      req.body = await addEvents.validateAsync(req.body)
      const { error } = await addEvents.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  updateEvents: async function (req, res, next) {
    try {
      // title,description,author,image,data
      const updateEvents = Joi.object({
        eventId: Joi.string().required(),
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        image: Joi.string().optional(),
        data: Joi.string().optional(),
      })
      req.body = await updateEvents.validateAsync(req.body)
      const { error } = await updateEvents.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },
  deleteEvents: async function (req, res, next) {
    try {
      // title,description,author,image,data
      const deleteEvents = Joi.object({
        eventId: Joi.string().required()
      })
      req.body = await deleteEvents.validateAsync(req.body)
      const { error } = await deleteEvents.validateAsync(req.body)
      if (error) {
        throw error
      }
      next()
    } catch (error) {
      res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },

}
module.exports = validator
