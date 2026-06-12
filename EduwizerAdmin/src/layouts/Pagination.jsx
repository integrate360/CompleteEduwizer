export default function Pagination({
    page,
    limit,
    total,
    totalPages,
    showingCount,
    itemLabel = "items",
    onPageChange,
    onLimitChange,
    loading = false,
}) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 mt-6 pt-4 gap-4">
            <div className="flex items-center gap-2.5 text-xs text-slate-500">
                <span>Showing {showingCount} of {total} {itemLabel}</span>
                <span className="text-slate-200">|</span>
                <div className="flex items-center gap-1.5">
                    <span>Per page:</span>
                    <select
                        value={limit}
                        onChange={(e) => {
                            onLimitChange(Number(e.target.value));
                        }}
                        className="border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none bg-slate-50 text-brand-navy focus:border-brand-gold font-semibold"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={page === 1 || loading}
                    className="p-2 text-brand-navy border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
                    title="First Page"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => onPageChange(Math.max(page - 1, 1))}
                    disabled={page === 1 || loading}
                    className="p-2 text-brand-navy border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
                    title="Previous Page"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <span className="text-xs font-semibold text-slate-700 px-2.5 min-w-[90px] text-center">
                    Page {page} of {totalPages || 1}
                </span>

                <button
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages || totalPages === 0 || loading}
                    className="p-2 text-brand-navy border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
                    title="Next Page"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={page === totalPages || totalPages === 0 || loading}
                    className="p-2 text-brand-navy border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
                    title="Last Page"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
