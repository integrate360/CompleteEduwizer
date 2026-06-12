const adminDashboardService = require("../services/adminPanel.service");

function parsePagination(query) {
  const hasPage = query.page !== undefined && query.page !== "";
  const hasLimit = query.limit !== undefined && query.limit !== "";
  const hasSearch = query.search !== undefined && query.search !== "";
  const hasType = query.type !== undefined && query.type !== "";
  if (!hasPage && !hasLimit && !hasSearch && !hasType) return null;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(200, Number(query.limit) || 10));
  return { page, limit, search: query.search, type: query.type };
}

const controllers = {
  addBlogs: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.addBlogs(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully added Blogs",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Error While adding Blogs",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  getBlogs: async function (req, res) {
    let response;
    try {
      let { blogId } = req.query;

      let data = await adminDashboardService.getBlogs(blogId);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Gets Blogs",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },
  updateBlogs: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.updateBlogs(req.body);

      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Update Blogs",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  removeBlogs: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.removeBlogs(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Deleted Blogs",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  addTeachersData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.addTeachersData(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully added Teachers Data",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Error While adding Teachers Data",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  getTeachersData: async function (req, res) {
    let response;
    try {
      let { teacherId } = req.query;
      const pagination = !teacherId ? parsePagination(req.query) : null;
      // console.log("teacherId===", teacherId);
      let data = await adminDashboardService.getTeachersData(teacherId, pagination);
      if (pagination && data && data.items) {
        response = {
          success: 1,
          data: data.items,
          pagination: {
            page: data.page,
            limit: data.limit,
            total: data.total,
            totalPages: Math.max(1, Math.ceil((data.total || 0) / (data.limit || 1))),
          },
          message: "Sucessfully Gets Techers",
        };
        return res.send(response);
      }
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Gets Techers",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },
  updateTeachersData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.updateTeachersData(req.body);

      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Update Techers SucessFully",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  deleteTeachersData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.deleteTeachersData(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Deleted Blogs",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },

  // about chancellors
  addAboutChancellorsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.addAboutChancellorsData(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully added AboutChancellors Data",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Error While adding AboutChancellors Data",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  getAboutChancellorsData: async function (req, res) {
    let response;
    try {
      let { aboutChancellorId } = req.query;
      const pagination = !aboutChancellorId ? parsePagination(req.query) : null;
      // console.log("aboutChancellorId===", aboutChancellorId);
      let data = await adminDashboardService.getAboutChancellorsData(
        aboutChancellorId,
        pagination
      );
      if (pagination && data && data.items) {
        response = {
          success: 1,
          data: data.items,
          pagination: {
            page: data.page,
            limit: data.limit,
            total: data.total,
            totalPages: Math.max(1, Math.ceil((data.total || 0) / (data.limit || 1))),
          },
          message: "Sucessfully Gets AboutChancellors",
        };
        return res.send(response);
      }
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Gets AboutChancellors",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },
  updateAboutChancellorsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.updateAboutChancellorsData(
        req.body
      );

      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Update AboutChancellors SucessFully",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  deleteAboutChancellorsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.deleteAboutChancellorsData(
        req.body
      );
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Deleted AboutChancellors",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  addTestimonialsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.addTestimonialsData(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully added Testimonials Data",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Error While adding Testimonials Data",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  getTestimonialsData: async function (req, res) {
    let response;
    try {
      let { testimonialId } = req.query;
      const pagination = !testimonialId ? parsePagination(req.query) : null;
      // console.log("testimonialId===", testimonialId);
      let data = await adminDashboardService.getTestimonialsData(testimonialId, pagination);
      if (pagination && data && data.items) {
        response = {
          success: 1,
          data: data.items,
          pagination: {
            page: data.page,
            limit: data.limit,
            total: data.total,
            totalPages: Math.max(1, Math.ceil((data.total || 0) / (data.limit || 1))),
          },
          message: "Sucessfully Gets Testimonials",
        };
        return res.send(response);
      }
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Gets Testimonials",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },
  updateTestimonialsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.updateTestimonialsData(req.body);

      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Update Testimonials SucessFully",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  deleteTestimonialsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.deleteTestimonialsData(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Deleted Testimonials",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  addFeaturedListingsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.addFeaturedListingsData(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully added Featured Listings Data",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Error While adding Featured Listings Data",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  getFeaturedListingsData: async function (req, res) {
    let response;
    try {
      let { featuredListId } = req.query;
      const pagination = !featuredListId ? parsePagination(req.query) : null;
      // console.log("featuredListId===", featuredListId);
      let data = await adminDashboardService.getFeaturedListingsData(
        featuredListId,
        pagination
      );
      if (pagination && data && data.items) {
        response = {
          success: 1,
          data: data.items,
          pagination: {
            page: data.page,
            limit: data.limit,
            total: data.total,
            totalPages: Math.max(1, Math.ceil((data.total || 0) / (data.limit || 1))),
          },
          message: "Sucessfully Gets Featured Listings",
        };
        return res.send(response);
      }
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Gets Featured Listings",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },
  updateFeaturedListingsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.updateFeaturedListingsData(
        req.body
      );

      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Update FeaturedListings SucessFully",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  deleteFeaturedListingsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.deleteFeaturedListingsData(
        req.body
      );
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Deleted FeaturedListings",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },

  // awards and recognitions

  addAwardsAndRecognitionsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.addAwardsAndRecognitionsData(
        req.body
      );
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully added AwardsAndRecognitions Data",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Error While adding AwardsAndRecognitions Data",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  getAwardsAndRecognitionsData: async function (req, res) {
    let response;
    try {
      let { awardsAndRecognitionId } = req.query;
      const pagination = !awardsAndRecognitionId ? parsePagination(req.query) : null;
      // console.log("awardsAndRecognitionId===", awardsAndRecognitionId);
      let data = await adminDashboardService.getAwardsAndRecognitionsData(
        awardsAndRecognitionId,
        pagination
      );
      if (pagination && data && data.items) {
        response = {
          success: 1,
          data: data.items,
          pagination: {
            page: data.page,
            limit: data.limit,
            total: data.total,
            totalPages: Math.max(1, Math.ceil((data.total || 0) / (data.limit || 1))),
          },
          message: "Sucessfully Gets AwardsAndRecognitions",
        };
        return res.send(response);
      }
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Gets AwardsAndRecognitions",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },
  updateAwardsAndRecognitionsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.updateAwardsAndRecognitionsData(
        req.body
      );

      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Update AwardsAndRecognitions SucessFully",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  deleteAwardsAndRecognitionsData: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.deleteAwardsAndRecognitionsData(
        req.body
      );
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Deleted AwardsAndRecognitions",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  addEvents: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.addEvents(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully added Events",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Error While adding Events",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  getEvents: async function (req, res) {
    let response;
    try {
      let { eventId } = req.query;

      let data = await adminDashboardService.getEvents(eventId);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Gets Events",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: [],
        message: error.message,
      };
    }
    return res.send(response);
  },
  updateEvents: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.updateEvents(req.body);

      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Update Blogs",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  deleteEvents: async function (req, res) {
    let response;
    try {
      let data = await adminDashboardService.removeEvents(req.body);
      if (data) {
        response = {
          success: 1,
          data: data,
          message: "Sucessfully Deleted Events",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "!No Records Found",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
};

module.exports = controllers;
