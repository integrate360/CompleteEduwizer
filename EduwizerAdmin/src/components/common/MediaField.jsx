import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { uploadResume } from "../../Services/api";

function isLikelyYoutube(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes("youtube.com") || lower.includes("youtu.be");
}

function parseYoutubeUrl(input) {
  if (!input) return "";
  const trimmed = input.trim();

  // 1. If it's an iframe tag, extract the src attribute
  if (trimmed.toLowerCase().startsWith("<iframe") && trimmed.includes("src=")) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return parseYoutubeUrl(match[1]); // Clean up the extracted URL recursively
    }
  }

  // 2. Standard watch URL: youtube.com/watch?v=ID
  if (trimmed.includes("youtube.com/watch")) {
    try {
      const url = new URL(trimmed);
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      // fallback
    }
  }

  // 3. Short URL: youtu.be/ID
  if (trimmed.includes("youtu.be/")) {
    try {
      const url = new URL(trimmed);
      // Remove leading slash if any
      const videoId = url.pathname.replace(/^\//, "");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      // fallback
    }
  }

  return trimmed;
}

export default function MediaField({
  valueUrl,
  valueFileType,
  onChange,
  accept = ".png,.jpg,.jpeg,video/*",
  label = "Media",
  disabled = false,
}) {
  const [mode, setMode] = useState(() =>
    valueFileType === "youtube" || isLikelyYoutube(valueUrl) ? "youtube" : "upload"
  );
  const [uploading, setUploading] = useState(false);

  // Local states to preserve data when toggling tabs
  const [uploadedMedia, setUploadedMedia] = useState({ url: "", fileType: "" });
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Keep local states and mode in sync when parent props change (e.g. on modal open/edit load)
  useEffect(() => {
    // If the new parent prop matches either of our local states, it was a change
    // triggered by ourselves (our onChange callbacks). We should NOT reset the states.
    if (valueUrl === youtubeUrl || valueUrl === uploadedMedia.url) {
      return;
    }

    const isYoutube = valueFileType === "youtube" || isLikelyYoutube(valueUrl);
    setMode(isYoutube ? "youtube" : "upload");

    if (valueUrl) {
      if (isYoutube) {
        setYoutubeUrl(valueUrl);
      } else {
        setUploadedMedia({ url: valueUrl, fileType: valueFileType || "" });
      }
    } else {
      setUploadedMedia({ url: "", fileType: "" });
      setYoutubeUrl("");
    }
  }, [valueUrl, valueFileType, youtubeUrl, uploadedMedia.url]);

  const previewType = useMemo(() => {
    if (!valueUrl) return "";
    if (mode === "youtube" && (valueFileType === "youtube" || isLikelyYoutube(valueUrl))) {
      return "youtube";
    }
    if (mode === "upload") {
      if ((valueFileType || "").includes("image")) return "image";
      if ((valueFileType || "").includes("video")) return "video";
    }
    return "link";
  }, [mode, valueUrl, valueFileType]);

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
      
      const newMedia = { url, fileType: file.type };
      setUploadedMedia(newMedia);
      onChange?.(newMedia);
      toast.success("Uploaded successfully.");
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600">{label}</label>
          <p className="text-[11px] text-slate-400 font-light mt-0.5">
            Upload a file (image/video) or use a YouTube embed URL.
          </p>
        </div>
        {!disabled && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("upload");
                onChange?.({ url: uploadedMedia.url, fileType: uploadedMedia.fileType });
              }}
              className={`h-9 px-3 rounded-xl text-xs font-semibold border transition ${
                mode === "upload"
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-white text-brand-navy border-slate-200 hover:bg-slate-50"
              }`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("youtube");
                onChange?.({ url: youtubeUrl, fileType: "youtube" });
              }}
              className={`h-9 px-3 rounded-xl text-xs font-semibold border transition ${
                mode === "youtube"
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-white text-brand-navy border-slate-200 hover:bg-slate-50"
              }`}
            >
              YouTube
            </button>
          </div>
        )}
      </div>

      {mode === "upload" ? (
        <div className="flex flex-col gap-3">
          {!disabled && (
            <input
              type="file"
              accept={accept}
              disabled={uploading}
              onChange={(e) => handleUpload(e.target.files?.[0])}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-gold/20 file:text-amber-900 hover:file:bg-brand-gold/30 disabled:opacity-60"
            />
          )}
          {uploading ? (
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="w-4 h-4 border-2 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
              Uploading…
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={youtubeUrl}
            disabled={disabled}
            onChange={(e) => {
              const parsedVal = parseYoutubeUrl(e.target.value);
              setYoutubeUrl(parsedVal);
              onChange?.({ url: parsedVal, fileType: "youtube" });
            }}
            placeholder="Paste YouTube URL or Embed Code"
            className="h-10 px-4 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all w-full text-brand-navy bg-slate-50 focus:bg-white"
          />
          <p className="text-[11px] text-slate-400 font-light">
            You can paste an iframe embed code, a youtube.com watch link, or a youtu.be link.
          </p>
        </div>
      )}

      {valueUrl ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-3">
          {previewType === "image" ? (
            <img src={valueUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-xl bg-white" />
          ) : previewType === "video" ? (
            <video src={valueUrl} controls className="w-full max-h-64 rounded-xl bg-black" />
          ) : previewType === "youtube" ? (
            <iframe
              src={valueUrl}
              title="YouTube preview"
              className="w-full h-56 rounded-xl bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <a
              href={valueUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-brand-navy underline break-all"
            >
              {valueUrl}
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}
