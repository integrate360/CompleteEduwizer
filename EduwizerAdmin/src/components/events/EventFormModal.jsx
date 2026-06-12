import Modal from "../common/Modal";
import ImageField from "../common/ImageField";
import RichTextEditor from "../common/RichTextEditor";
import { emptyEventForm } from "./eventFormUtils";

export default function EventFormModal({ open, saving, title, value, onChange, onClose, onSave }) {
  const form = value || emptyEventForm;

  return (
    <Modal open={open} title={title} description="Create or update an event." onClose={saving ? undefined : onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Title</label>
          <input
            value={form.title}
            onChange={(e) => onChange?.({ ...form, title: e.target.value })}
            className="mt-1 h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition w-full bg-slate-50 focus:bg-white text-brand-navy"
          />
        </div>
        <div className="md:col-span-2">
          <ImageField value={form.image} onChange={(url) => onChange?.({ ...form, image: url })} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600 block mb-2">Content</label>
          <RichTextEditor
            value={form.description}
            onChange={(val) => onChange?.({ ...form, description: val })}
            placeholder="Write the event content here..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <button type="button" onClick={onClose} disabled={saving} className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-brand-navy hover:bg-slate-50 disabled:opacity-60 transition">
          Cancel
        </button>
        <button type="button" onClick={onSave} disabled={saving} className="h-10 px-4 bg-brand-navy hover:bg-brand-purple text-white font-bold rounded-xl text-sm transition disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}
