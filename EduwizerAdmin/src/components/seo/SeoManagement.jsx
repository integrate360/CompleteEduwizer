import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getSeoSettings,
  getBlogsForSeo,
  getEventsForSeo,
  saveSeo,
  deleteSeo,
} from "../../Services/api";

/* Fixed marketing pages whose SEO can be overridden. */
const STATIC_PAGES = [
  { key: "home", label: "Home", path: "/home" },
  { key: "about-us", label: "About Us", path: "/about-us" },
  { key: "events-blogs", label: "Events & Blogs", path: "/events-blogs" },
  { key: "contact-us", label: "Contact Us", path: "/contact-us" },
];

const TITLE_MAX = 60;
const DESC_MAX = 160;

function CharCount({ value, max }) {
  const len = (value || "").length;
  const over = len > max;
  return (
    <span className={`text-xs ${over ? "text-red-600" : "text-gray-400"}`}>
      {len}/{max}
      {over ? " — too long for search snippets" : ""}
    </span>
  );
}

function SeoRow({ pageKey, label, path, initial, onSaved }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    ogImage: initial?.ogImage || "",
    keywords: initial?.keywords || "",
  });
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const hasOverride = Boolean(
    initial && (initial.title || initial.description || initial.ogImage || initial.keywords)
  );

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await saveSeo({ pageKey, ...form });
      toast.success(`Saved SEO for ${label}`);
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const clear = async () => {
    setSaving(true);
    try {
      await deleteSeo(pageKey);
      setForm({ title: "", description: "", ogImage: "", keywords: "" });
      toast.success(`Reset ${label} to default`);
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <div className="font-medium text-gray-800">{label}</div>
          <div className="text-xs text-gray-400">{path}</div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              hasOverride
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {hasOverride ? "Custom" : "Default"}
          </span>
          <span className="text-gray-400">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">Page Title</label>
              <CharCount value={form.title} max={TITLE_MAX} />
            </div>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={form.title}
              onChange={set("title")}
              placeholder="Leave blank to use the built-in default"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">Meta Description</label>
              <CharCount value={form.description} max={DESC_MAX} />
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              rows={2}
              value={form.description}
              onChange={set("description")}
              placeholder="The snippet shown under your link in Google results"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Social Share Image URL (OG image)
              </label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={form.ogImage}
                onChange={set("ogImage")}
                placeholder="https://eduwizer.com/…"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Focus Keywords <span className="text-gray-400 font-normal">(internal note)</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={form.keywords}
                onChange={set("keywords")}
                placeholder="teacher recruitment, school staffing"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="px-4 py-2 bg-blue-900 text-white text-sm rounded-md disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {hasOverride && (
              <button
                type="button"
                onClick={clear}
                disabled={saving}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md disabled:opacity-50"
              >
                Reset to default
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeoManagement() {
  const [overrides, setOverrides] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [seo, bl, ev] = await Promise.all([
        getSeoSettings(),
        getBlogsForSeo().catch(() => ({ data: { data: [] } })),
        getEventsForSeo().catch(() => ({ data: { data: [] } })),
      ]);
      setOverrides(seo.data.data || {});
      setBlogs(bl.data.data || []);
      setEvents(ev.data.data || []);
    } catch {
      toast.error("Could not load SEO settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading SEO settings…</div>;
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">SEO Manager</h1>
      <p className="text-sm text-gray-500 mb-6">
        Override the search title, description and social image per page. Blank fields fall back
        to the site's built-in defaults. Your sitemap updates automatically as you publish blogs
        and events.
      </p>

      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
        Main Pages
      </h2>
      <div className="space-y-3 mb-8">
        {STATIC_PAGES.map((p) => (
          <SeoRow
            key={p.key}
            pageKey={p.key}
            label={p.label}
            path={p.path}
            initial={overrides[p.key]}
            onSaved={load}
          />
        ))}
      </div>

      {blogs.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Blogs
          </h2>
          <div className="space-y-3 mb-8">
            {blogs.map((b) => (
              <SeoRow
                key={b._id}
                pageKey={`blog:${b._id}`}
                label={b.title}
                path={`/blogs-details/${b._id}`}
                initial={overrides[`blog:${b._id}`]}
                onSaved={load}
              />
            ))}
          </div>
        </>
      )}

      {events.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Events
          </h2>
          <div className="space-y-3">
            {events.map((e) => (
              <SeoRow
                key={e._id}
                pageKey={`event:${e._id}`}
                label={e.title}
                path={`/events-details/${e._id}`}
                initial={overrides[`event:${e._id}`]}
                onSaved={load}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
