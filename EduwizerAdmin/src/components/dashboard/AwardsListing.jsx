import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  addAwardsAndRecognition,
  deleteAwardsAndRecognition,
  getAwardsAndRecognitionById,
  getAwardsAndRecognitions,
  updateAwardsAndRecognition,
} from "../../Services/api";
import {
  getApiMessage,
  isSuccessValue,
  normalizePaginatedListResponse,
  normalizeSingleRecordResponse,
} from "../../Services/responseUtils";
import Modal from "../common/Modal";
import MediaField from "../common/MediaField";
import Pagination from "../../layouts/Pagination";
import ConfirmModal from "../../layouts/ConfirmModal";

const IconEye = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

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

const emptyForm = { title: "", url: "", fileType: "" };

export default function AwardsListing() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const openView = (row) => {
    setViewData(row);
    setViewOpen(true);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchPage = async ({ page, limit } = pagination) => {
    setLoading(true);
    try {
      const resp = await getAwardsAndRecognitions({ page, limit, search });
      const data = resp?.data;
      if (!isSuccessValue(data?.success)) throw new Error(getApiMessage(data, "Failed to load awards."));
      const normalized = normalizePaginatedListResponse(data);
      setItems(normalized.items);
      if (normalized.pagination) setPagination((p) => ({ ...p, ...normalized.pagination }));
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Error loading awards.");
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
      const resp = await getAwardsAndRecognitionById(id);
      const row = normalizeSingleRecordResponse(resp?.data);
      if (!row) throw new Error("Record not found.");
      setForm({ title: row.title || "", url: row.url || "", fileType: row.fileType || "" });
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load record.");
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const onSave = async () => {
    if (!form.title) return toast.error("Title is required.");
    if (!form.url) return toast.error("Please upload/select an image.");
    setSaving(true);
    try {
      if (editingId) {
        const resp = await updateAwardsAndRecognition({ ...form, awardsAndRecognitionId: editingId });
        if (!isSuccessValue(resp?.data?.success)) throw new Error(getApiMessage(resp?.data, "Update failed."));
        toast.success(getApiMessage(resp?.data, "Updated successfully."));
      } else {
        const resp = await addAwardsAndRecognition(form);
        if (!isSuccessValue(resp?.data?.success)) throw new Error(getApiMessage(resp?.data, "Create failed."));
        toast.success(getApiMessage(resp?.data, "Created successfully."));
      }
      setModalOpen(false);
      await fetchPage({ page: pagination.page, limit: pagination.limit });
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      const resp = await deleteAwardsAndRecognition({ awardsAndRecognitionId: itemToDelete });
      if (!isSuccessValue(resp?.data?.success)) throw new Error(getApiMessage(resp?.data, "Delete failed."));
      toast.success(getApiMessage(resp?.data, "Deleted successfully."));
      await fetchPage({ page: pagination.page, limit: pagination.limit });
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Delete failed.");
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-brand-navy">Awards</h2>
          <p className="text-xs text-slate-400 mt-1 font-light">Manage awards and recognitions displayed on the Eduwizer dashboard.</p>
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
          <p className="text-sm font-semibold text-slate-700">No records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Award</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50/40 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                        {(row.fileType || "").includes("image") ? (
                          <img src={row.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">IMG</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-brand-navy">{row.title}</div>
                    {/* URL display removed */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openView(row)}
                        className="p-1.5 border border-slate-200 hover:border-brand-navy bg-slate-50 text-slate-600 hover:text-brand-navy hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="View Details"
                      >
                        <IconEye />
                      </button>
                      <button
                        onClick={() => openEdit(row._id)}
                        className="p-1.5 border border-slate-200 hover:border-brand-navy bg-slate-50 text-slate-600 hover:text-brand-navy hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="Edit Record"
                      >
                        <IconPencil />
                      </button>
                      <button
                        onClick={() => onDelete(row._id)}
                        className="p-1.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-600 hover:text-red-500 hover:bg-red-50/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="Delete Record"
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
        showingCount={rows.length}
        itemLabel="awards"
        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        onLimitChange={(l) => setPagination((prev) => ({ ...prev, page: 1, limit: l }))}
        loading={loading}
      />

      {/* View Modal */}
      <Modal open={viewOpen} title="Award Details" onClose={() => setViewOpen(false)}>
        <div className="space-y-5">
          <div className="text-sm font-semibold text-brand-navy mb-2">{viewData?.title}</div>
          <MediaField
            valueUrl={viewData?.url || ""}
            valueFileType={viewData?.fileType || ""}
            label="Award Image"
            disabled
          />
        </div>
      </Modal>

      {/* Edit/Add Modal */}
      <Modal open={modalOpen} title={editingId ? "Edit Award" : "Add Award"} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600">Title</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1 h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition w-full bg-slate-50 focus:bg-white text-brand-navy" />
          </div>
          <div>
            <MediaField
              valueUrl={form.url}
              valueFileType={form.fileType}
              onChange={({ url, fileType }) => setForm((f) => ({ ...f, url, fileType }))}
              label="Award Image"
              accept=".png,.jpg,.jpeg"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-brand-navy hover:bg-slate-50 disabled:opacity-60 transition">
            Cancel
          </button>
          <button type="button" onClick={onSave} disabled={saving} className="h-10 px-4 bg-brand-navy hover:bg-brand-purple text-white font-bold rounded-xl text-sm transition disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Award"
        message="Are you sure you want to delete this award? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}
