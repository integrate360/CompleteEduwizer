import apiClient from "./apiClient";

export function login(body) {
  return apiClient.post("/eduwizer/login", body);
}

export function updateProfile(body) {
  return apiClient.post("/eduwizer/updateProfile", body);
}

export function getAdminProfile() {
  return apiClient.get("/eduwizer/getProfile");
}

export function getContactMessages(params) {
  return apiClient.get("/eduwizer/contact-messages", { params });
}

export function getUsers(params) {
  return apiClient.get("/eduwizer/getUsers", { params });
}

export function deleteUser(emailId) {
  return apiClient.delete(`/eduwizer/deleteUsers/${emailId}`);
}

export function deleteContactMessage(id) {
  return apiClient.delete(`/eduwizer/deleteContact/${id}`);
}

export function uploadResume(formData) {
  return apiClient.post("/uploadResume", formData);
}

// Eduwizer Dashboard (Admin panel)
export function getFeaturedLists(params) {
  return apiClient.get("/admin/eduwizer/getFeaturedLists", { params });
}
export function getFeaturedListById(featuredListId) {
  return apiClient.get("/admin/eduwizer/getFeaturedLists", {
    params: { featuredListId },
  });
}
export function addFeaturedList(body) {
  return apiClient.post("/admin/eduwizer/addFeaturedLists", body);
}
export function updateFeaturedList(body) {
  return apiClient.post("/admin/eduwizer/updateFeaturedLists", body);
}
export function deleteFeaturedList(body) {
  return apiClient.post("/admin/eduwizer/removeFeaturedLists", body);
}

export function getTeachers(params) {
  return apiClient.get("/admin/eduwizer/getTeachers", { params });
}
export function getTeacherById(teacherId) {
  return apiClient.get("/admin/eduwizer/getTeachers", {
    params: { teacherId },
  });
}
export function addTeacher(body) {
  return apiClient.post("/admin/eduwizer/addTeachers", body);
}
export function updateTeacher(body) {
  return apiClient.post("/admin/eduwizer/updateTeachers", body);
}
export function deleteTeacher(body) {
  return apiClient.post("/admin/eduwizer/removeTeachers", body);
}

export function getAboutChancellors(params) {
  return apiClient.get("/admin/eduwizer/getAboutChancellors", { params });
}
export function getAboutChancellorById(aboutChancellorId) {
  return apiClient.get("/admin/eduwizer/getAboutChancellors", {
    params: { aboutChancellorId },
  });
}
export function addAboutChancellor(body) {
  return apiClient.post("/admin/eduwizer/addAboutChancellors", body);
}
export function updateAboutChancellor(body) {
  return apiClient.post("/admin/eduwizer/updateAboutChancellors", body);
}
export function deleteAboutChancellor(body) {
  return apiClient.post("/admin/eduwizer/removeAboutChancellors", body);
}

export function getAwardsAndRecognitions(params) {
  return apiClient.get("/admin/eduwizer/getAwardsAndRecognitions", { params });
}
export function getAwardsAndRecognitionById(awardsAndRecognitionId) {
  return apiClient.get("/admin/eduwizer/getAwardsAndRecognitions", {
    params: { awardsAndRecognitionId },
  });
}
export function addAwardsAndRecognition(body) {
  return apiClient.post("/admin/eduwizer/addAwardsAndRecognitions", body);
}
export function updateAwardsAndRecognition(body) {
  return apiClient.post("/admin/eduwizer/updateAwardsAndRecognitions", body);
}
export function deleteAwardsAndRecognition(body) {
  return apiClient.post("/admin/eduwizer/removeAwardsAndRecognitions", body);
}

export function getTestimonials(params) {
  return apiClient.get("/admin/eduwizer/getTestimonials", { params });
}
export function getTestimonialById(testimonialId) {
  return apiClient.get("/admin/eduwizer/getTestimonials", {
    params: { testimonialId },
  });
}
export function addTestimonial(body) {
  return apiClient.post("/admin/eduwizer/addTestimonials", body);
}
export function updateTestimonial(body) {
  return apiClient.post("/admin/eduwizer/updateTestimonials", body);
}
export function deleteTestimonial(body) {
  return apiClient.post("/admin/eduwizer/removeTestimonials", body);
}

