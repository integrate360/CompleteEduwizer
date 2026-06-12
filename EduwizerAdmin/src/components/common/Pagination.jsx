export default function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  limits = [5, 10, 20, 50],
}) {
  const safeTotalPages = totalPages || Math.max(1, Math.ceil((total || 0) / (limit || 1)));
  const canPrev = page > 1;
  const canNext = page < safeTotalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-4">
      <div className="text-xs text-slate-500">
        Page <span className="font-semibold text-brand-navy">{page}</span> of{" "}
        <span className="font-semibold text-brand-navy">{safeTotalPages}</span>
        {typeof total === "number" ? (
          <>
            {" "}
            · <span className="font-semibold text-brand-navy">{total}</span>{" "}
            total
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={limit}
          onChange={(e) => onLimitChange?.(Number(e.target.value))}
          className="h-9 px-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 bg-white text-brand-navy"
        >
          {limits.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange?.(page - 1)}
          className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-brand-navy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange?.(page + 1)}
          className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-brand-navy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

