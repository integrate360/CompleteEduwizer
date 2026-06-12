import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../../Services/api";
import toast from "react-hot-toast";
import Pagination from "../../layouts/Pagination";
import ConfirmModal from "../../layouts/ConfirmModal";

const IconEye = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const IconTrash = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default function UsersListing() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [prefFilter, setPrefFilter] = useState("");
    const [boardFilter, setBoardFilter] = useState("");
    const [hireFilter, setHireFilter] = useState("");
    const [userTypeFilter, setUserTypeFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [page, limit, search, prefFilter, boardFilter, hireFilter, userTypeFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsers({
                page,
                limit,
                search,
                preference: prefFilter,
                educationBoard: boardFilter,
                availableForHire: hireFilter,
                userType: userTypeFilter
            });

            if (response.data && response.data.data) {
                const totalPagesFromApi = response.data.pagination?.pages || 0;
                const totalFromApi = response.data.pagination?.total || 0;

                if (response.data.data.length === 0 && page > 1) {
                    const newPage = Math.max(1, totalPagesFromApi);
                    if (newPage !== page) {
                        setPage(newPage);
                        return;
                    }
                }

                const filtered = response.data.data.filter(u => u.email !== "support@eduwizer.com");
                setUsers(filtered);
                if (response.data.pagination) {
                    const excludedCount = response.data.data.length - filtered.length;
                    setTotal(Math.max(0, totalFromApi - excludedCount));
                    setTotalPages(totalPagesFromApi);
                }
            } else if (Array.isArray(response.data)) {
                if (response.data.length === 0 && page > 1) {
                    setPage(1);
                    return;
                }
                const filtered = response.data.filter(u => u.email !== "support@eduwizer.com");
                setUsers(filtered);
                setTotal(filtered.length);
                setTotalPages(1);
            } else {
                toast.error("Failed to load users format.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching users.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearch("");
        setPage(1);
    };

    const handleResetAllFilters = () => {
        setPrefFilter("");
        setBoardFilter("");
        setHireFilter("");
        setUserTypeFilter("");
        setPage(1);
    };

    const handleDeleteUser = (email, name) => {
        setUserToDelete({ email, name });
        setIsDeleteModalOpen(true);
    };

    const executeDeleteUser = async () => {
        if (!userToDelete || !userToDelete.email) return;

        try {
            const res = await deleteUser(userToDelete.email);
            if (res.data && res.data.success) {
                toast.success("User deleted successfully.");
                fetchUsers();
            } else {
                toast.error(res.data.message || "Failed to delete user.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error deleting user.");
        } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm flex flex-col relative">
            <div className="flex flex-col border-b border-slate-100 pb-5 mb-5 gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-brand-navy">
                            Users
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 font-light">
                            Review, search, and manage registered candidates, view profiles, and access resumes.
                        </p>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search name, email, city, board..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="h-10 pl-4 pr-8 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all w-full sm:w-64 text-brand-navy bg-slate-50 focus:bg-white"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy font-bold text-xs"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="h-10 px-4 bg-brand-gold hover:bg-btn-gold-hover text-brand-navy font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-gold/15 cursor-pointer flex items-center justify-center gap-2"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={fetchUsers}
                            disabled={loading}
                            className="h-10 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                            title="Reload"
                        >
                            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Dropdown Filters Row */}
                <div className="flex flex-wrap items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-slate-500 font-medium">Role:</span>
                        <select
                            value={userTypeFilter}
                            onChange={(e) => { setUserTypeFilter(e.target.value); setPage(1); }}
                            className="w-full sm:w-auto border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 font-medium"
                        >
                            <option value="">All</option>
                            <option value="candidate">Candidate</option>
                            <option value="counseller">Counseller</option>
                            <option value="vendor">Vendor</option>
                            <option value="institute">Institute</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-slate-500 font-medium">Preference:</span>
                        <select
                            value={prefFilter}
                            onChange={(e) => { setPrefFilter(e.target.value); setPage(1); }}
                            className="w-full sm:w-auto border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 font-medium"
                        >
                            <option value="">All</option>
                            <option value="school">School</option>
                            <option value="college">College</option>
                            <option value="private institutions">Private Institutions</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-slate-500 font-medium">Board:</span>
                        <select
                            value={boardFilter}
                            onChange={(e) => { setBoardFilter(e.target.value); setPage(1); }}
                            className="w-full sm:w-auto border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 font-medium"
                        >
                            <option value="">All</option>
                            <option value="cbse">CBSE</option>
                            <option value="icse">ICSE</option>
                            <option value="igse">IGSE</option>
                            <option value="ib">IB</option>
                            <option value="state board">State Board</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-slate-500 font-medium">Hire Status:</span>
                        <select
                            value={hireFilter}
                            onChange={(e) => { setHireFilter(e.target.value); setPage(1); }}
                            className="w-full sm:w-auto border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 font-medium"
                        >
                            <option value="">All</option>
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>

                    {(prefFilter || boardFilter || hireFilter || userTypeFilter) && (
                        <button
                            onClick={handleResetAllFilters}
                            className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer ml-auto border border-amber-200/50 bg-amber-50 hover:bg-amber-100/50 rounded-xl px-3.5 py-1.5 transition-all"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500">Loading candidates from server...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-2xl h-96 flex flex-col items-center justify-center bg-slate-50/30 gap-3 text-slate-400">
                    <svg className="w-10 h-10 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-sm font-semibold text-slate-700">No candidates found</p>
                    <p className="text-xs text-slate-400 font-light">Try adjusting your search filters or check back later.</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-between">
                    <div className="overflow-x-auto scrollbar-none border border-slate-100 rounded-2xl">
                        <table className="min-w-full divide-y divide-slate-100 bg-white">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Candidate</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Contact</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Location</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Experience & Board</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Package Name</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Validity / Expiry</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/80 bg-white">
                                {users.map((user, index) => {
                                    const boardVal = user.board || user.educationBoard || "N/A";
                                    const resumeLink = user.resume || user.url;

                                    return (
                                        <tr key={user.userId || user._id || index} className="hover:bg-slate-50/20 transition-all">
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center font-bold text-xs uppercase">
                                                        {(user.firstName || user.userName || "U").substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-brand-navy">
                                                            {user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Anonymous"}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                                            <span className="text-[11px] text-slate-400">
                                                                @{user.userName || "user"}
                                                            </span>
                                                            {user.userType && (
                                                                <span className="bg-teal-50 text-teal-700 rounded-md px-1 py-0.2 text-[9px] font-bold uppercase tracking-wide border border-teal-100/50">
                                                                    {user.userType}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="text-xs text-slate-650 font-light">{user.email}</div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">{user.phone || "No phone"}</div>
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="text-xs font-medium text-slate-700">{user.city || "Unknown City"}</div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">{user.country || "India"}</div>
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="text-xs text-slate-650">
                                                    <span className="font-semibold text-brand-navy">{user.experience ?? 0}</span> years exp.
                                                </div>
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <span className="bg-slate-100 text-slate-600 rounded-md px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wide">
                                                        {boardVal}
                                                    </span>
                                                    <span className="bg-brand-gold/15 text-amber-800 rounded-md px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wide">
                                                        {user.preference || "general"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap text-xs font-semibold text-brand-navy">
                                                {user.packageName || (
                                                    <span className="text-slate-400 font-normal italic">No Package</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap text-xs text-slate-650">
                                                {user.packageExpiryDate ? (
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-semibold text-brand-navy">
                                                            {formatDate(user.packageExpiryDate)}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            Started: {formatDate(user.packageStartDate)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedUser(user)}
                                                        className="p-1.5 border border-slate-200 hover:border-brand-navy bg-slate-50 text-slate-600 hover:text-brand-navy hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                        title="View Full Profile Details"
                                                    >
                                                        <IconEye />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteUser(user.email, `${user.firstName || ""} ${user.lastName || ""}`.trim())}
                                                        className="p-1.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-600 hover:text-red-500 hover:bg-red-50/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                        title="Delete Candidate Profile"
                                                    >
                                                        <IconTrash />
                                                    </button>

                                                    {resumeLink ? (
                                                        <a
                                                            href={resumeLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-brand-navy bg-brand-navy hover:bg-brand-purple text-white hover:text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-navy/15 cursor-pointer"
                                                        >
                                                            View CV
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-slate-350 italic">No CV</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        totalPages={totalPages}
                        showingCount={users.length}
                        itemLabel="candidates"
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                        loading={loading}
                    />
                </div>
            )}

            {/* Candidate Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-lg font-semibold text-brand-navy">
                                Candidate Profile Details
                            </h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                            {/* Profile Header Block */}
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center font-bold text-lg uppercase shrink-0">
                                    {(selectedUser.firstName || selectedUser.userName || "U").substring(0, 2)}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-base font-semibold text-brand-navy truncate">
                                        {selectedUser.firstName || selectedUser.lastName ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() : "Anonymous"}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-light mt-0.5">@{selectedUser.userName || "user"}</p>
                                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                        {selectedUser.userType && (
                                            <span className="bg-teal-50 text-teal-750 border border-teal-100 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                                Role: {selectedUser.userType}
                                            </span>
                                        )}
                                        {selectedUser.availableForHire ? (
                                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                                Available for Hire
                                            </span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-500 border border-slate-200/60 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                                Not Available
                                            </span>
                                        )}
                                        {selectedUser.emailVerified ? (
                                            <span className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                                Email Verified
                                            </span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-400 border border-slate-200/60 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                                Unverified Email
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Info Groups */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                                    <h5 className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider border-b border-slate-100 pb-1.5">Contact Details</h5>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Email</label>
                                        <span className="text-xs.5 text-slate-700 font-medium break-all">{selectedUser.email || "N/A"}</span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Phone</label>
                                        <span className="text-xs.5 text-slate-700 font-medium">{selectedUser.phone || "N/A"}</span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Address</label>
                                        <span className="text-xs.5 text-slate-700 font-medium">{selectedUser.address || "No address provided"}</span>
                                    </div>
                                </div>

                                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                                    <h5 className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider border-b border-slate-100 pb-1.5">Professional Experience</h5>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Experience</label>
                                            <span className="text-xs.5 text-slate-700 font-semibold">{selectedUser.experience ?? 0} years</span>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Age</label>
                                            <span className="text-xs.5 text-slate-700 font-semibold">{selectedUser.age || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Expected CTC</label>
                                        <span className="text-xs.5 text-slate-700 font-medium uppercase">{selectedUser.expectedCtc || "N/A"}</span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Current CTC</label>
                                        <span className="text-xs.5 text-slate-700 font-medium uppercase">{selectedUser.ctc || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                                    <h5 className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider border-b border-slate-100 pb-1.5">Education & Preferences</h5>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Education Board</label>
                                        <span className="text-xs.5 text-slate-700 font-medium uppercase">{selectedUser.board || selectedUser.educationBoard || "N/A"}</span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Teaching Preference</label>
                                        <span className="text-xs.5 text-slate-700 font-medium capitalize">{selectedUser.preference || "N/A"}</span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Highest Education</label>
                                        <span className="text-xs.5 text-slate-700 font-medium">{selectedUser.education || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                                    <h5 className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider border-b border-slate-100 pb-1.5">Location & Meta</h5>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">City</label>
                                            <span className="text-xs.5 text-slate-700 font-medium">{selectedUser.city || "N/A"}</span>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Country</label>
                                            <span className="text-xs.5 text-slate-700 font-medium">{selectedUser.country || "India"}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Registered On</label>
                                        <span className="text-xs.5 text-slate-600">{formatDate(selectedUser.createdTimestamp)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Large Blocks */}
                            <div className="border border-slate-100 rounded-2xl p-4 space-y-4">
                                <h5 className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider border-b border-slate-100 pb-1.5">Additional profile details</h5>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Skills</label>
                                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs.5 text-slate-750 font-light leading-relaxed">
                                        {selectedUser.skills || <span className="italic text-slate-350">No skills declared</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Languages</label>
                                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs.5 text-slate-750 font-light leading-relaxed">
                                        {selectedUser.languages || <span className="italic text-slate-350">No languages listed</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">About Me</label>
                                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs.5 text-slate-750 font-light leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                                        {selectedUser.aboutMe || <span className="italic text-slate-350">No bio provided</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 shrink-0">
                            {(selectedUser.resume || selectedUser.url) ? (
                                <a
                                    href={selectedUser.resume || selectedUser.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 h-9 bg-brand-gold hover:bg-btn-gold-hover text-brand-navy text-xs.5 font-bold rounded-xl transition-all shadow-md shadow-brand-gold/15 cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download CV
                                </a>
                            ) : (
                                <span className="text-xs text-slate-400 italic">No Uploaded CV</span>
                            )}
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-5 h-9 bg-brand-navy hover:bg-brand-purple text-white text-xs.5 font-bold rounded-xl transition-all cursor-pointer"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Candidate Profile"
                message={`Are you sure you want to delete the candidate profile for: ${userToDelete?.name || userToDelete?.email}? This action cannot be undone.`}
                onConfirm={executeDeleteUser}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
            />
        </div>
    );
}
