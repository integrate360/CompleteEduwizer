const seoModel = require("../models/seoMeta.model");
const blogsModel = require("../models/blogs.model");
const eventsModel = require("../models/events.model");

const SITE_URL = (process.env.SITE_URL || "https://eduwizer.com").replace(/\/$/, "");

// Fixed marketing pages included in the sitemap.
const STATIC_PAGES = [
  { path: "/home", changefreq: "weekly", priority: "1.0" },
  { path: "/about-us", changefreq: "monthly", priority: "0.8" },
  { path: "/events-blogs", changefreq: "weekly", priority: "0.9" },
  { path: "/contact-us", changefreq: "monthly", priority: "0.7" },
  { path: "/register/candidate", changefreq: "monthly", priority: "0.8" },
  { path: "/terms-conditions", changefreq: "yearly", priority: "0.3" },
];

const xmlEscape = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const controllers = {
  // ---- public: full map of overrides for the frontend to consume ----
  getAllSeo: async function (req, res) {
    try {
      const docs = await seoModel.dbGetAllSeo();
      const map = {};
      docs.forEach((d) => {
        map[d.pageKey] = {
          title: d.title,
          description: d.description,
          ogImage: d.ogImage,
          keywords: d.keywords,
        };
      });
      return res.send({ success: 1, data: map, message: "SEO settings fetched" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: 0, data: {}, message: error.message });
    }
  },

  // ---- public: single page ----
  getSeo: async function (req, res) {
    try {
      const doc = await seoModel.dbGetSeo(req.params.pageKey);
      return res.send({ success: 1, data: doc || null, message: "SEO fetched" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: 0, data: null, message: error.message });
    }
  },

  // ---- admin: create/update (auth-gated in routes) ----
  upsertSeo: async function (req, res) {
    try {
      const { pageKey, title, description, ogImage, keywords } = req.body;
      if (!pageKey) throw new Error("pageKey is required");
      const doc = await seoModel.dbUpsertSeo(pageKey, {
        title: title || "",
        description: description || "",
        ogImage: ogImage || "",
        keywords: keywords || "",
      });
      return res.send({ success: 1, data: doc, message: "SEO saved" });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ success: 0, data: null, message: error.message });
    }
  },

  // ---- admin: delete an override (page falls back to its built-in defaults) ----
  deleteSeo: async function (req, res) {
    try {
      await seoModel.dbDeleteSeo(req.params.pageKey);
      return res.send({ success: 1, data: [], message: "SEO override removed" });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ success: 0, data: [], message: error.message });
    }
  },

  // ---- public: dynamic sitemap.xml (static pages + every live blog/event) ----
  getSitemap: async function (req, res) {
    try {
      const [blogs, events] = await Promise.all([
        blogsModel.dbGetBlogs().catch(() => []),
        eventsModel.dbGetEvents().catch(() => []),
      ]);

      const urls = [...STATIC_PAGES];
      (blogs || []).forEach((b) =>
        urls.push({
          path: `/blogs-details/${b._id}`,
          changefreq: "monthly",
          priority: "0.7",
          lastmod: b.createdTimestamp,
        })
      );
      (events || []).forEach((e) =>
        urls.push({
          path: `/events-details/${e._id}`,
          changefreq: "monthly",
          priority: "0.7",
          lastmod: e.createdTimestamp,
        })
      );

      const body = urls
        .map((u) => {
          const lastmod = u.lastmod
            ? `<lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>`
            : "";
          return `  <url><loc>${xmlEscape(SITE_URL + u.path)}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority>${lastmod}</url>`;
        })
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
      res.set("Content-Type", "application/xml");
      return res.send(xml);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error generating sitemap");
    }
  },
};

module.exports = controllers;
