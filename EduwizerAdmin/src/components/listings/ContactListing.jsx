import { useState, useEffect } from "react";
import { getContactMessages, deleteContactMessage } from "../../Services/api";
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

export default function ContactListing() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, [page, limit, search]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await getContactMessages({
                page,
                limit,
                search
            });

            if (response.data && response.data.data) {
                const totalPagesFromApi = response.data.pagination?.pages || response.data.pages || 0;
                const totalFromApi = response.data.pagination?.total || response.data.total || 0;

                if (response.data.data.length === 0 && page > 1) {
                    const newPage = Math.max(1, totalPagesFromApi);
                    if (newPage !== page) {
                        setPage(newPage);
                        return;
                    }
                }

                setMessages(response.data.data);
                if (response.data.pagination) {
                    setTotal(response.data.pagination.total || 0);
                    setTotalPages(response.data.pagination.pages || 0);
                } else {
                    setTotal(response.data.total || response.data.data.length || 0);
                    setTotalPages(response.data.pages || 1);
                }
            } else if (response.data && response.data.total !== undefined) {
                const totalPagesFromApi = response.data.pages || 1;
                const dataArr = response.data.data || [];
                if (dataArr.length === 0 && page > 1) {
                    const newPage = Math.max(1, totalPagesFromApi);
                    if (newPage !== page) {
                        setPage(newPage);
                        return;
                    }
                }
                setMessages(dataArr);
                setTotal(response.data.total || 0);
                setTotalPages(totalPagesFromApi);
            } else if (Array.isArray(response.data)) {
                if (response.data.length === 0 && page > 1) {
                    setPage(1);
                    return;
                }
                setMessages(response.data);
                setTotal(response.data.length);
                setTotalPages(1);
            } else {
                toast.error("Failed to load messages format.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching contact messages.");
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

    const handleDeleteMessage = (id, senderName) => {
        setMessageToDelete({ id, senderName });
        setIsDeleteModalOpen(true);
    };

    const executeDeleteMessage = async () => {
        if (!messageToDelete || !messageToDelete.id) return;

        try {
            const res = await deleteContactMessage(messageToDelete.id);
            if (res.data && res.data.success) {
                toast.success("Contact message deleted successfully.");
                fetchMessages();
            } else {
                toast.error(res.data.message || "Failed to delete message.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error deleting contact message.");
        } finally {
            setIsDeleteModalOpen(false);
            setMessageToDelete(null);
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
                minute: "2-digit",
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
                        Contacts
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-light">
                        Review feedback, inquiries, and messages submitted by users through the contact portal.
                    </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search name, email, message..."
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
                        onClick={fetchMessages}
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

            {loading ? (
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500">Loading messages from server...</p>
                </div>
            ) : messages.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-2xl h-96 flex flex-col items-center justify-center bg-slate-50/30 gap-3 text-slate-400">
                    <svg className="w-10 h-10 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-sm font-semibold text-slate-700">No contact messages found</p>
                    <p className="text-xs text-slate-400 font-light">Try adjusting your search criteria or check back later.</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-between">
                    <div className="overflow-x-auto scrollbar-none border border-slate-100 rounded-2xl">
                        <table className="min-w-full divide-y divide-slate-100 bg-white">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Sender</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Phone</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Message</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Date Sent</th>
                                    <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/80 bg-white">
                                {messages.map((msg, index) => (
                                    <tr key={msg._id || index} className="hover:bg-slate-50/20 transition-all">
                                        <td className="px-6 py-4.5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center font-bold text-xs uppercase">
                                                    {(msg.name || msg.email || "A").substring(0, 2)}
                                                </div>
                                                <div className="text-sm font-semibold text-brand-navy">
                                                    {msg.name || "Anonymous"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4.5 whitespace-nowrap text-xs text-slate-650 font-light">
                                            {msg.email}
                                        </td>
                                        <td className="px-6 py-4.5 whitespace-nowrap text-xs text-slate-650 font-light">
                                            {msg.phone || <span className="text-slate-350 italic">N/A</span>}
                                        </td>
                                        <td className="px-6 py-4.5 max-w-xs">
                                            <div 
                                                className="text-xs text-slate-500 truncate font-light"
                                                title={msg.message}
                                            >
                                                {msg.message || <span className="italic text-slate-350">No message content</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4.5 whitespace-nowrap text-xs text-slate-450 font-medium">
                                            {formatDate(msg.createdTimestamp)}
                                        </td>
                                        <td className="px-6 py-4.5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedMsg(msg)}
                                                    className="p-1.5 border border-slate-200 hover:border-brand-navy bg-slate-50 text-slate-600 hover:text-brand-navy hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                    title="View Message Details"
                                                >
                                                    <IconEye />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteMessage(msg._id, msg.name)}
                                                    className="p-1.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-600 hover:text-red-500 hover:bg-red-50/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                    title="Delete Contact Message"
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        totalPages={totalPages}
                        showingCount={messages.length}
                        itemLabel="messages"
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                        loading={loading}
                    />
                </div>
            )}

            {/* Message Details Modal */}
            {selectedMsg && (
                <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-lg font-semibold text-brand-navy">
                                Feedback Message Details
                            </h3>
                            <button
                                onClick={() => setSelectedMsg(null)}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sender Name</label>
                                <p className="text-sm font-semibold text-brand-navy">{selectedMsg.name || "Anonymous"}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                                    <p className="text-xs text-slate-700 font-medium break-all">{selectedMsg.email}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                                    <p className="text-xs text-slate-700 font-medium">{selectedMsg.phone || "N/A"}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Submitted At</label>
                                <p className="text-xs text-slate-600">{formatDate(selectedMsg.createdTimestamp)}</p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Message Body</label>
                                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs.5 text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-light">
                                    {selectedMsg.message || <span className="italic text-slate-350">No message contents</span>}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
                            <button
                                onClick={() => setSelectedMsg(null)}
                                className="px-5 h-9 bg-brand-navy hover:bg-brand-purple text-white text-xs.5 font-bold rounded-xl transition-all cursor-pointer"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Contact Message"
                message={`Are you sure you want to delete the feedback message from: ${messageToDelete?.senderName || "Anonymous"}? This action cannot be undone.`}
                onConfirm={executeDeleteMessage}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setMessageToDelete(null);
                }}
            />
        </div>
    );
}
