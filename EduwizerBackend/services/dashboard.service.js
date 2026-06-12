const susbcribeModel = require("../models/subscribe.model");
const contactUs = require("../models/subscribe.model");
const services = {
  susbcribe: async function (body) {
    let addUser = {};
    try {
      addUser = await susbcribeModel.dbSubscribeUser(body);
    } catch (error) {
      console.error(error);
    }
    return addUser;
  },
  contactUs: async function (body) {
    let contactUs = {};
    console.log(contactUs, "coefspsfsbty");
    try {
      contactUs = await susbcribeModel.dbContactUs(body);
    } catch (error) {
      console.error(error);
    }
    return contactUs;
  },
  getContactMessages: async (page, limit, search) => {
    try {
      if (page || limit || search) {
        return await susbcribeModel.getContactMessagesPaged(page, limit, search);
      }
      const contactMessages = await susbcribeModel.getAllContactUsData();
      return contactMessages;
    } catch (error) {
      throw new Error("Error fetching contact messages: " + error.message);
    }
  },
  deleteContactMessage: async function (id) {
    try {
      return await susbcribeModel.dbDeleteContactUs({ _id: id });
    } catch (error) {
      throw new Error("Error deleting contact: " + error.message);
    }
  }
};

module.exports = services;

