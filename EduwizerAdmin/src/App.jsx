import { useState, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "./layouts/Sidebar";
import Topbar from "./layouts/Topbar";
import AdminLogin from "./components/auth/Login";
import { updateProfile, getAdminProfile } from "./Services/api";
import UsersListing from "./components/listings/UsersListing";
import ContactListing from "./components/listings/ContactListing";
import PaymentListing from "./components/listings/PaymentListing";
import ConfirmModal from "./layouts/ConfirmModal";
import FeaturedListing from "./components/dashboard/FeaturedListing";
import AdministratorsListing from "./components/dashboard/AdministratorsListing";
import ChancellorsListing from "./components/dashboard/ChancellorsListing";
import AwardsListing from "./components/dashboard/AwardsListing";
import TestimonialsListing from "./components/dashboard/TestimonialsListing";
import Postads from "./components/dashboard/Postads";
import BlogsListing from "./components/blogs/BlogsListing";
import EventsListing from "./components/events/EventsListing";
import AddPackage from "./components/packages/AddPackage";
import PackagesListing from "./components/packages/PackagesListing";
import StaffManagement from "./components/staff/StaffManagement";

function GuestRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/users-listing" replace />;
  }
  return children;
}

function DashboardLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const openTimeRef = useRef(0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const activeItem =
    location.pathname === "/"
      ? "users-listing"
      : location.pathname.substring(1);

  const openChangePassword = async () => {
    try {
      const response = await getAdminProfile();
      const currentPassword = response?.data?.data?.password || "";

      setPasswordForm((prev) => ({
        ...prev,
        currentPassword: currentPassword,
        newPassword: "",
        confirmPassword: "",
      }));
      setShowCurrentPassword(Boolean(currentPassword));
      setIsChangePasswordOpen(true);
    } catch (error) {
      console.error("Failed to fetch current password:", error);
      toast.error("Unable to load current password");
    }
  };

  const handlePasswordUpdate = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      return toast.error("Please fill in all password fields.");
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New password and confirm password do not match.");
    }

    if (passwordForm.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    try {
      const response = await updateProfile({
        password: passwordForm.newPassword,
      });

      if (response?.data?.success === 1) {
        setIsChangePasswordOpen(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password updated successfully.");
      } else {
        toast.error(response?.data?.message || "Unable to update password.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to update password.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white w-screen relative">
      {/* Mobile sidebar (drawer) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden pointer-events-none">
          <div
            className="absolute inset-0 bg-brand-navy/50 backdrop-blur-xs z-40 pointer-events-auto"
            onClick={() => {
              const diff = Date.now() - openTimeRef.current;
              console.log("Backdrop clicked, diff:", diff);
              if (diff < 300) {
                console.log("Ignoring ghost click on backdrop.");
                return;
              }
              setMobileSidebarOpen(false);
            }}
          />
          <div className="absolute inset-y-0 left-0 z-50 pointer-events-auto">
            <Sidebar
              mode="mobile"
              collapsed={false}
              onNavigate={() => setMobileSidebarOpen(false)}
              onRequestClose={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block shrink-0 z-10">
        <Sidebar collapsed={collapsed} />
      </div>
      <div className="flex-1 flex flex-col h-screen min-w-0 w-full bg-slate-50/50 overflow-hidden z-10">
        <Topbar
          collapsed={collapsed}
          activeItem={activeItem}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onOpenSidebar={() => {
            console.log("Opening mobile sidebar. Logging timestamp.");
            setMobileSidebarOpen(true);
            openTimeRef.current = Date.now();
          }}
          onLogout={() => setIsLogoutModalOpen(true)}
          onChangePassword={openChangePassword}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-hidden w-full relative z-10">
          <Outlet />
        </main>
      </div>
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base.5 font-bold text-brand-navy">
                Change Admin Password
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full h-10 pr-12 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold text-xs.5 text-brand-navy"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showCurrentPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    New Password
                  </label>
                  <button
                    type="button"
                    title={
                      showNewPassword
                        ? "Hide New Password"
                        : "Show New Password"
                    }
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="text-[10px] font-semibold text-slate-400 hover:text-slate-700"
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold text-xs.5 text-brand-navy"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <button
                    type="button"
                    title={
                      showConfirmPassword
                        ? "Hide Confirm Password"
                        : "Show Confirm Password"
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-[10px] font-semibold text-slate-400 hover:text-slate-700"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold text-xs.5 text-brand-navy"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs.5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  className="flex-1 px-4 py-2 bg-brand-navy hover:bg-brand-purple text-white font-bold rounded-xl text-xs.5 transition-all cursor-pointer shadow-md shadow-brand-navy/15"
                >
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out from the Admin Dashboard?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => {
          localStorage.removeItem("token");
          toast.success("Logged out successfully.");
          navigate("/login", { replace: true });
        }}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}

function DashboardContent({ title }) {
  return (
    <div className="max-w-7xl mx-auto bg-slate-950 rounded-3xl border border-slate-800 p-8 shadow-sm transition-all duration-305">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-slate-100">
            {title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Perform administration tasks, view data lists, and manage parameters
            for {title.toLowerCase()}.
          </p>
        </div>
        <div className="bg-brand-gold/15 border border-brand-gold/30 rounded-full px-3.5 py-1 text-xs font-bold text-amber-800 uppercase tracking-wide">
          Active View
        </div>
      </div>
      <div className="border border-dashed border-slate-700 rounded-2xl h-96 flex flex-col items-center justify-center bg-slate-900/70 gap-3 text-slate-400">
        <svg
          className="w-10 h-10 text-slate-350"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-100">
            {title} panel is ready to display
          </p>
          <p className="text-xs text-slate-400 font-light mt-1">
            Real-time data integration configured and active.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <AdminLogin />
            </GuestRoute>
          }
        />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/users-listing" replace />} />
          <Route path="/users-listing" element={<UsersListing />} />
          <Route path="/contact-listing" element={<ContactListing />} />
          <Route path="/add-package" element={<AddPackage />} />
          <Route
            path="/counsellor-package"
            element={
              <PackagesListing
                userType="counsellor"
                title="Counsellor Package"
              />
            }
          />
          <Route
            path="/vendor-package"
            element={
              <PackagesListing userType="vendor" title="Vendor Package" />
            }
          />
          <Route
            path="/candidate-package"
            element={
              <PackagesListing userType="candidate" title="Candidate Package" />
            }
          />
          <Route
            path="/recruiter-package"
            element={
              <PackagesListing userType="institute" title="Recruiter Package" />
            }
          />
          <Route path="/blogs-listing" element={<BlogsListing />} />
          <Route path="/events-listing" element={<EventsListing />} />
          <Route path="/payment-listing" element={<PaymentListing />} />
          <Route path="/featured-listing" element={<FeaturedListing />} />
          <Route
            path="/administrators-listing"
            element={<AdministratorsListing />}
          />
          <Route path="/chancellors-listing" element={<ChancellorsListing />} />
          <Route path="/awards-listing" element={<AwardsListing />} />
          <Route path="/testimonials" element={<TestimonialsListing />} />
          <Route path="/postads" element={<Postads />} />
          <Route
            path="/staff-directory"
            element={<StaffManagement activeTab="directory" />}
          />
          <Route
            path="/staff-checkin"
            element={<StaffManagement activeTab="checkin" />}
          />
          <Route
            path="/staff-logs"
            element={<StaffManagement activeTab="yearly" />}
          />
          <Route
            path="/staff-analytics"
            element={<StaffManagement activeTab="analytics" />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
