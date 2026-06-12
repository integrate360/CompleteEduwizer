const mongoose = require("../database/mongodb");

const seoMetaSchema = mongoose.Schema(
  {
    // Stable key for the page this overrides:
    //   fixed pages -> "home", "about-us", "events-blogs", "contact-us"
    //   dynamic     -> "blog:<id>" / "event:<id>"
    pageKey: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    // Focus keywords — for the team's content guidance (NOT a meta-keywords tag,
    // which Google ignores). Stored so the panel can track target terms per page.
    keywords: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: "createdTimestamp", updatedAt: "updatedTimestamp" },
  }
);

let SeoMeta = null;
try {
  SeoMeta = mongoose.model("seoMeta");
} catch (error) {
  SeoMeta = mongoose.model("seoMeta", seoMetaSchema);
}

const models = {
  dbGetAllSeo: async function () {
    return SeoMeta.find({});
  },
  dbGetSeo: async function (pageKey) {
    return SeoMeta.findOne({ pageKey });
  },
  dbUpsertSeo: async function (pageKey, data) {
    return SeoMeta.findOneAndUpdate(
      { pageKey },
      { $set: { ...data, pageKey } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  },
  dbDeleteSeo: async function (pageKey) {
    return SeoMeta.deleteOne({ pageKey });
  },
};

module.exports = models;
