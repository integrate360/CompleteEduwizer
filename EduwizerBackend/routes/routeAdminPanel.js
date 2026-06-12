// ======================Controller========================
const adminPanelController = require("../controller/adminPanel");
const staffController = require("../controller/staffController");
const multer = require("multer");
// =============AuthorizationKey=====================
const checkAuthorizationKey = require("../config/jwt.config");

// ===================validator=====================
const adminPanelValidator = require("../validator/adminPanel.validator");
const advertisingController = require("../controller/advertising");
const seoController = require("../controller/seo");

module.exports = function (app) {
  // ==============================SEO=========================
  // Public reads (frontend consumes overrides; crawlers fetch the sitemap)
  app.route("/sitemap.xml").get(seoController.getSitemap);
  app.route("/admin/eduwizer/seo").get(seoController.getAllSeo);
  app.route("/admin/eduwizer/seo/:pageKey").get(seoController.getSeo);
  // Admin writes (auth-gated)
  app
    .route("/admin/eduwizer/seo")
    .post(checkAuthorizationKey.checkToken, seoController.upsertSeo);
  app
    .route("/admin/eduwizer/seo/:pageKey")
    .delete(checkAuthorizationKey.checkToken, seoController.deleteSeo);

  // ==============================blogs=========================
  app.route("/admin/eduwizer/getBlogs").get(
    // checkAuthorizationKey.checkToken,
    adminPanelController.getBlogs,
  );

  app
    .route("/admin/eduwizer/addBlogs")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.addBlogs,
      adminPanelController.addBlogs,
    );
  app
    .route("/admin/eduwizer/updateBlogs")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.updateBlogs,
      adminPanelController.updateBlogs,
    );
  app
    .route("/admin/eduwizer/removeBlogs")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.deleteBlogs,
      adminPanelController.removeBlogs,
    );
  // ================================TeachersData====================
  app.route("/admin/eduwizer/getTeachers").get(
    // checkAuthorizationKey.checkToken,
    adminPanelController.getTeachersData,
  );

  app
    .route("/admin/eduwizer/addTeachers")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.addTeachersData,
      adminPanelController.addTeachersData,
    );
  app
    .route("/admin/eduwizer/updateTeachers")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.updateTeacherData,
      adminPanelController.updateTeachersData,
    );
  app
    .route("/admin/eduwizer/removeTeachers")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.deleteTeacherData,
      adminPanelController.deleteTeachersData,
    );

  // ================================Staff Management====================
  app.route("/admin/eduwizer/getStaff").get(
    // checkAuthorizationKey.checkToken,
    staffController.getStaff,
  );

  app.route("/admin/eduwizer/addStaff").post(
    // checkAuthorizationKey.checkToken,
    staffController.addStaff,
  );

  app.route("/admin/eduwizer/updateStaff").post(
    // checkAuthorizationKey.checkToken,
    staffController.updateStaff,
  );

  app.route("/admin/eduwizer/removeStaff").post(
    // checkAuthorizationKey.checkToken,
    staffController.removeStaff,
  );

  app.route("/admin/eduwizer/getAttendanceLogs").get(
    // checkAuthorizationKey.checkToken,
    staffController.getAttendanceLogs,
  );

  app.route("/admin/eduwizer/checkinAttendance").post(
    // checkAuthorizationKey.checkToken,
    staffController.checkinAttendance,
  );

  app.route("/admin/eduwizer/checkoutAttendance").post(
    // checkAuthorizationKey.checkToken,
    staffController.checkoutAttendance,
  );

  // ================================Featured Lists Data====================
  app.route("/admin/eduwizer/getFeaturedLists").get(
    // checkAuthorizationKey.checkToken,
    adminPanelController.getFeaturedListingsData,
  );

  app
    .route("/admin/eduwizer/addFeaturedLists")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.addFeaturedListingsData,
      adminPanelController.addFeaturedListingsData,
    );
  app
    .route("/admin/eduwizer/updateFeaturedLists")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.updateFeaturedListingData,
      adminPanelController.updateFeaturedListingsData,
    );
  app
    .route("/admin/eduwizer/removeFeaturedLists")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.deleteFeaturedListingData,
      adminPanelController.deleteFeaturedListingsData,
    );

  // ================================Testimonials====================
  app.route("/admin/eduwizer/getTestimonials").get(
    // checkAuthorizationKey.checkToken,
    adminPanelController.getTestimonialsData,
  );

  app
    .route("/admin/eduwizer/addTestimonials")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.addTestimonialsData,
      adminPanelController.addTestimonialsData,
    );
  app
    .route("/admin/eduwizer/updateTestimonials")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.updateTestimonialData,
      adminPanelController.updateTestimonialsData,
    );
  app
    .route("/admin/eduwizer/removeTestimonials")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.deleteTestimonialData,
      adminPanelController.deleteTestimonialsData,
    );

  // ================================Awards And Recognitions Data====================
  app.route("/admin/eduwizer/getAwardsAndRecognitions").get(
    // checkAuthorizationKey.checkToken,
    adminPanelController.getAwardsAndRecognitionsData,
  );

  app
    .route("/admin/eduwizer/addAwardsAndRecognitions")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.addAwardsAndRecognitionsData,
      adminPanelController.addAwardsAndRecognitionsData,
    );
  app
    .route("/admin/eduwizer/updateAwardsAndRecognitions")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.updateAwardsAndRecognitionData,
      adminPanelController.updateAwardsAndRecognitionsData,
    );
  app
    .route("/admin/eduwizer/removeAwardsAndRecognitions")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.deleteAwardsAndRecognitionData,
      adminPanelController.deleteAwardsAndRecognitionsData,
    );

  // ================================About chancellors Data====================
  app.route("/admin/eduwizer/getAboutChancellors").get(
    // checkAuthorizationKey.checkToken,
    adminPanelController.getAboutChancellorsData,
  );

  app
    .route("/admin/eduwizer/addAboutChancellors")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.addAboutChancellorsData,
      adminPanelController.addAboutChancellorsData,
    );
  app
    .route("/admin/eduwizer/updateAboutChancellors")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.updateAboutChancellorData,
      adminPanelController.updateAboutChancellorsData,
    );
  app
    .route("/admin/eduwizer/removeAboutChancellors")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.deleteAboutChancellorData,
      adminPanelController.deleteAboutChancellorsData,
    );

  // ================================Events====================

  app.route("/admin/eduwizer/getEvents").get(
    // checkAuthorizationKey.checkToken,
    adminPanelController.getEvents,
  );

  app
    .route("/admin/eduwizer/addEvents")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.addEvents,
      adminPanelController.addEvents,
    );
  app
    .route("/admin/eduwizer/updateEvents")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.updateEvents,
      adminPanelController.updateEvents,
    );
  app
    .route("/admin/eduwizer/removeEvents")
    .post(
      checkAuthorizationKey.checkToken,
      adminPanelValidator.deleteEvents,
      adminPanelController.deleteEvents,
    );
  const multer = require("multer");
  const upload = multer({ dest: "uploads/" });
  // ================== Ads Routes ==================
  app
    .route("/admin/eduwizer/ads")
    .post(upload.single("image"), advertisingController.createAd);
  app
    .route("/admin/eduwizer/ads/:id")
    .put(upload.single("image"), advertisingController.updateAd);
  app.route("/admin/eduwizer/ads/:id").get(advertisingController.getAdById);
  app.route("/admin/eduwizer/ads/:id").delete(advertisingController.deleteAd);
  app.route("/admin/eduwizer/ads").get(advertisingController.getAllAds);
};
