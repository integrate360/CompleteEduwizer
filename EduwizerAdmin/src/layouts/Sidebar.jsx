import { useEffect, useState } from "react";
import eduwizerLogo from "../assets/eduwizer-logo.png";
import eduwizerLogoFull from "../assets/eduwizer-logo-full.png";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPayments } from "../Services/api";

const NAV_ITEMS = [
  {
    id: "users-listing",
    label: "Users",
    path: "/users-listing",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "contact-listing",
    label: "Contacts",
    path: "/contact-listing",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: "packages",
    label: "Packages",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    children: [
      { id: "add-package", label: "Add Package", path: "/add-package" },
      {
        id: "counsellor-package",
        label: "Counsellor Package",
        path: "/counsellor-package",
      },
      {
        id: "vendor-package",
        label: "Vendor Package",
        path: "/vendor-package",
      },
      {
        id: "candidate-package",
        label: "Candidate Package",
        path: "/candidate-package",
      },
      {
        id: "recruiter-package",
        label: "Recruiter Package",
        path: "/recruiter-package",
      },
    ],
  },
  {
    id: "blogs-listing",
    label: "Blogs",
    path: "/blogs-listing",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: "events-listing",
    label: "Events",
    path: "/events-listing",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "payment-listing",
    label: "Payments",
    path: "/payment-listing",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "featured-listing",
    label: "Featured",
    path: "/featured-listing",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  // {
  //   id: "administrators-listing",
  //   label: "Administrators",
  //   path: "/administrators-listing",
  //   icon: (
  //     <svg
  //       className="w-4.5 h-4.5"
  //       fill="none"
  //       viewBox="0 0 24 24"
  //       stroke="currentColor"
  //       strokeWidth="1.8"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  //     </svg>
  //   ),
  // },

  {
    id: "staff-management",
    label: "Staff Management",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    children: [
      { id: "staff-directory", label: "Staff List", path: "/staff-directory" },
      {
        id: "staff-checkin",
        label: "Attendance Check-in",
        path: "/staff-checkin",
      },
      { id: "staff-logs", label: "Attendance Logs", path: "/staff-logs" },
      { id: "staff-analytics", label: "Analytics", path: "/staff-analytics" },
    ],
  },
  {
    id: "chancellors-listing",
    label: "Chancellors",
    path: "/chancellors-listing",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
  },
  {
    id: "awards-listing",
    label: "Awards",
    path: "/awards-listing",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
        <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
      </svg>
    ),
  },
  {
    id: "testimonials",
    label: "Testimonials",
    path: "/testimonials",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "postads",
    label: "Advertisements",
    path: "/postads",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "seo-manager",
    label: "SEO Manager",
    path: "/seo-manager",
    icon: (
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
];

const ChevRight = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevDown = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function Sidebar({
  collapsed = false,
  mode = "desktop",
  onNavigate,
  onRequestClose,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [prevPath, setPrevPath] = useState(currentPath);
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarUnseenCount, setSidebarUnseenCount] = useState(0);

  const fetchSidebarUnseen = async () => {
    try {
      const res = await getAllPayments({ limit: 1 });
      if (res.data && res.data.unseenCount !== undefined) {
        setSidebarUnseenCount(res.data.unseenCount);
      }
    } catch (e) {
      console.error("Error fetching unseen payments count in sidebar", e);
    }
  };

  useEffect(() => {
    fetchSidebarUnseen();
    const interval = setInterval(fetchSidebarUnseen, 15000);
    return () => clearInterval(interval);
  }, [currentPath]);

  if (currentPath !== prevPath) {
    setPrevPath(currentPath);
    setOpenMenu(null);
    if (mode === "mobile") onRequestClose?.();
  }

  const activeParent = NAV_ITEMS.find(
    (item) =>
      item.children &&
      item.children.some((child) => child.path === currentPath),
  );
  const activeParentId = activeParent ? activeParent.id : null;

  const handleParent = (item) => {
    if (item.path) {
      handleChild(item.path);
      return;
    }
    if (collapsed && item.children?.length === 1) {
      handleChild(item.children[0].path);
      return;
    }
    setOpenMenu((prev) => {
      const currentOpen = prev !== null ? prev : activeParentId;
      return currentOpen === item.id ? null : item.id;
    });
  };

  const handleChild = (path) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside
      className={`bg-brand-gradient flex flex-col font-sans shrink-0 relative transition-all duration-300 ease-in-out shadow-xl ${
        mode === "desktop" ? "h-screen sticky top-0 z-20" : "h-full z-50"
      } ${
        collapsed
          ? "w-[72px] overflow-visible"
          : mode === "mobile"
            ? "w-[min(260px,85vw)] overflow-hidden"
            : "w-[260px] overflow-hidden"
      }`}
    >
      <div className="absolute w-80 h-80 rounded-full border-[48px] border-brand-gold/5 -bottom-20 -right-24 pointer-events-none" />
      <div className="absolute w-40 h-40 rounded-full border-[30px] border-brand-gold/5 top-20 -right-8 pointer-events-none" />

      <div
        className={`border-b border-white/10 flex items-center relative z-10 ${
          collapsed ? "py-4 justify-center" : "py-4 px-4"
        } ${mode === "mobile" ? "pr-12" : ""}`}
      >
        <div
          className={`flex items-center w-full ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          {collapsed ? (
            <div className="w-[44px] h-[44px] rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-lg shadow-black/30 shrink-0">
              <img
                src={eduwizerLogo}
                alt="Eduwizer"
                className="w-full h-full object-contain p-1"
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl px-2.5 py-1.5 shadow-md flex items-center justify-center">
              <img
                src={eduwizerLogoFull}
                alt="Eduwizer"
                className="h-[36px] w-auto object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {mode === "mobile" && (
          <button
            type="button"
            onClick={() => onRequestClose?.()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
            title="Close"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav
        className={`flex-1 py-3.5 scrollbar-none relative z-10 ${
          collapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"
        }`}
      >
        {NAV_ITEMS.map((item, idx) => {
          const isOpen = collapsed
            ? openMenu === item.id
            : (openMenu !== null ? openMenu : activeParentId) === item.id;

          const isParentActive = item.path
            ? currentPath === item.path
            : item.children &&
              item.children.some((child) => child.path === currentPath);

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => collapsed && setOpenMenu(item.id)}
              onMouseLeave={() => collapsed && setOpenMenu(null)}
            >
              {idx > 0 && !collapsed && (
                <div className="h-px bg-white/5 my-1.5 mx-4.5" />
              )}

              <div
                className={`flex items-center cursor-pointer select-none transition-colors border-l-[3px] border-transparent relative hover:bg-white/5 ${
                  collapsed
                    ? "py-3.5 justify-center gap-0"
                    : "py-2.5 px-4.5 gap-3 justify-start"
                } ${isParentActive && !collapsed ? "bg-brand-gold/10 border-l-brand-gold" : ""}`}
                onClick={() => handleParent(item)}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className={`shrink-0 transition-colors relative ${
                    isParentActive && !collapsed
                      ? "text-brand-gold"
                      : "text-slate-400"
                  }`}
                >
                  {item.icon}
                  {collapsed &&
                    item.id === "payment-listing" &&
                    sidebarUnseenCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                </span>
                <span
                  className={`flex-1 text-xs.5 truncate tracking-wide transition-colors ${
                    collapsed ? "hidden" : "block"
                  } ${isParentActive ? "text-white font-bold" : "text-slate-300 font-medium"}`}
                >
                  {item.label}
                </span>
                {!collapsed &&
                  item.id === "payment-listing" &&
                  sidebarUnseenCount > 0 && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2 shrink-0"></span>
                  )}
                <span
                  className={`text-slate-500 flex items-center shrink-0 ${
                    collapsed || !item.children ? "hidden" : "block"
                  }`}
                >
                  {isOpen ? <ChevDown /> : <ChevRight />}
                </span>
              </div>

              {isOpen && !collapsed && item.children && (
                <div className="overflow-hidden bg-black/15 border-l-[3px] border-brand-gold/25 transition-all">
                  {item.children.map((child) => {
                    const isChildActive = currentPath === child.path;
                    return (
                      <div
                        key={child.id}
                        className={`py-2 pr-4 pl-11 text-xs.5 cursor-pointer truncate transition-all relative ${
                          isChildActive
                            ? "bg-brand-gold text-brand-navy font-semibold rounded-r-lg mr-3 pl-11 before:content-[''] before:absolute before:left-7 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:rounded-full before:bg-brand-navy hover:text-brand-navy hover:bg-brand-gold"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                        onClick={() => handleChild(child.path)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{child.label}</span>
                          {child.id === "payment-listing" &&
                            sidebarUnseenCount > 0 && (
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {isOpen && collapsed && item.children && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 bg-slate-950">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-900">
                    <div className="text-xs font-bold text-slate-100 truncate">
                      {item.label}
                    </div>
                  </div>
                  <div className="py-1.5">
                    {item.children.map((child) => {
                      const isChildActive = currentPath === child.path;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => handleChild(child.path)}
                          className={`w-full text-left px-3.5 py-2 text-xs.5 transition-colors flex items-center justify-between ${
                            isChildActive
                              ? "bg-brand-navy text-white font-semibold"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span>{child.label}</span>
                          {child.id === "payment-listing" &&
                            sidebarUnseenCount > 0 && (
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div
        className={`px-5 py-3.5 border-t border-white/10 text-[10px] text-slate-400/50 tracking-wider relative z-10 ${
          collapsed ? "hidden" : "block"
        }`}
      >
        © {new Date().getFullYear()} Eduwizer
      </div>
    </aside>
  );
}
