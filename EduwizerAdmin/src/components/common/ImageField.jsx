import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { uploadResume } from "../../Services/api";

export default function ImageField({ value, onChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);

  const previewType = useMemo(() => {
    const url = (value || "").toLowerCase();
    if (!url) return "";
    if (url.startsWith("data:image/")) return "image";
    if (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".webp") || url.endsWith(".gif")) return "image";
    return "link";
  }, [value]);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("admin", "true");
      fd.append("file", file);
      const resp = await uploadResume(fd);
      const url = resp?.data?.data;
      if (!url) throw new Error(resp?.data?.message || "Upload failed");
      onChange?.(url);
      toast.success("Uploaded successfully.");
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-600">{label}</label>
        <p className="text-[11px] text-slate-400 font-light mt-0.5">Upload an image or paste a URL.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.gif,image/*"
          disabled={uploading}
          onChange={(e) => handleUpload(e.target.files?.[0])}
          className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-gold/20 file:text-amber-900 hover:file:bg-brand-gold/30 disabled:opacity-60"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="https://..."
          className="h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all w-full text-brand-navy bg-slate-50 focus:bg-white"
        />
      </div>

      {uploading ? (
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="w-4 h-4 border-2 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
          Uploading…
        </div>
      ) : null}

      {value ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-3">
          {previewType === "image" ? (
            <img src={value} alt="Preview" className="w-full max-h-64 object-contain rounded-xl bg-white" />
          ) : (
            <a href={value} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-navy underline break-all">
              {value}
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}

