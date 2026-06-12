const mongoose = require("../database/mongodb");
const blogsSchema = mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    author: { type: String, require: true },
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
let blogsInformation = null;
try {
  blogsInformation = mongoose.model("blogs");
} catch (error) {
  blogsInformation = mongoose.model("blogs", blogsSchema);
}

const models = {
  dbGetBlogs: async function (blogId) {
    let data;
    let filter;
    if (blogId) {
      filter = {
        _id: new mongoose.Types.ObjectId(blogId),
        isActive: true,
      };
      console.log("filter", filter);
      data = await blogsInformation.find(filter);
    } else {
      filter = { isActive: true };
      data = await blogsInformation.find(filter);
    }
    return data;
  },
  dbAddBlogs: async function (body) {
    const blogData = new blogsInformation(body);
    const data = await blogData.save();
    return data;
  },
  dbUpdateBlogs: async function (body) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(body.blogId) };
      const update = { $set: { ...body } };
      const options = { returnOriginal: false, new: false, upsert: true };
      const result = await blogsInformation.updateOne(filter, update, options);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  dbDeleteBlogs: async function ({ blogId }) {
    try {
      const filter = { _id: new mongoose.Types.ObjectId(blogId) };
      const update = {
        $set: {
          isActive: false,
        },
      };
      const options = { returnOriginal: false, new: false, upsert: true };
      const result = await blogsInformation.updateOne(filter, update, options);
      console.log("Result: ", result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = models;


