import axios from "./axios";

export function getTestAPI(id, params) {
  return axios.get(`/test/${id}`, { params });
}
export function uploadCVAPI(formData) {
  return axios.post("/uploadResume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function login(body) {
  return axios.post("/eduwizer/login", body);
}
export function forgotPassword(body) {
  return axios.post("/eduwizer/forgotPassword", body);
}
export function setNewPassword(body) {
  return axios.post("/eduwizer/setNewPassword", body);
}
export function signup(body) {
  return axios.post("/eduwizer/signup", body);
}

export function sendotp(body) {
  return axios.post("/eduwizer/send/otp", body);
}

export function verifyotp(body) {
  return axios.post("/eduwizer/verify/otp", body);
}

export function getProfileFromServer() {
  return axios.get("/eduwizer/getProfile");
}

export function updateProfile(body) {
  return axios.post("/eduwizer/updateProfile", body);
}

export function searchAPI(body) {
  return axios.post("/eduwizer/searchProfile", body);
}

export function subscribe(body) {
  return axios.post("/eduwizer/susbcribe", body);
}

export function contactUs(body) {
  return axios.post("/eduwizer/contact-us", body);
}

//Packages
export function editPackage(_id, updatedPackageData) {
  return axios.put(`/updatepackage/${_id}`, updatedPackageData);
}

export function getPackage() {
  return axios.get("/packages");
}
export function getPackageById(id) {
  return axios.get(`/package/${id}`);
}
export function getPackageByCounseller() {
  return axios.get("/packages/counsellor");
}

export function postcreatePayment(formData) {
  return axios.post("/createPayment", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getPackageByVendor() {
  return axios.get("/packages/vendor");
}
export function getPackageByCandidate() {
  return axios.get("/packages/candidate");
}
export function getPackageByInstitute() {
  return axios.get("/packages/institute");
}
export function UsersWithoutPayments() {
  return axios.get("/getUsersWithoutPayments");
}
export function checkPaymentStatusAPI(userId) {
  return axios.get(`/checkPaymentStatus/${userId}`);
}
export function addPackage(data) {
  return axios.post("/createpackage", data);
}

export function deletePackage(_id) {
  return axios.delete(`/deletepackage/${_id}`);
}

// admin

export function getTeachers() {
  return axios.get("/admin/eduwizer/getTeachers");
}

export function getFeaturedLists() {
  return axios.get("/admin/eduwizer/getFeaturedLists");
}

export function getAboutChancellors() {
  return axios.get("/admin/eduwizer/getAboutChancellors");
}

export function getAwardsAndRecognitions() {
  return axios.get("/admin/eduwizer/getAwardsAndRecognitions");
}

export function getTestimonials() {
  return axios.get("/admin/eduwizer/getTestimonials");
}

export function getBlogs() {
  return axios.get("/admin/eduwizer/getBlogs");
}

export function getBlogsById(id) {
  return axios.get("/admin/eduwizer/getBlogs?blogId=" + id);
}

export function getEvents() {
  return axios.get("/admin/eduwizer/getEvents");
}
export function getAds() {
  return axios.get("/admin/eduwizer/ads");
}

export function getEventsById(id) {
  return axios.get("/admin/eduwizer/getEvents?eventId=" + id);
}
