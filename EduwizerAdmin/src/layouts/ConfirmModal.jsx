export default function ConfirmModal({
    isOpen,
    title = "Confirm Action",
    message = "Are you sure you want to perform this action?",
    onConfirm,
    onCancel,
    confirmText = "Delete",
    cancelText = "Cancel",
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    {/* Warning/Danger Circle Icon */}
                    <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>

                    <h3 className="text-base font-bold text-brand-navy mb-2">
                        {title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 font-light leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs.5 transition-all cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs.5 transition-all cursor-pointer shadow-md shadow-red-500/10"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
