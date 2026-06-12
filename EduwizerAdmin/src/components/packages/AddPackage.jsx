import { useState } from "react";
import toast from "react-hot-toast";
import { createPackage } from "../../Services/api";

const userTypes = [
  { value: "candidate", label: "Candidate" },
  { value: "counsellor", label: "Counsellor" },
  { value: "vendor", label: "Vendor" },
  { value: "institute", label: "Institute" },
];

export default function AddPackage() {
  const [form, setForm] = useState({
    user: "candidate",
    months: "",
    prize: "",
    specialPrize: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.months || !form.prize || !form.specialPrize) {
      return toast.error("All fields are required.");
    }

    setSubmitting(true);
    try {
      const payload = {
        user: form.user,
        months: Number(form.months),
        prize: form.prize,
        specialPrize: form.specialPrize,
      };
      
      const resp = await createPackage(payload);
      if (resp.status === 201 || resp.status === 200) {
        toast.success("Package created successfully!");
        setForm({
          user: "candidate",
          months: "",
          prize: "",
          specialPrize: "",
        });
      } else {
        throw new Error(resp.data?.error || "Failed to create package.");
      }
    } catch (e) {
      toast.error(e.response?.data?.error || e.message || "Failed to create package.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h2 className="text-2xl font-semibold text-brand-navy">Add Package</h2>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Create subscription plans for different user types.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            User Type
          </label>
          <select
            value={form.user}
            onChange={(e) => setForm({ ...form, user: e.target.value })}
            className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all text-sm text-brand-navy bg-slate-50 focus:bg-white font-medium"
          >
            {userTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Months
          </label>
          <input
            type="number"
            min="1"
            value={form.months}
            onChange={(e) => setForm({ ...form, months: e.target.value })}
            placeholder="e.g. 12"
            className="w-full h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all text-brand-navy bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Price
          </label>
          <input
            type="text"
            value={form.prize}
            onChange={(e) => setForm({ ...form, prize: e.target.value })}
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
            value={form.specialPrize}
            onChange={(e) => setForm({ ...form, specialPrize: e.target.value })}
            placeholder="e.g. 299"
            className="w-full h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all text-brand-navy bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 bg-brand-gold hover:bg-btn-gold-hover text-brand-navy font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-gold/15 cursor-pointer disabled:opacity-50 flex items-center justify-center"
          >
            {submitting ? "Creating..." : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
