import { useState, useEffect, useCallback } from "react";
import { getAllPayments, deletePayment, approvePayment, rejectPayment, markPaymentsSeen } from "../../Services/api";
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

const IconZoomIn = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
    </svg>
);

const IconCheck = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const IconX = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function PaymentListing() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [statusFilter, setStatusFilter] = useState("Approved");
    const [unseenCount, setUnseenCount] = useState(0);

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Dedicated unseen count poller — runs every 15s independently of the table data
    const fetchUnseenCount = useCallback(async () => {
        try {
            const res = await getAllPayments({ limit: 1, status: "Not Approved" });
            if (res.data && res.data.unseenCount !== undefined) {
                setUnseenCount(res.data.unseenCount);
            }
        } catch (e) {
            // silent — don't disrupt the UI
        }
    }, []);

    useEffect(() => {
        fetchUnseenCount();
        const interval = setInterval(fetchUnseenCount, 15000);
        return () => clearInterval(interval);
    }, [fetchUnseenCount]);

    useEffect(() => {
        fetchPayments();
    }, [page, limit, search, statusFilter]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await getAllPayments({
                page,
                limit,
                search,
                status: statusFilter
            });

            if (response.data && response.data.data) {
                const totalPagesFromApi = response.data.pagination?.pages || 0;
                const totalFromApi = response.data.pagination?.total || 0;

                // Auto-fallback on empty page after deletions
                if (response.data.data.length === 0 && page > 1) {
                    const newPage = Math.max(1, totalPagesFromApi);
                    if (newPage !== page) {
                        setPage(newPage);
                        return;
                    }
                }

                setPayments(response.data.data);
                if (response.data.unseenCount !== undefined) {
                    setUnseenCount(response.data.unseenCount);
                }
                if (response.data.pagination) {
                    setTotal(totalFromApi);
                    setTotalPages(totalPagesFromApi);
                }
            } else if (Array.isArray(response.data)) {
                if (response.data.length === 0 && page > 1) {
                    setPage(1);
                    return;
                }
                setPayments(response.data);
                setTotal(response.data.length);
                setTotalPages(1);
            } else {
                toast.error("Failed to load payments format.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching payment records.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilterChange = async (newStatus) => {
        setStatusFilter(newStatus);
        setPage(1);
        if ((newStatus === "All" || newStatus === "Not Approved") && unseenCount > 0) {
            try {
                await markPaymentsSeen();
                setUnseenCount(0);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await approvePayment(id);
            if (res.data && res.data.success) {
                toast.success("Payment approved and user package activated.");
                fetchPayments();
                if (selectedPayment && selectedPayment._id === id) {
                    setSelectedPayment(null);
                }
            } else {
                toast.error(res.data.message || "Failed to approve payment.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error approving payment.");
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await rejectPayment(id);
            if (res.data && res.data.success) {
                toast.success("Payment rejected successfully.");
                fetchPayments();
                if (selectedPayment && selectedPayment._id === id) {
                    setSelectedPayment(null);
                }
            } else {
                toast.error(res.data.message || "Failed to reject payment.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error updating status.");
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

    const handleDeletePayment = (id, userDisplayName) => {
        setPaymentToDelete({ id, userDisplayName });
        setIsDeleteModalOpen(true);
    };

    const executeDeletePayment = async () => {
        if (!paymentToDelete || !paymentToDelete.id) return;

        try {
            await deletePayment(paymentToDelete.id);
            toast.success("Payment record deleted successfully.");
            fetchPayments();
            fetchUnseenCount();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error deleting payment record.");
        } finally {
            setIsDeleteModalOpen(false);
            setPaymentToDelete(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm flex flex-col relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-brand-navy">
                        Payments
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-light">
                        Review subscription transactions, verify proof screenshots, and audit package payments.
                    </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search user name or email..."
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
                        onClick={fetchPayments}
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

            {/* Tabs for Status filtering */}
            <div className="flex flex-wrap gap-2 mb-6 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/80">
                <button
                    onClick={() => handleStatusFilterChange("Approved")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        statusFilter === "Approved"
                            ? "bg-brand-navy text-white border-brand-navy shadow-md shadow-brand-navy/15"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    Approved
                </button>
                <button
                    onClick={() => handleStatusFilterChange("Not Approved")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        statusFilter === "Not Approved"
                            ? "bg-brand-navy text-white border-brand-navy shadow-md shadow-brand-navy/15"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    Not Approved
                </button>
                <button
                    onClick={() => handleStatusFilterChange("Rejected")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        statusFilter === "Rejected"
                            ? "bg-brand-navy text-white border-brand-navy shadow-md shadow-brand-navy/15"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    Rejected
                </button>
                <button
                    onClick={() => handleStatusFilterChange("All")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer relative ${
                        statusFilter === "All"
                            ? "bg-brand-navy text-white border-brand-navy shadow-md shadow-brand-navy/15"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    All
                    {unseenCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                    )}
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500">Loading payments from server...</p>
                </div>
            ) : payments.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-2xl h-96 flex flex-col items-center justify-center bg-slate-50/30 gap-3 text-slate-400">
                    <svg className="w-10 h-10 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-sm font-semibold text-slate-700">No payments found</p>
                    <p className="text-xs text-slate-400 font-light">Try adjusting your search criteria or check back later.</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-between">
                    <div className="overflow-x-auto scrollbar-none border border-slate-100 rounded-2xl">
                        <table className="min-w-full divide-y divide-slate-100 bg-white">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">User details</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Package details</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Amount details</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Payment Proof</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Date paid</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/80 bg-white">
                                {payments.map((pm, index) => {
                                    const u = pm.userId || {};
                                    const pkg = pm.packageId || {};
                                    const userNameVal = u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : u.userName || "Unknown User";

                                    return (
                                        <tr key={pm._id || index} className="hover:bg-slate-50/20 transition-all">
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center font-bold text-xs uppercase">
                                                        {userNameVal.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-brand-navy">
                                                            {userNameVal}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                                            <span className="text-[11px] text-slate-400">
                                                                {u.email || "No email"}
                                                            </span>
                                                            {u.userType && (
                                                                <span className="bg-teal-50 text-teal-700 rounded-md px-1 py-0.2 text-[9px] font-bold uppercase tracking-wide border border-teal-100/50">
                                                                    {u.userType}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="text-xs font-medium text-slate-700">
                                                    {pkg.months ? `${pkg.months} Months Plan` : "N/A"}
                                                </div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">
                                                    Target: <span className="capitalize">{pkg.user || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="text-xs font-bold text-emerald-600">
                                                    ₹{pkg.specialPrice ? pkg.specialPrice.trim() : "0"}
                                                </div>
                                                {pkg.Price && pkg.Price !== pkg.specialPrice && (
                                                    <div className="text-[10px] text-slate-400 line-through mt-0.5">
                                                        ₹{pkg.Price.trim()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                {pm.screenshot ? (
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => setPreviewImage(pm.screenshot)}
                                                            className="block w-10 h-10 rounded-lg overflow-hidden border border-slate-200 hover:border-brand-gold transition-all duration-150 relative group cursor-pointer"
                                                        >
                                                            <img 
                                                                src={pm.screenshot} 
                                                                alt="Payment Proof" 
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                                            />
                                                            <div className="absolute inset-0 bg-brand-navy/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150">
                                                                <IconZoomIn />
                                                            </div>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-350 italic">No proof image</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                {pm.status === "Approved" ? (
                                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                        Approved
                                                    </span>
                                                ) : pm.status === "Rejected" ? (
                                                    <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                        Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                                        Not Approved
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap text-xs text-slate-450 font-medium">
                                                {formatDate(pm.createdAt)}
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {pm.status !== "Approved" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(pm._id)}
                                                                className="p-1.5 border border-slate-200 hover:border-emerald-500 bg-slate-50 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                                title="Approve Payment"
                                                            >
                                                                <IconCheck />
                                                            </button>
                                                            {pm.status !== "Rejected" && (
                                                                <button
                                                                    onClick={() => handleReject(pm._id)}
                                                                    className="p-1.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-600 hover:text-red-600 hover:bg-red-50/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                                    title="Reject Payment"
                                                                >
                                                                    <IconX />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => setSelectedPayment(pm)}
                                                        className="p-1.5 border border-slate-200 hover:border-brand-navy bg-slate-50 text-slate-600 hover:text-brand-navy hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                        title="View Receipt Details"
                                                    >
                                                        <IconEye />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeletePayment(pm._id, userNameVal)}
                                                        className="p-1.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-600 hover:text-red-500 hover:bg-red-50/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                        title="Delete Payment Record"
                                                    >
                                                        <IconTrash />
                                                    </button>
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
                        showingCount={payments.length}
                        itemLabel="payments"
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                        loading={loading}
                    />
                </div>
            )}

            {/* Payment Details Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-lg font-semibold text-brand-navy">
                                Transaction details
                            </h3>
                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                            {/* User details header */}
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-base uppercase shrink-0">
                                    {((selectedPayment.userId?.firstName || selectedPayment.userId?.userName || "U")).substring(0, 2)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm.5 font-semibold text-brand-navy truncate">
                                        {selectedPayment.userId?.firstName || selectedPayment.userId?.lastName 
                                            ? `${selectedPayment.userId.firstName || ""} ${selectedPayment.userId.lastName || ""}`.trim() 
                                            : selectedPayment.userId?.userName || "Unknown User"}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">@{selectedPayment.userId?.userName || "user"}</p>
                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                        {selectedPayment.userId?.userType && (
                                            <span className="bg-teal-50 text-teal-700 border border-teal-100 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                                {selectedPayment.userId.userType}
                                            </span>
                                        )}
                                        <span className="bg-brand-gold/15 text-amber-800 border border-brand-gold/25 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                            {selectedPayment.packageId?.months || 0} Months Sub
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                                    <h5 className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider border-b border-slate-100 pb-1.5">User Contact</h5>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Email</label>
                                        <span className="text-xs.5 text-slate-700 font-medium break-all">{selectedPayment.userId?.email || "N/A"}</span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Phone</label>
                                        <span className="text-xs.5 text-slate-700 font-medium">{selectedPayment.userId?.phone || "N/A"}</span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Location</label>
                                        <span className="text-xs.5 text-slate-700 font-medium">
                                            {selectedPayment.userId?.city ? `${selectedPayment.userId.city}, ` : ""}
                                            {selectedPayment.userId?.state ? `${selectedPayment.userId.state}, ` : ""}
                                            {selectedPayment.userId?.country || "India"}
                                        </span>
                                    </div>
                                </div>

                                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                                    <h5 className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider border-b border-slate-100 pb-1.5">Subscription Package</h5>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Status</label>
                                        <span className={`text-xs.5 font-bold ${selectedPayment.status === "Approved" ? "text-emerald-600" : "text-amber-600"}`}>
                                            {selectedPayment.status || "Not Approved"}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Special Price paid</label>
                                        <span className="text-xs.5 text-emerald-600 font-bold">₹{selectedPayment.packageId?.specialPrice ? selectedPayment.packageId.specialPrice.trim() : "0"}</span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Standard Price</label>
                                        <span className="text-xs.5 text-slate-700 font-medium">₹{selectedPayment.packageId?.Price ? selectedPayment.packageId.Price.trim() : "0"}</span>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Transaction Audited At</label>
                                        <span className="text-xs.5 text-slate-600 font-medium">{formatDate(selectedPayment.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Screenshot proof preview */}
                            {selectedPayment.screenshot && (
                                <div className="border border-slate-100 rounded-2xl p-4">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Payment receipt proof</label>
                                    <div 
                                        onClick={() => setPreviewImage(selectedPayment.screenshot)}
                                        className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden max-h-72 flex justify-center items-center cursor-pointer group"
                                    >
                                        <img 
                                            src={selectedPayment.screenshot} 
                                            alt="Receipt Proof large" 
                                            className="max-h-72 object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
                                        />
                                        <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs gap-1.5 transition-all duration-150">
                                            <IconZoomIn />
                                            Click to zoom
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 shrink-0">
                            {selectedPayment.screenshot ? (
                                <button
                                    onClick={() => setPreviewImage(selectedPayment.screenshot)}
                                    className="inline-flex items-center gap-1.5 px-4 h-9 bg-brand-gold hover:bg-btn-gold-hover text-brand-navy text-xs.5 font-bold rounded-xl transition-all shadow-md shadow-brand-gold/15 cursor-pointer"
                                >
                                    <IconZoomIn />
                                    View Full Image
                                </button>
                            ) : (
                                <span className="text-xs text-slate-400 italic">No Screenshot Uploaded</span>
                            )}
                            <div className="flex items-center gap-2">
                                {selectedPayment.status !== "Approved" && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(selectedPayment._id)}
                                            className="px-4 h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                                        >
                                            Approve Payment
                                        </button>
                                        {selectedPayment.status !== "Rejected" && (
                                            <button
                                                onClick={() => handleReject(selectedPayment._id)}
                                                className="px-4 h-9 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                                            >
                                                Reject Payment
                                            </button>
                                        )}
                                    </>
                                )}
                                <button
                                    onClick={() => setSelectedPayment(null)}
                                    className="px-5 h-9 bg-brand-navy hover:bg-brand-purple text-white text-xs.5 font-bold rounded-xl transition-all cursor-pointer"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Payment Record"
                message={`Are you sure you want to delete the payment record for: ${paymentToDelete?.userDisplayName}? This action cannot be undone.`}
                onConfirm={executeDeletePayment}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setPaymentToDelete(null);
                }}
            />

            {/* Image Preview Overlay Modal */}
            {previewImage && (
                <div 
                    className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-[60] p-4 animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                >
                    <button 
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                        aria-label="Close image preview"
                    >
                        ✕
                    </button>
                    <div 
                        className="relative max-w-[90vw] max-h-[85vh] overflow-hidden flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={previewImage} 
                            alt="Payment Proof Full Preview" 
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
