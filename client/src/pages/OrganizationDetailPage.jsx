import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { MANAGERS } from "../constants/role.js";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Table } from "../components/ui/Table";
import { ORG_STATUS, PROJECT_STATUS } from "../constants/status"

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("id-ID") : "-");

const TASK_STATUS = {
  backlog: "Backlog",
  in_progress: "Dikerjakan",
  in_review: "Review",
  done: "Selesai",
  blocked: "Terhambat",
};

const TASK_PRIORITY = { low: "Rendah", medium: "Normal", high: "Tinggi", urgent: "Mendesak" };

const projectColumns = [
  { key: "title", header: "Project", render: (r) => <span className="font-medium">{r.title}</span> },
  {
    key: "status",
    header: "Status",
    render: (r) => <Badge tone={PROJECT_STATUS[r.status].tone}>{PROJECT_STATUS[r.status].label}</Badge>,
  },
  { key: "team", header: "Tim", render: (r) => r.team.map((m) => m.name).join(", ") || "-" },
  { key: "dueDate", header: "Tenggat", render: (r) => formatDate(r.dueDate) },
];

const emptyProject = { title: "", description: "", startDate: "", dueDate: "" };

const Info = ({ label, value }) => (
  <div>
    <dt className="text-xs text-slate-500">{label}</dt>
    <dd className="text-sm text-slate-900 mt-0.5">{value || "-"}</dd>
  </div>
);

