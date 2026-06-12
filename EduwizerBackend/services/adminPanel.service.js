
const blogsModel = require("../models/blogs.model")
const teachersModel = require("../models/teachersData.model")
const featuredListingsModel = require("../models/featuredListingsData.model")
const testimonialsModel = require("../models/testimonialsData.model")
const awardsAndRecognitionsModel = require("../models/awardsAndRecognitionsData.model")
const aboutChancellorsModel = require("../models/aboutChancellorsData.model")
const eventsModel = require("../models/events.model")

const services = {
    getBlogs: async function (blogId) {
        let blogData
        try {

            blogData = await blogsModel.dbGetBlogs(blogId)

        } catch (error) {
            console.error(error)
        }
        return blogData;
    },
    addBlogs : async function (body) {
        let blogData
        try {

            blogData = await blogsModel.dbAddBlogs(body)

        } catch (error) {
            console.error(error)
        }
        return blogData;
    },
    removeBlogs : async function (body) {
        let blogData
        try {

            blogData = await blogsModel.dbDeleteBlogs(body)

        } catch (error) {
            console.error(error)
        }
        return blogData;
    },
    updateBlogs : async function (body) {
        let blogData
        try {

            blogData = await blogsModel.dbUpdateBlogs(body)

        } catch (error) {
            console.error(error)
        }
        return blogData;
    },
    addTeachersData : async function (body) {
        let teacherData
        try {
            
            teacherData = await teachersModel.dbAddTeachersData(body)

        } catch (error) {
            console.error(error)
        }
        return teacherData;
    },
    getTeachersData : async function (teacherId, pagination) {
        let teachersData
        try {

            teachersData = await teachersModel.dbGetTeachersData(teacherId, pagination)

        } catch (error) {
            console.error(error)
        }
        return teachersData;
    },
    updateTeachersData : async function (body) {
        let teachersData
        try {

            teachersData = await teachersModel.dbUpdateTeachersData(body)

        } catch (error) {
            console.error(error)
        }
        return teachersData;
    },
    deleteTeachersData : async function (body) {
        let teachersData
        try {

            teachersData = await teachersModel.dbDeleteTeachersData(body)

        } catch (error) {
            console.error(error)
        }
        return teachersData;
    },

    // featured lists
    addFeaturedListingsData : async function (body) {
        let featuredListData
        try {
            
            featuredListData = await featuredListingsModel.dbAddFeaturedListingsData(body)

        } catch (error) {
            console.error(error)
        }
        return featuredListData;
    },
    getFeaturedListingsData : async function (featuredListId, pagination) {
        let featuredListData
        try {

            featuredListData = await featuredListingsModel.dbGetFeaturedListingsData(featuredListId, pagination)

        } catch (error) {
            console.error(error)
        }
        return featuredListData;
    },
    updateFeaturedListingsData : async function (body) {
        let featuredListData
        try {

            featuredListData = await featuredListingsModel.dbUpdateFeaturedListingsData(body)

        } catch (error) {
            console.error(error)
        }
        return featuredListData;
    },
    deleteFeaturedListingsData : async function (body) {
        let featuredListData
        try {

            featuredListData = await featuredListingsModel.dbDeleteFeaturedListingsData(body)

        } catch (error) {
            console.error(error)
        }
        return featuredListData;
    },

        // testimonials
        addTestimonialsData : async function (body) {
            let testimonialsData
            try {
                
                testimonialsData = await testimonialsModel.dbAddTestimonialsData(body)
    
            } catch (error) {
                console.error(error)
            }
            return testimonialsData;
        },
        getTestimonialsData : async function (testimonialId, pagination) {
            let testimonialsData
            try {
    
                testimonialsData = await testimonialsModel.dbGetTestimonialsData(testimonialId, pagination)
    
            } catch (error) {
                console.error(error)
            }
            return testimonialsData;
        },
        updateTestimonialsData : async function (body) {
            let testimonialsData
            try {
    
                testimonialsData = await testimonialsModel.dbUpdateTestimonialsData(body)
    
            } catch (error) {
                console.error(error)
            }
            return testimonialsData;
        },
        deleteTestimonialsData : async function (body) {
            let testimonialsData
            try {
    
                testimonialsData = await testimonialsModel.dbDeleteTestimonialsData(body)
    
            } catch (error) {
                console.error(error)
            }
            return testimonialsData;
        },

        // Awards And Recognitions Data=
        addAwardsAndRecognitionsData : async function (body) {
            let awardsAndRecognitionData
            try {
                
                awardsAndRecognitionData = await awardsAndRecognitionsModel.dbAddAwardsAndRecognitionsData(body)
    
            } catch (error) {
                console.error(error)
            }
            return awardsAndRecognitionData;
        },
        getAwardsAndRecognitionsData : async function (awardsAndRecognitionId, pagination) {
            let awardsAndRecognitionData
            try {
    
                awardsAndRecognitionData = await awardsAndRecognitionsModel.dbGetAwardsAndRecognitionsData(awardsAndRecognitionId, pagination)
    
            } catch (error) {
                console.error(error)
            }
            return awardsAndRecognitionData;
        },
        updateAwardsAndRecognitionsData : async function (body) {
            let awardsAndRecognitionData
            try {
    
                awardsAndRecognitionData = await awardsAndRecognitionsModel.dbUpdateAwardsAndRecognitionsData(body)
    
            } catch (error) {
                console.error(error)
            }
            return awardsAndRecognitionData;
        },
        deleteAwardsAndRecognitionsData : async function (body) {
            let awardsAndRecognitionData
            try {
    
                awardsAndRecognitionData = await awardsAndRecognitionsModel.dbDeleteAwardsAndRecognitionsData(body)
    
            } catch (error) {
                console.error(error)
            }
            return awardsAndRecognitionData;
        },

    // about chancellors
    addAboutChancellorsData : async function (body) {
        let aboutChancellorData
        try {
            
            aboutChancellorData = await aboutChancellorsModel.dbAddAboutChancellorsData(body)

        } catch (error) {
            console.error(error)
        }
        return aboutChancellorData;
    },
    getAboutChancellorsData : async function (aboutChancellorId, pagination) {
        let aboutChancellorData
        try {

            aboutChancellorData = await aboutChancellorsModel.dbGetAboutChancellorsData(aboutChancellorId, pagination)

        } catch (error) {
            console.error(error)
        }
        return aboutChancellorData;
    },
    updateAboutChancellorsData : async function (body) {
        let aboutChancellorData
        try {

            aboutChancellorData = await aboutChancellorsModel.dbUpdateAboutChancellorsData(body)

        } catch (error) {
            console.error(error)
        }
        return aboutChancellorData;
    },
    deleteAboutChancellorsData : async function (body) {
        let aboutChancellorData
        try {

            aboutChancellorData = await aboutChancellorsModel.dbDeleteAboutChancellorsData(body)

        } catch (error) {
            console.error(error)
        }
        return aboutChancellorData;
    },
    getEvents: async function (blogId) {
        let eventData
        try {

            eventData = await eventsModel.dbGetEvents(blogId)

        } catch (error) {
            console.error(error)
        }
        return eventData;
    },
    addEvents : async function (body) {
        let eventData
        try {

            eventData = await eventsModel.dbAddEvents(body)

        } catch (error) {
            console.error(error)
        }
        return eventData;
    },
    removeEvents : async function (body) {
        let eventData
        try {

            eventData = await eventsModel.dbDeleteEvents(body)

        } catch (error) {
            console.error(error)
        }
        return eventData;
    },
    updateEvents : async function (body) {
        let eventData
        try {

            eventData = await eventsModel.dbUpdateEvents(body)

        } catch (error) {
            console.error(error)
        }
        return eventData;
    },
};

module.exports = services;
