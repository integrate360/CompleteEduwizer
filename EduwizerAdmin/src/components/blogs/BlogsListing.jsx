import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { addBlog, deleteBlog, getBlogById, getBlogs, updateBlog } from "../../Services/api";
import { getApiMessage, isSuccessValue } from "../../Services/responseUtils";
import BlogFormModal from "./BlogFormModal";
import { getEmptyBlogForm } from "./blogFormUtils";
import ConfirmModal from "../../layouts/ConfirmModal";
import Pagination from "../../layouts/Pagination";
import Modal from "../common/Modal";

function formatDate(value) {
  if (!value) return "";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
  } catch {
    return String(value);
  }
}

export default function BlogsListing() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(getEmptyBlogForm());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: "", title: "" });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const IconEye = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const fetchAll = async () => {
    setLoading(true);
    try {
      const resp = await getBlogs();
      const data = resp?.data;
      if (!isSuccessValue(data?.success)) throw new Error(getApiMessage(data, "Failed to load blogs."));
      const rows = Array.isArray(data?.data) ? data.data : [];
      setItems(rows);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Error loading blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const rows = Array.isArray(items) ? items : [];
    const q = (query || "").trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const title = (r.title || "").toLowerCase();
      const author = (r.author || "").toLowerCase();
      return title.includes(q) || author.includes(q);
    });
  }, [items, query]);

  const pageData = useMemo(() => {
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * limit;
    const end = start + limit;
    return { total, totalPages, page: safePage, rows: filtered.slice(start, end) };
  }, [filtered, limit, page]);

  const openAdd = () => {
    setEditingId("");
    setForm(getEmptyBlogForm());
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    setEditingId(id);
    setModalOpen(true);
    setSaving(true);
    try {
      const resp = await getBlogById(id);
      const data = resp?.data;
      if (!isSuccessValue(data?.success)) throw new Error(getApiMessage(data, "Failed to load blog."));
      const row = unwrapSingle(data);
      if (!row) throw new Error("Record not found.");
      setForm({
        title: row.title || "",
        description: row.description || row.data || "",
        author: row.author || "",
        image: row.image || "",
        data: row.data || "",
      });
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load record.");
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const openDetails = async (row) => {
    const id = row?._id;
    if (!id) return;
    setDetailsOpen(true);
    setSaving(true);
    try {
      const resp = await getBlogById(id);
      const data = resp?.data;
      if (!isSuccessValue(data?.success)) throw new Error(getApiMessage(data, "Failed to load blog."));
      const full = unwrapSingle(data) || row;
      setSelectedBlog(full);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load blog details.");
      setDetailsOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const onSave = async () => {
    if (!form.title || !form.description || !form.author || !form.image) {
      return toast.error("Title, content, author, and image are required.");
    }

    setSaving(true);
    try {
      const payload = { ...form, data: form.description };
      if (editingId) {
        const resp = await updateBlog({ ...payload, blogId: editingId });
        if (!isSuccessValue(resp?.data?.success)) throw new Error(getApiMessage(resp?.data, "Update failed."));
        toast.success(getApiMessage(resp?.data, "Updated successfully."));
      } else {
        const resp = await addBlog(payload);
        if (!isSuccessValue(resp?.data?.success)) throw new Error(getApiMessage(resp?.data, "Create failed."));
        toast.success(getApiMessage(resp?.data, "Created successfully."));
      }
      setModalOpen(false);
      await fetchAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const onRequestDelete = (row) => {
    setDeleteTarget({ id: row?._id || "", title: row?.title || "" });
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    const id = deleteTarget.id;
    if (!id) return;
    try {
      const resp = await deleteBlog({ blogId: id });
      if (!isSuccessValue(resp?.data?.success)) throw new Error(getApiMessage(resp?.data, "Delete failed."));
      toast.success(getApiMessage(resp?.data, "Deleted successfully."));
      await fetchAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Delete failed.");
    } finally {
      setConfirmOpen(false);
      setDeleteTarget({ id: "", title: "" });
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm flex flex-col relative">
      <div className="flex flex-col border-b border-slate-100 pb-5 mb-5 gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-brand-navy">Blogs</h2>
            <p className="text-xs text-slate-400 mt-1 font-light">Review, search, and manage blogs shown on the user website.</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search title or author..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="h-10 pl-4 pr-8 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all w-full sm:w-64 text-brand-navy bg-slate-50 focus:bg-white"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy font-bold text-xs"
                >
                  ✕
                </button>
              ) : null}
            </div>

            <button
              type="button"
              onClick={openAdd}
              className="h-10 px-4 bg-brand-gold hover:bg-btn-gold-hover text-brand-navy font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-gold/15 cursor-pointer flex items-center justify-center gap-2"
            >
              Add Blog
            </button>

            <button
              type="button"
              onClick={fetchAll}
              disabled={loading}
              className="h-10 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              title="Reload"
            >
              <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading blogs from server...</p>
        </div>
      ) : pageData.rows.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl h-96 flex flex-col items-center justify-center bg-slate-50/30 gap-3 text-slate-400">
          <svg className="w-10 h-10 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm font-semibold text-slate-700">No blogs found</p>
          <p className="text-xs text-slate-400 font-light">Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div className="overflow-x-auto scrollbar-none border border-slate-100 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-100 bg-white">
              <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Blog</th>
                <th className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Author</th>
                <th className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Status</th>
                <th className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Created</th>
                <th className="px-6 py-4.5 text-left text-xs font-bold text-brand-navy uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 bg-white">
              {pageData.rows.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50/20 transition-all">
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      {row.image ? <img src={row.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white" /> : null}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-brand-navy truncate">{row.title}</div>
                        {row.description ? (
                          <div className="text-xs text-slate-400 font-light max-h-16 overflow-y-auto">
                            {row.description.length > 150 ? `${row.description.slice(0, 150)}...` : row.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="text-xs text-slate-600 font-semibold">{row.author || "-"}</span>
                  </td>
                  <td className="px-6 py-4.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        row.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {row.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="text-xs text-slate-600 font-semibold">{formatDate(row.createdTimestamp)}</span>
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetails(row)}
                        className="p-1.5 border border-slate-200 hover:border-brand-navy bg-slate-50 text-slate-600 hover:text-brand-navy hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="View Blog Details"
                      >
                        <IconEye />
                      </button>
                      <button
                        onClick={() => openEdit(row._id)}
                        className="p-1.5 border border-slate-200 hover:border-brand-navy bg-slate-50 text-slate-600 hover:text-brand-navy hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="Edit Blog"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.862 4.487" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onRequestDelete(row)}
                        className="p-1.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-600 hover:text-red-500 hover:bg-red-50/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="Delete Blog"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={pageData.page}
          limit={limit}
          total={pageData.total}
          totalPages={pageData.totalPages}
          showingCount={pageData.rows.length}
          itemLabel="blogs"
          loading={loading}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
        </div>
      )}

      <BlogFormModal
        open={modalOpen}
        saving={saving}
        title={editingId ? "Edit Blog" : "Add Blog"}
        value={form}
        onChange={setForm}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Blog"
        message={deleteTarget.title ? `Delete “${deleteTarget.title}”? This cannot be undone.` : "Delete this blog? This cannot be undone."}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          if (saving) return;
          setConfirmOpen(false);
          setDeleteTarget({ id: "", title: "" });
        }}
        onConfirm={onConfirmDelete}
      />

      <Modal
        open={detailsOpen}
        title="Blog Details"
        description="View full blog information."
        onClose={saving ? undefined : () => setDetailsOpen(false)}
      >
        {selectedBlog ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="text-xs font-semibold text-slate-600">Title</div>
                <div className="mt-1 text-sm font-semibold text-brand-navy">{selectedBlog.title || "-"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600">Author</div>
                <div className="mt-1 text-sm text-slate-700">{selectedBlog.author || "-"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600">Status</div>
                <div className="mt-1 text-sm text-slate-700">{selectedBlog.isActive ? "Active" : "Inactive"}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs font-semibold text-slate-600">Content</div>
                <div className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{selectedBlog.description || selectedBlog.data || "-"}</div>
              </div>
              {selectedBlog.image ? (
                <div className="md:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">Image</div>
                  <img src={selectedBlog.image} alt="" className="mt-2 w-full max-h-72 object-contain rounded-2xl border border-slate-200 bg-white" />
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-brand-navy hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-slate-500">{saving ? "Loading..." : "No data."}</div>
        )}
      </Modal>
    </div>
  );
}
  const unwrapSingle = (apiData) => {
    const raw = apiData?.data;
    if (Array.isArray(raw)) return raw[0] || null;
    if (raw && typeof raw === "object") return raw;
    return null;
  };
