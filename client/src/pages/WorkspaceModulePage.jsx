import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const taskStatuses = { backlog: "Backlog", in_progress: "Dikerjakan", in_review: "Review", done: "Selesai", blocked: "Terhambat" };
const projectStatuses = { planning: "Perencanaan", in_progress: "Berjalan", in_review: "Review", completed: "Selesai", on_hold: "Ditunda" };
const dateLabel = (date) => date ? new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Tanpa tenggat";
const localKey = (name) => `agency-portal:${name}`;

export const WorkspaceModulePage = ({ title }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem(localKey("discuss")) || "[]"));
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem(localKey("timesheets")) || "[]"));
  const [entry, setEntry] = useState({ task: "", hours: "", note: "" });

  useEffect(() => {
    let active = true;
    Promise.all([api.get("/project-tasks"), api.get("/projects")])
      .then(([taskResponse, projectResponse]) => {
        if (!active) return;
        setTasks(taskResponse.data);
        setProjects(projectResponse.data);
      })
      .catch((err) => { if (active) setError(err.response?.data?.message || `Gagal memuat data ${title.toLowerCase()}`); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [title]);

  const upcoming = useMemo(() => [...tasks].sort((a, b) => new Date(a.dueDate || "9999") - new Date(b.dueDate || "9999")), [tasks]);
  const addNote = (event) => {
    event.preventDefault();
    if (!note.trim()) return;
    const next = [{ id: Date.now(), text: note.trim(), createdAt: new Date().toISOString() }, ...notes];
    setNotes(next); localStorage.setItem(localKey("discuss"), JSON.stringify(next)); setNote(""); setMessage("Pesan tersimpan di perangkat ini.");
  };
  const addEntry = (event) => {
    event.preventDefault();
    if (!entry.task || Number(entry.hours) <= 0) return;
    const next = [{ id: Date.now(), ...entry, hours: Number(entry.hours), date: new Date().toISOString() }, ...entries];
    setEntries(next); localStorage.setItem(localKey("timesheets"), JSON.stringify(next)); setEntry({ task: "", hours: "", note: "" }); setMessage("Catatan waktu berhasil ditambahkan.");
  };
  const header = <header><h1 className="text-lg font-semibold text-slate-900">{title}</h1><p className="text-sm text-slate-500">Ringkasan kerja tim dan pembaruan terbaru</p></header>;

  if (loading) return <div className="max-w-5xl flex flex-col gap-5">{header}<p className="text-sm text-slate-500">Memuat data...</p></div>;
  const errorNotice = error && <p role="alert" className="text-sm text-red-600">{error}</p>;
  const empty = (text) => <Card className="p-6 text-sm text-slate-500">{text}</Card>;

  return <div className="max-w-5xl flex flex-col gap-5">{header}{errorNotice}{message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
    {title === "Feed" && (tasks.length ? <Card><ul className="divide-y divide-slate-100">{[...tasks].sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,30).map((task) => <li key={task._id} className="flex items-center justify-between gap-4 p-4"><div><p className="text-sm font-medium text-slate-900">{task.title}</p><p className="mt-1 text-xs text-slate-500">{task.project?.title || "Project"} · {task.assignees?.map((person) => person.name).join(", ") || "Belum ditugaskan"} · Diperbarui {dateLabel(task.updatedAt)}</p></div><Badge tone={task.status === "done" ? "success" : "neutral"}>{taskStatuses[task.status] || task.status}</Badge></li>)}</ul></Card> : empty("Belum ada pembaruan task."))}
    {title === "Discuss" && <><Card className="p-4"><form onSubmit={addNote} className="flex flex-col gap-3"><label htmlFor="discussion" className="text-sm font-medium text-slate-700">Bagikan pembaruan dengan tim</label><textarea id="discussion" className="min-h-24 rounded border border-slate-300 p-3 text-sm" placeholder="Tulis catatan atau pembaruan..." value={note} onChange={(event) => setNote(event.target.value)} /><button className="self-start rounded bg-slate-900 px-4 py-2 text-sm text-white">Kirim pesan</button></form></Card>{notes.length ? <Card><ul className="divide-y divide-slate-100">{notes.map((item) => <li key={item.id} className="p-4"><p className="whitespace-pre-wrap text-sm text-slate-800">{item.text}</p><p className="mt-2 text-xs text-slate-500">{dateLabel(item.createdAt)}</p></li>)}</ul></Card> : empty("Belum ada pesan. Mulai diskusi dengan tim.")}</>}
    {title === "Report" && <><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[["Total task", tasks.length],["Selesai", tasks.filter((task) => task.status === "done").length],["Terhambat", tasks.filter((task) => task.status === "blocked").length],["Project aktif", projects.filter((project) => project.status === "in_progress").length]].map(([label, value]) => <Card className="p-4" key={label}><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p></Card>)}</div><Card><h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold">Progres per project</h2><ul className="divide-y divide-slate-100">{projects.map((project) => <li key={project._id} className="p-4"><div className="flex justify-between gap-3 text-sm"><span>{project.title}</span><span className="text-slate-500">{project.completedTaskCount}/{project.taskCount} task</span></div><div className="mt-2 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-slate-800" style={{ width: `${project.taskCount ? Math.round(project.completedTaskCount / project.taskCount * 100) : 0}%` }} /></div></li>)}</ul></Card></>}
    {title === "Issues" && (tasks.filter((task) => task.status === "blocked" || task.priority === "urgent").length ? <Card><ul className="divide-y divide-slate-100">{tasks.filter((task) => task.status === "blocked" || task.priority === "urgent").map((task) => <li key={task._id} className="flex items-center justify-between gap-3 p-4"><div><p className="text-sm font-medium">{task.title}</p><p className="text-xs text-slate-500">{task.project?.title} · {task.assignees?.map((person) => person.name).join(", ") || "Belum ditugaskan"}</p></div><Badge tone="warning">{task.status === "blocked" ? "Terhambat" : "Mendesak"}</Badge></li>)}</ul></Card> : empty("Tidak ada isu terbuka. Task berprioritas mendesak dan terhambat akan muncul di sini."))}
    {title === "Milestones" && (projects.length ? <Card><ul className="divide-y divide-slate-100">{[...projects].sort((a,b) => new Date(a.dueDate || "9999") - new Date(b.dueDate || "9999")).map((project) => <li key={project._id} className="flex items-center justify-between gap-3 p-4"><div><Link to={`/projects#${project._id}`} className="text-sm font-medium text-slate-900 hover:underline">{project.title}</Link><p className="mt-1 text-xs text-slate-500">{project.organization?.name || "Client"} · Tenggat {dateLabel(project.dueDate)}</p></div><Badge tone={project.status === "completed" ? "success" : "neutral"}>{projectStatuses[project.status] || project.status}</Badge></li>)}</ul></Card> : empty("Belum ada project untuk dijadikan milestone."))}
    {title === "Calendar" && (upcoming.length ? <Card><ul className="divide-y divide-slate-100">{upcoming.map((task) => <li key={task._id} className="flex items-center gap-4 p-4"><div className="min-w-24 text-xs font-semibold text-slate-700">{dateLabel(task.dueDate)}</div><div className="flex-1"><p className="text-sm font-medium">{task.title}</p><p className="text-xs text-slate-500">{task.project?.title || "Project"} · {task.assignees?.map((person) => person.name).join(", ") || "Belum ditugaskan"}</p></div><Badge tone={task.status === "done" ? "success" : "neutral"}>{taskStatuses[task.status] || task.status}</Badge></li>)}</ul></Card> : empty("Belum ada jadwal task."))}
    {title === "Timesheets" && <><Card className="p-4"><form onSubmit={addEntry} className="grid gap-3 md:grid-cols-4"><label className="text-xs text-slate-600">Task<select required className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm" value={entry.task} onChange={(event) => setEntry({ ...entry, task: event.target.value })}><option value="">Pilih task</option>{tasks.map((task) => <option key={task._id} value={task._id}>{task.title}</option>)}</select></label><label className="text-xs text-slate-600">Jam<input required min="0.25" step="0.25" type="number" className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm" value={entry.hours} onChange={(event) => setEntry({ ...entry, hours: event.target.value })} /></label><label className="text-xs text-slate-600 md:col-span-2">Catatan<input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Pekerjaan yang dilakukan" value={entry.note} onChange={(event) => setEntry({ ...entry, note: event.target.value })} /></label><button className="rounded bg-slate-900 px-4 py-2 text-sm text-white md:col-span-4 md:justify-self-start">Catat waktu</button></form></Card>{entries.length ? <Card><ul className="divide-y divide-slate-100">{entries.map((item) => <li key={item.id} className="flex justify-between gap-3 p-4"><div><p className="text-sm font-medium">{tasks.find((task) => task._id === item.task)?.title || "Task"}</p><p className="text-xs text-slate-500">{item.note || "Tanpa catatan"} · {dateLabel(item.date)}</p></div><span className="text-sm font-semibold">{item.hours} jam</span></li>)}</ul></Card> : empty("Belum ada catatan waktu.")}</>}
  </div>;
};
