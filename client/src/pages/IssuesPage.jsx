import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { MANAGERS } from "../constants/role.js";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const TYPES = { bug: "Bug", change_request: "Permintaan perubahan", question: "Pertanyaan" };
const SEVERITIES = { low: "Rendah", medium: "Sedang", high: "Tinggi", critical: "Kritis" };
const STATUSES = { open: "Terbuka", in_progress: "Dikerjakan", resolved: "Selesai", closed: "Ditutup" };
const dateLabel = (date) => new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const fieldClass = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500";

export const IssuesPage = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ severity: "", status: "" });
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ project: "", title: "", type: "bug", severity: "medium", stepsToReproduce: "", screenshotUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isClient = user?.userType === "client";
  const canConvert = MANAGERS.includes(user?.role);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const projectRequest = isClient
        ? api.get(`/projects/organization/${user.organization}`)
        : api.get("/projects");
      const [issueResponse, projectResponse] = await Promise.all([api.get("/issues"), projectRequest]);
      setIssues(issueResponse.data);
      setProjects(projectResponse.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat issue");
    } finally { setLoading(false); }
  }, [isClient, user?.organization]);
  useEffect(() => { loadData(); }, [loadData]);

  const visibleIssues = useMemo(() => issues.filter((issue) =>
    (!filters.severity || issue.severity === filters.severity) && (!filters.status || issue.status === filters.status)), [issues, filters]);

  const createIssue = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const { data } = await api.post("/issues", form);
      setIssues((current) => [data, ...current]); setSelected(data); setFormOpen(false);
      setForm({ project: "", title: "", type: "bug", severity: "medium", stepsToReproduce: "", screenshotUrl: "" });
    } catch (err) { setError(err.response?.data?.message || "Gagal melaporkan issue"); }
    finally { setSaving(false); }
  };

  const updateIssue = async (issue, changes) => {
    setSaving(true); setError("");
    try {
      const { data } = await api.patch(`/issues/${issue._id}`, changes);
      setIssues((current) => current.map((item) => item._id === data._id ? data : item)); setSelected(data);
    } catch (err) { setError(err.response?.data?.message || "Gagal memperbarui issue"); }
    finally { setSaving(false); }
  };
  const convertToTask = async (issue) => {
    setSaving(true); setError("");
    try {
      const { data } = await api.post(`/issues/${issue._id}/task`);
      setIssues((current) => current.map((item) => item._id === data._id ? data : item)); setSelected(data);
    } catch (err) { setError(err.response?.data?.message || "Gagal membuat task"); }
    finally { setSaving(false); }
  };

  return <div className="mx-auto flex max-w-6xl flex-col gap-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-400">Work overview</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Issues</h1><p className="mt-1 text-sm text-slate-500">Lacak laporan dan tindak lanjut dari setiap project.</p></div>
      <button onClick={() => setFormOpen(true)} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-700">+ Laporkan issue</button>
    </header>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[["Semua issue", issues.length], ["Terbuka", issues.filter((i) => i.status === "open").length], ["Kritis", issues.filter((i) => i.severity === "critical").length], ["Sudah jadi task", issues.filter((i) => i.task).length]].map(([label, value]) => <Card key={label} className="p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p></Card>)}</div>
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div><h2 className="text-sm font-semibold text-slate-900">Daftar issue</h2><p className="mt-0.5 text-xs text-slate-500">{visibleIssues.length} laporan</p></div><div className="flex gap-2"><select aria-label="Filter severity" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" value={filters.severity} onChange={(e) => setFilters({ ...filters, severity: e.target.value })}><option value="">Semua severity</option>{Object.entries(SEVERITIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><select aria-label="Filter status" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">Semua status</option>{Object.entries(STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div></div>
      {error && <p role="alert" className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading ? <p className="p-8 text-center text-sm text-slate-500">Memuat issue...</p> : visibleIssues.length === 0 ? <div className="p-12 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-xl">◉</div><p className="mt-3 text-sm font-medium text-slate-800">{issues.length ? "Tidak ada issue yang cocok" : "Belum ada issue"}</p><p className="mt-1 text-sm text-slate-500">Laporan baru akan muncul di sini.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Issue</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Tipe</th><th className="px-4 py-3">Severity</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Penanggung jawab</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleIssues.map((issue) => <tr key={issue._id} onClick={() => setSelected(issue)} className="cursor-pointer transition hover:bg-slate-50"><td className="px-4 py-4"><p className="max-w-xs truncate text-sm font-semibold text-slate-900">{issue.title}</p><p className="mt-1 text-xs text-slate-500">Dibuat {dateLabel(issue.createdAt)}</p></td><td className="px-4 py-4 text-sm text-slate-600">{issue.project?.title}</td><td className="px-4 py-4 text-sm text-slate-600">{TYPES[issue.type]}</td><td className="px-4 py-4"><Badge tone={issue.severity === "critical" || issue.severity === "high" ? "warning" : "neutral"}>{SEVERITIES[issue.severity]}</Badge></td><td className="px-4 py-4"><Badge tone={issue.status === "resolved" || issue.status === "closed" ? "success" : "neutral"}>{STATUSES[issue.status]}</Badge></td><td className="px-4 py-4 text-sm text-slate-600">{issue.assignee?.name || "Belum ditentukan"}</td></tr>)}</tbody></table></div>}
    </Card>

    {(selected || formOpen) && <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/30" onMouseDown={(e) => { if (e.target === e.currentTarget) { setSelected(null); setFormOpen(false); } }}>
      <section role="dialog" aria-modal="true" aria-label={formOpen ? "Laporkan issue" : "Detail issue"} className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{formOpen ? "Laporan baru" : `Issue · ${selected?._id.slice(-6).toUpperCase()}`}</p><h2 className="mt-1 text-lg font-semibold text-slate-900">{formOpen ? "Laporkan issue" : selected?.title}</h2></div><button aria-label="Tutup" onClick={() => { setSelected(null); setFormOpen(false); }} className="rounded-lg p-2 text-xl leading-none text-slate-400 hover:bg-slate-100">×</button></div>
        {formOpen ? <form onSubmit={createIssue} className="flex-1 space-y-5 overflow-y-auto p-6"><label className="block text-sm font-medium text-slate-700">Project<select required className={`${fieldClass} mt-1.5`} value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}><option value="">Pilih project</option>{projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Judul<input required minLength="3" className={`${fieldClass} mt-1.5`} placeholder="Contoh: Tombol checkout tidak merespons" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium text-slate-700">Tipe<select className={`${fieldClass} mt-1.5`} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label><label className="text-sm font-medium text-slate-700">Severity<select className={`${fieldClass} mt-1.5`} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>{Object.entries(SEVERITIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label></div><label className="block text-sm font-medium text-slate-700">Langkah reproduksi / detail<textarea rows="5" className={`${fieldClass} mt-1.5 resize-y`} placeholder="Jelaskan apa yang terjadi dan langkah untuk mengulanginya..." value={form.stepsToReproduce} onChange={(e) => setForm({ ...form, stepsToReproduce: e.target.value })} /></label><label className="block text-sm font-medium text-slate-700">Link screenshot <span className="font-normal text-slate-400">(opsional)</span><input type="url" className={`${fieldClass} mt-1.5`} placeholder="https://..." value={form.screenshotUrl} onChange={(e) => setForm({ ...form, screenshotUrl: e.target.value })} /></label><div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setFormOpen(false)} className="rounded-lg px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100">Batal</button><button disabled={saving || !projects.length} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">{saving ? "Mengirim..." : "Kirim laporan"}</button></div></form> : selected && <div className="flex-1 space-y-6 overflow-y-auto p-6"><div className="flex flex-wrap gap-2"><Badge>{TYPES[selected.type]}</Badge><Badge tone={selected.severity === "critical" || selected.severity === "high" ? "warning" : "neutral"}>{SEVERITIES[selected.severity]}</Badge>{selected.task && <Badge tone="success">Terhubung ke task</Badge>}</div><div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4"><div><p className="text-xs text-slate-500">Project</p><p className="mt-1 text-sm font-medium text-slate-800">{selected.project?.title}</p></div><div><p className="text-xs text-slate-500">Dilaporkan</p><p className="mt-1 text-sm font-medium text-slate-800">{dateLabel(selected.createdAt)}</p></div><div><p className="text-xs text-slate-500">Pelapor</p><p className="mt-1 text-sm font-medium text-slate-800">{selected.createdBy?.name || "Klien"}</p></div><div><p className="text-xs text-slate-500">Penanggung jawab</p><p className="mt-1 text-sm font-medium text-slate-800">{selected.assignee?.name || "Belum ditentukan"}</p></div></div><div><h3 className="text-sm font-semibold text-slate-900">Langkah reproduksi / detail</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{selected.stepsToReproduce || "Tidak ada detail tambahan."}</p></div>{selected.screenshotUrl && <div><h3 className="mb-2 text-sm font-semibold text-slate-900">Screenshot</h3><a href={selected.screenshotUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-slate-200"><img src={selected.screenshotUrl} alt="Screenshot issue" className="max-h-72 w-full object-contain bg-slate-50" /></a></div>}
          {selected.task && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-xs font-medium text-emerald-700">Task terkait</p><p className="mt-1 text-sm font-semibold text-emerald-900">{selected.task.title}</p></div>}
          {!isClient && <div className="space-y-3 border-t border-slate-100 pt-5"><label className="block text-sm font-medium text-slate-700">Status<select disabled={saving} className={`${fieldClass} mt-1.5`} value={selected.status} onChange={(e) => updateIssue(selected, { status: e.target.value })}>{Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Severity<select disabled={saving} className={`${fieldClass} mt-1.5`} value={selected.severity} onChange={(e) => updateIssue(selected, { severity: e.target.value })}>{Object.entries(SEVERITIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Penanggung jawab<select disabled={saving} className={`${fieldClass} mt-1.5`} value={selected.assignee?._id || ""} onChange={(e) => updateIssue(selected, { assignee: e.target.value || null })}><option value="">Belum ditentukan</option>{selected.project?.team?.map((person) => <option key={person._id} value={person._id}>{person.name}</option>)}</select></label></div>}
          {canConvert && !selected.task && <button disabled={saving} onClick={() => convertToTask(selected)} className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50">{saving ? "Memproses..." : "Jadikan task"}</button>}
        </div>}
      </section>
    </div>}
  </div>;
};
