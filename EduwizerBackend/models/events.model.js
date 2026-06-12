const mongoose = require("../database/mongodb");
const eventsSchema = mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    image: { type: String, require: true },
    data: { type: String, require: true },
    isActive: { type: Boolean, require: true, default: true },
  },
  {
    timestamps: {
      createdAt: "createdTimestamp",
      updatedAt: false,
    },
  }
);

/**
 * @type {mongoose.Model}
 */
let eventsInformation = null;
try {
  eventsInformation = mongoose.model("events");
} catch (error) {
  eventsInformation = mongoose.model("events", eventsSchema);
}

const models = {
  dbGetEvents: async function (eventId) {
    let data;
    let filter;
    if (eventId) {
      filter = {
        _id: new mongoose.Types.ObjectId(eventId),
        isActive: true,
      };
      console.log("filter", filter);
      data = await eventsInformation.find(filter);
    } else {
      filter = { isActive: true };
      data = await eventsInformation.find(filter);
    }
    return data;
  },
  dbAddEvents: async function (body) {
    const blogData = new eventsInformation(body);
    const data = await blogData.save();
    return data;
  },
  dbUpdateEvents: async function (body) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(body.eventId) };
      const update = { $set: { ...body } };
      const options = { returnOriginal: false, new: false, upsert: true };
      const result = await eventsInformation.updateOne(filter, update, options);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  dbDeleteEvents: async function ({ eventId }) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(eventId) };
      const update = {
        $set: {
          isActive: false,
        },
      };
      const options = { returnOriginal: false, new: false, upsert: true };
      const result = await eventsInformation.updateOne(filter, update, options);
      console.log("Result: ", result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = models;


