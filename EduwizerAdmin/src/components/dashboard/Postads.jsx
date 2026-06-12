import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createAd, deleteAd, getAdById, getAds, updateAd } from "../../Services/api";
import Modal from "../common/Modal";
import Pagination from "../common/Pagination";

const IconPencil = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const emptyForm = {
  targetAudience: "",
  link: "",
  isActive: true,
  imageFile: null,
  imageUrl: "",
};

export default function Postads() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);

  const fetchPage = async ({ page, limit } = pagination) => {
    setLoading(true);
    try {
      const resp = await getAds({ page, limit, search });
      const data = resp?.data;
      if (!data) throw new Error("Failed to load ads.");
      setItems(Array.isArray(data.data) ? data.data : []);
      if (data.pagination) setPagination((p) => ({ ...p, ...data.pagination }));
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Error loading ads.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchPage({ page: pagination.page, limit: pagination.limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, search]);

  const openAdd = () => {
    setEditingId("");
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    setEditingId(id);
    setModalOpen(true);
    setSaving(true);
    try {
      const resp = await getAdById(id);
      const row = resp?.data?.data;
      if (!row) throw new Error("Ad not found.");
      setForm({
        targetAudience: row.targetAudience || "",
        link: row.link || "",
        isActive: row.isActive !== false,
        imageFile: null,
        imageUrl: row.image || "",
      });
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load ad.");
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const onSave = async () => {
    if (!form.link) return toast.error("Link is required.");
    if (!editingId && !form.imageFile) return toast.error("Image is required for a new ad.");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("targetAudience", form.targetAudience || "");
      fd.append("link", form.link);
      fd.append("isActive", String(form.isActive));
      if (form.imageFile) fd.append("image", form.imageFile);

      if (editingId) {
        const resp = await updateAd(editingId, fd);
        toast.success(resp?.data?.message || "Ad updated successfully.");
      } else {
        const resp = await createAd(fd);
        toast.success(resp?.data?.message || "Ad created successfully.");
      }

      setModalOpen(false);
      await fetchPage({ page: pagination.page, limit: pagination.limit });
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    try {
      const resp = await deleteAd(id);
      toast.success(resp?.data?.message || "Ad deleted successfully.");
      await fetchPage({ page: pagination.page, limit: pagination.limit });
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Delete failed.");
    }
  };

  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-brand-navy">Advertisements</h2>
          <p className="text-xs text-slate-400 mt-1 font-light">Manage ads (banners) for the Eduwizer dashboard.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
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
          </form>
          <button onClick={openAdd} className="h-10 px-4 bg-brand-gold hover:bg-btn-gold-hover text-brand-navy font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-gold/15 whitespace-nowrap">
            Add New
          </button>
          <button
            type="button"
            onClick={() => fetchPage({ page: pagination.page, limit: pagination.limit })}
            disabled={loading}
            className="h-10 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Reload"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-72 gap-4">
          <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading…</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl h-72 flex items-center justify-center bg-slate-50/30">
          <p className="text-sm font-semibold text-slate-700">No ads found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ad</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Link</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50/40 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                        {row.image ? <img src={row.image} alt="" className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-brand-navy truncate">{row.targetAudience || "General"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a href={row.link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-navy underline break-all">
                      {row.link}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {row.isActive ? (
                      <span className="inline-flex items-center bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">Active</span>
                    ) : (
                      <span className="inline-flex items-center bg-slate-50 border border-slate-200 text-slate-600 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEdit(row._id)}
                        className="p-1.5 border border-slate-200 hover:border-brand-navy bg-slate-50 text-slate-600 hover:text-brand-navy hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="Edit Ad"
                      >
                        <IconPencil />
                      </button>
                      <button
                        onClick={() => onDelete(row._id)}
                        className="p-1.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-600 hover:text-red-500 hover:bg-red-50/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="Delete Ad"
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
      )}

      <Pagination
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        onLimitChange={(l) => setPagination((prev) => ({ ...prev, page: 1, limit: l }))}
      />

      <Modal open={modalOpen} title={editingId ? "Edit Ad" : "Create Ad"} description="Uploads the banner image and updates ad details." onClose={saving ? undefined : () => setModalOpen(false)}>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-600">Target Audience (optional)</label>
            <input value={form.targetAudience} onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))} className="mt-1 h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition w-full bg-slate-50 focus:bg-white text-brand-navy" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Link</label>
            <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://..." className="mt-1 h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition w-full bg-slate-50 focus:bg-white text-brand-navy" />
          </div>
          <div className="flex items-center gap-3">
            <input
              id="ad-active"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="ad-active" className="text-sm font-semibold text-slate-600">
              Active
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Image {editingId ? "(optional)" : ""}</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => setForm((f) => ({ ...f, imageFile: e.target.files?.[0] || null }))}
              className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-gold/20 file:text-amber-900 hover:file:bg-brand-gold/30"
            />
            {(form.imageFile || form.imageUrl) ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/40 p-3">
                <img
                  src={form.imageFile ? URL.createObjectURL(form.imageFile) : form.imageUrl}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-xl bg-white"
                />
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-brand-navy hover:bg-slate-50 disabled:opacity-60 transition">
              Cancel
            </button>
            <button type="button" onClick={onSave} disabled={saving} className="h-10 px-4 bg-brand-navy hover:bg-brand-purple text-white font-bold rounded-xl text-sm transition disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
