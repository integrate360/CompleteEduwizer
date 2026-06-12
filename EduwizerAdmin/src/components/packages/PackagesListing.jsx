import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPackagesByUser, updatePackage, deletePackage } from "../../Services/api";
import Modal from "../common/Modal";
import ConfirmModal from "../../layouts/ConfirmModal";

export default function PackagesListing({ userType, title }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ prize: "", specialPrize: "" });
  const [saving, setSaving] = useState(false);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const resp = await getPackagesByUser(userType);
      setPackages(Array.isArray(resp.data) ? resp.data : []);
    } catch (e) {
      if (e.response?.status === 404) {
        setPackages([]);
      } else {
        toast.error(e.response?.data?.error || e.message || "Failed to load packages.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditForm({
      prize: item.Price || item.prize || "",
      specialPrize: item.specialPrice || item.specialPrize || "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.prize || !editForm.specialPrize) {
      return toast.error("All fields are required.");
    }
    setSaving(true);
    try {
      const resp = await updatePackage(editItem._id, {
        prize: editForm.prize,
        specialPrize: editForm.specialPrize,
      });
      if (resp.status === 200) {
        toast.success("Package updated successfully!");
        setEditOpen(false);
        fetchPackages();
      }
    } catch (e) {
      toast.error(e.response?.data?.error || e.message || "Failed to update package.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const resp = await deletePackage(deleteId);
      if (resp.status === 200) {
        toast.success("Package deleted successfully!");
        fetchPackages();
      }
    } catch (e) {
      toast.error(e.response?.data?.error || e.message || "Failed to delete package.");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-brand-navy">{title}</h2>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Manage packages and subscription pricing for {userType}s.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchPackages}
          disabled={loading}
          className="h-10 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer flex items-center justify-center"
          title="Reload"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-72 gap-4">
          <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading packages…</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl h-72 flex flex-col items-center justify-center bg-slate-50/30 gap-3 text-slate-400">
          <p className="text-sm font-semibold text-slate-700">No packages found</p>
          <p className="text-xs text-slate-400 font-light">Add packages through the Add Package page to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Months</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Special Price</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {packages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-slate-50/40 transition">
                  <td className="px-6 py-4 font-semibold text-brand-navy">{pkg.months} Months</td>
                  <td className="px-6 py-4 text-slate-650">₹{pkg.Price || pkg.prize}</td>
                  <td className="px-6 py-4 text-emerald-650 font-medium">₹{pkg.specialPrice || pkg.specialPrize}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(pkg)}
                        className="p-1.5 border border-slate-200 hover:border-brand-navy bg-slate-50 text-slate-600 hover:text-brand-navy hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="Edit Package"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(pkg._id)}
                        className="p-1.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-600 hover:text-red-500 hover:bg-red-50/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="Delete Package"
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
      )}

      {/* Edit Modal */}
      <Modal
        open={editOpen}
        title="Edit Package"
        description="Update subscription plan pricing."
        onClose={saving ? undefined : () => setEditOpen(false)}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Months
            </label>
            <input
              type="text"
              value={editItem ? `${editItem.months} Months` : ""}
              disabled
              className="w-full h-10 px-4 text-sm border border-slate-200 rounded-xl bg-slate-100 outline-none text-slate-400 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Price
            </label>
            <input
              type="text"
              value={editForm.prize}
              onChange={(e) => setEditForm({ ...editForm, prize: e.target.value })}
              placeholder="e.g. 499"
              className="w-full h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all text-brand-navy bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Special Price
            </label>
            <input
              type="text"
              value={editForm.specialPrize}
              onChange={(e) => setEditForm({ ...editForm, specialPrize: e.target.value })}
              placeholder="e.g. 299"
              className="w-full h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all text-brand-navy bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              disabled={saving}
              className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-brand-navy hover:bg-slate-50 disabled:opacity-60 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={saving}
              className="h-10 px-4 bg-brand-gold hover:bg-btn-gold-hover text-brand-navy font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-gold/15 cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete Package"
        message="Are you sure you want to delete this package? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