const ProjectTaskList = ({ project, tasks, canManage, userId, onCreate, onStatusChange }) => {
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", dueDate: "", assignee: "", acceptanceCriteria: "", clientVisible: false });
  const [showForm, setShowForm] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const acceptanceCriteria = form.acceptanceCriteria.split("\n").map((line) => line.trim()).filter(Boolean);
    try {
      await onCreate(project._id, {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate,
        assignees: form.assignee ? [form.assignee] : [],
        acceptanceCriteria,
        clientVisible: form.clientVisible,
      });
      setForm({ title: "", description: "", priority: "medium", dueDate: "", assignee: "", acceptanceCriteria: "", clientVisible: false });
      setShowForm(false);
    } catch {
      // Parent shows the API error and keeps the form values for correction.
    }
  };

  return (
    <Card className="mt-3">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Task project</h3>
          <p className="text-xs text-slate-500">{tasks.length} task · {tasks.filter((task) => task.status === "done").length} selesai</p>
        </div>
        {canManage && <Button variant="secondary" onClick={() => setShowForm(!showForm)}>{showForm ? "Tutup" : "Tambah task"}</Button>}
      </div>

      {showForm && (
        <form onSubmit={submit} className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-2">
          <Input label="Judul task" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} minLength={2} required />
          <Input label="Tenggat" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <Input label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">Prioritas
            <select className="rounded border border-slate-300 px-3 py-2 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {Object.entries(TASK_PRIORITY).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">Assignee
            <select className="rounded border border-slate-300 px-3 py-2 text-sm" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}>
              <option value="">Belum ditentukan</option>
              {project.team.map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 md:col-span-2">Acceptance criteria <span className="font-normal text-slate-500">Satu kriteria per baris</span>
            <textarea className="rounded border border-slate-300 px-3 py-2 text-sm" rows={3} value={form.acceptanceCriteria} onChange={(e) => setForm({ ...form, acceptanceCriteria: e.target.value })} placeholder="Contoh: Client dapat melihat status task" />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
            <input type="checkbox" checked={form.clientVisible} onChange={(e) => setForm({ ...form, clientVisible: e.target.checked })} />
            Tampilkan task ini di portal client
          </label>
          <div><Button type="submit">Simpan task</Button></div>
        </form>
      )}

      {tasks.length === 0 ? <p className="px-4 py-5 text-sm text-slate-500">Belum ada task project.</p> : (
        <ul className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <li key={task._id} className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{task.title}</p>
                {task.description && <p className="mt-0.5 text-sm text-slate-500">{task.description}</p>}
                <p className="mt-1 text-xs text-slate-500">Prioritas {TASK_PRIORITY[task.priority]} · Assignee {task.assignees.map((member) => member.name).join(", ") || "Belum ditentukan"} · Tenggat {formatDate(task.dueDate)}</p>
                {task.acceptanceCriteria.length > 0 && <ul className="mt-2 list-inside list-disc text-xs text-slate-600">{task.acceptanceCriteria.map((criterion, index) => <li key={`${task._id}-${index}`}>{criterion}</li>)}</ul>}
              </div>
              {(canManage || task.assignees.some((member) => member._id === userId)) && (
                <label className="shrink-0 text-xs text-slate-500">Status
                  <select className="ml-2 rounded border border-slate-300 px-2 py-1 text-xs text-slate-800" value={task.status} onChange={(e) => onStatusChange(task._id, e.target.value)}>
                    {Object.entries(TASK_STATUS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              )}
              {!canManage && !task.assignees.some((member) => member._id === userId) && <Badge tone={task.status === "done" ? "success" : "warning"}>{TASK_STATUS[task.status]}</Badge>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export const OrganizationDetailPage = ({orgId }) => {
  const params = useParams();
  const id  = orgId || params.id; // nilai :id dari URL /organizations/:id
  const { user } = useAuth();
  const canManage = MANAGERS.includes(user.role); // tombol tambah hanya untuk agency manager

  const [org, setOrg] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newTask, setNewTask] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const setProject = (field) => (e) => setProjectForm({ ...projectForm, [field]: e.target.value });

  // Promise.all menjalankan 3 request bersamaan, bukan satu per satu, jadi halaman lebih cepat.
  // useCallback menjaga load tetap fungsi yang sama antar render selama id tidak berubah,
  // supaya bisa dipakai di useEffect sekaligus dipanggil ulang setelah tiap aksi.
  const load = useCallback(async () => {
    try {
      setError("");
      const [orgRes, projectRes, taskRes] = await Promise.all([
        api.get(`/organizations/${id}`),
        api.get(`/projects/organization/${id}`),
        api.get(`/onboardingTask/organization/${id}`),
      ]);
      setOrg(orgRes.data);
      setProjects(projectRes.data);
      const projectTaskResults = await Promise.all(projectRes.data.map(async (project) => {
        const response = await api.get(`/project-tasks/project/${project._id}`);
        return [project._id, response.data];
      }));
      setProjectTasks(Object.fromEntries(projectTaskResults));
      setTasks(taskRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleComplete = async (taskId) => {
    try {
      await api.patch(`/onboardingTask/${taskId}/complete`);
      load(); // ambil ulang supaya progress dan status organisasi ikut diperbarui
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui task");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await api.post("/onboardingTask", { organization: id, title: newTask, order: tasks.length + 1 });
      setNewTask("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambah task");
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", { ...projectForm, organization: id });
      setProjectForm(emptyProject);
      setShowProjectForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambah project");
    }
  };

  const handleCreateProjectTask = async (projectId, body) => {
    try {
      await api.post(`/project-tasks/project/${projectId}`, body);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat task project");
      throw err;
    }
  };

  const handleProjectTaskStatus = async (taskId, status) => {
    try {
      await api.patch(`/project-tasks/${taskId}/status`, { status });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui status task");
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Memuat...</p>;
  if (!org) return <p className="text-sm text-red-600">{error || "Client tidak ditemukan"}</p>;

  const done = tasks.filter((t) => t.isCompleted).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const orgStatus = ORG_STATUS[org.onboardingStatus];

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div>
        {canManage && (
          <Link to="/organizations" className="text-xs text-slate-500 hover:text-slate-900">
            ← Kembali ke daftar client
          </Link>
        )}
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-lg font-semibold text-slate-900">{org.name}</h1>
          <Badge tone={orgStatus.tone}>{orgStatus.label}</Badge>
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <Card className="p-4">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Info label="Industri" value={org.industry} />
          <Info label="Website" value={org.website} />
          <Info label="Owner" value={org.owner && `${org.owner.name} (${org.owner.email})`} />
          <Info label="Account Manager" value={org.accountManager?.name} />
        </dl>
      </Card>

      <Card>
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Checklist Onboarding</h2>
            <span className="text-xs text-slate-500">{done} dari {tasks.length} selesai</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded mt-2">
            <div className="h-1.5 bg-slate-900 rounded" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {tasks.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-500 text-center">Belum ada task onboarding</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <li key={task._id} className="flex items-center gap-3 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  disabled={task.isCompleted}
                  onChange={() => handleComplete(task._id)}
                  className="h-4 w-4 accent-slate-900"
                />
                <span className={`text-sm ${task.isCompleted ? "text-slate-400 line-through" : "text-slate-800"}`}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        )}

        {canManage && (
          <form onSubmit={handleAddTask} className="flex gap-2 px-4 py-3 border-t border-slate-200">
            <div className="flex-1">
              <Input placeholder="Judul task baru" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
            </div>
            <Button type="submit">Tambah</Button>
          </form>
        )}
      </Card>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Project</h2>
          {canManage && (
            <Button variant="secondary" onClick={() => setShowProjectForm(!showProjectForm)}>
              {showProjectForm ? "Tutup" : "Tambah Project"}
            </Button>
          )}
        </div>

        {showProjectForm && (
          <Card className="p-4 mb-4">
            <form onSubmit={handleAddProject} className="flex flex-col gap-4">
              <Input label="Judul Project" value={projectForm.title} onChange={setProject("title")} required />
              <Input label="Deskripsi" value={projectForm.description} onChange={setProject("description")} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Tanggal Mulai" type="date" value={projectForm.startDate} onChange={setProject("startDate")} />
                <Input label="Tenggat" type="date" value={projectForm.dueDate} onChange={setProject("dueDate")} />
              </div>
              <div>
                <Button type="submit">Simpan Project</Button>
              </div>
            </form>
          </Card>
        )}

        {projects.length === 0 ? <Table columns={projectColumns} rows={projects} emptyText="Belum ada project" /> : (
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <div key={project._id}>
                <Table columns={projectColumns} rows={[project]} />
                <ProjectTaskList
                  project={project}
                  tasks={projectTasks[project._id] || []}
                  canManage={canManage}
                  userId={user.id}
                  onCreate={handleCreateProjectTask}
                  onStatusChange={handleProjectTaskStatus}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