// Ads (Postads)
export function getAds(params) {
  return apiClient.get("/admin/eduwizer/ads", { params });
}
export function getAdById(id) {
  return apiClient.get(`/admin/eduwizer/ads/${id}`);
}
export function createAd(formData) {
  return apiClient.post("/admin/eduwizer/ads", formData);
}
export function updateAd(id, formData) {
  return apiClient.put(`/admin/eduwizer/ads/${id}`, formData);
}
export function deleteAd(id) {
  return apiClient.delete(`/admin/eduwizer/ads/${id}`);
}

// Payments
export function getAllPayments(params) {
  return apiClient.get("/getAllPayments", { params });
}
export function deletePayment(id) {
  return apiClient.delete(`/deletePayment/${id}`);
}
export function approvePayment(id) {
  return apiClient.put(`/approvePayment/${id}`);
}
export function rejectPayment(id) {
  return apiClient.put(`/rejectPayment/${id}`);
}
export function markPaymentsSeen() {
  return apiClient.put("/markPaymentsSeen");
}

// Blogs
export function getBlogs(params) {
  return apiClient.get("/admin/eduwizer/getBlogs", { params });
}
export function getBlogById(blogId) {
  return apiClient.get("/admin/eduwizer/getBlogs", { params: { blogId } });
}
export function addBlog(body) {
  return apiClient.post("/admin/eduwizer/addBlogs", body);
}
export function updateBlog(body) {
  return apiClient.post("/admin/eduwizer/updateBlogs", body);
}
export function deleteBlog(body) {
  return apiClient.post("/admin/eduwizer/removeBlogs", body);
}

// Staff Management
export function getStaff(params) {
  return apiClient.get("/admin/eduwizer/getStaff", { params });
}
export function addStaff(body) {
  return apiClient.post("/admin/eduwizer/addStaff", body);
}
export function updateStaff(body) {
  return apiClient.post("/admin/eduwizer/updateStaff", body);
}
export function deleteStaff(body) {
  return apiClient.post("/admin/eduwizer/removeStaff", body);
}
export function getAttendanceLogs(params) {
  return apiClient.get("/admin/eduwizer/getAttendanceLogs", { params });
}
export function checkinAttendance(body) {
  return apiClient.post("/admin/eduwizer/checkinAttendance", body);
}
export function checkoutAttendance(body) {
  return apiClient.post("/admin/eduwizer/checkoutAttendance", body);
}

// Events
export function getEvents(params) {
  return apiClient.get("/admin/eduwizer/getEvents", { params });
}
export function getEventById(eventId) {
  return apiClient.get("/admin/eduwizer/getEvents", { params: { eventId } });
}
export function addEvent(body) {
  return apiClient.post("/admin/eduwizer/addEvents", body);
}
export function updateEvent(body) {
  return apiClient.post("/admin/eduwizer/updateEvents", body);
}
export function deleteEvent(body) {
  return apiClient.post("/admin/eduwizer/removeEvents", body);
}

// Packages
export function createPackage(body) {
  return apiClient.post("/createpackage", body);
}
export function getPackagesByUser(user) {
  return apiClient.get(`/packages/${user}`);
}
export function updatePackage(id, body) {
  return apiClient.put(`/updatepackage/${id}`, body);
}
export function deletePackage(id) {
  return apiClient.delete(`/deletepackage/${id}`);
}

// SEO
export function getSeoSettings() {
  return apiClient.get("/admin/eduwizer/seo");
}
export function getBlogsForSeo() {
  return apiClient.get("/admin/eduwizer/getBlogs");
}
export function getEventsForSeo() {
  return apiClient.get("/admin/eduwizer/getEvents");
}
export function saveSeo(body) {
  return apiClient.post("/admin/eduwizer/seo", body);
}
export function deleteSeo(pageKey) {
  return apiClient.delete(`/admin/eduwizer/seo/${encodeURIComponent(pageKey)}`);
}
