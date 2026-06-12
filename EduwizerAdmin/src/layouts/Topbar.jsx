const IconMenuCollapse = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

const IconHamburger = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconLogout = () => (
  <svg
    className="w-4.5 h-4.5 mr-2 text-brand-navy"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Topbar({
  collapsed,
  onToggleCollapse,
  onOpenSidebar = () => {},
  activeItem = "administrators-listing",
  onLogout,
  onChangePassword = () => {},
}) {
  const ROUTE_LABELS = {
    "users-listing": "Users",
    "contact-listing": "Contacts",
    "payment-listing": "Payments",
    "blogs-listing": "Blogs",
    "events-listing": "Events",
    "featured-listing": "Featured",
    "administrators-listing": "Administrators",
    "chancellors-listing": "Chancellors",
    "awards-listing": "Awards",
    testimonials: "Testimonials",
    postads: "Advertisements",
    "add-package": "Add Package",
    "counsellor-package": "Counsellor Package",
    "vendor-package": "Vendor Package",
    "candidate-package": "Candidate Package",
    "recruiter-package": "Recruiter Package",
  };

  const formatTitle = (str) => {
    return (
      ROUTE_LABELS[str] ||
      str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          aria-label="Open sidebar"
          title="Menu"
        >
          <IconHamburger />
        </button>

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer items-center justify-center"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <IconMenuCollapse />
        </button>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="hidden sm:inline text-slate-400 font-light">
            Eduwizer
          </span>
          <span className="hidden sm:inline text-slate-350">/</span>
          <span className="text-slate-800 font-semibold truncate">
            {formatTitle(activeItem)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onChangePassword}
          className="border border-purple-100 bg-purple-50/10 hover:bg-purple-50/40 text-brand-navy hover:text-brand-purple font-medium rounded-xl px-3 lg:px-4 py-1.5 text-xs.5 transition-all cursor-pointer whitespace-nowrap"
        >
          <span className="hidden sm:inline">Change Password</span>
          <span className="sm:hidden">Password</span>
        </button>
        <button
          onClick={onLogout}
          className="border border-purple-100 bg-purple-50/10 hover:bg-purple-50/40 text-brand-navy hover:text-brand-purple font-medium rounded-xl px-3 lg:px-4 py-1.5 text-xs.5 flex items-center transition-all cursor-pointer whitespace-nowrap"
        >
          <IconLogout />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
