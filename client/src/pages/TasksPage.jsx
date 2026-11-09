import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { MANAGERS } from "../constants/role.js";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Link } from "react-router-dom";

const STATUS = {
  backlog: "Backlog",
  in_progress: "Dikerjakan",
  in_review: "Review",
  done: "Selesai",
  blocked: "Terhambat",
};
const PRIORITY = { low: "Rendah", medium: "Normal", high: "Tinggi", urgent: "Mendesak" };
const dateLabel = (date) => date ? new Date(date).toLocaleDateString("id-ID") : "-";

export const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      const { data } = await api.get("/project-tasks");
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat daftar task");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const visibleTasks = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return tasks.filter((task) => {
      const searchable = `${task.title} ${task.project?.title || ""} ${task.project?.organization?.name || ""}`.toLowerCase();
      return (!query || searchable.includes(query)) &&
        (!filters.status || task.status === filters.status) &&
        (!filters.priority || task.priority === filters.priority);
    });
  }, [tasks, filters]);

  const projectGroups = useMemo(() => {
    const groups = new Map();
    visibleTasks.forEach((task) => {
      const projectId = task.project?._id;
      const key = projectId || "unlinked";
      if (!groups.has(key)) groups.set(key, {
        id: projectId,
        title: task.project?.title || "Project tidak tersedia",
        client: task.project?.organization?.name || "Client tidak tersedia",
        tasks: [],
      });
      groups.get(key).tasks.push(task);
    });
    return [...groups.values()];
  }, [visibleTasks]);

  const updateStatus = async (taskId, status) => {
    setSavingId(taskId);
    try {
      await api.patch(`/project-tasks/${taskId}/status`, { status });
      setTasks((current) => current.map((task) => task._id === taskId ? { ...task, status } : task));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui status task");
    } finally {
      setSavingId("");
    }
  };

  const canManage = MANAGERS.includes(user.role);

  return (
    <div className="max-w-6xl flex flex-col gap-5">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">Tasks</h1>
        <p className="text-sm text-slate-500">Task dikelompokkan berdasarkan project</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <input aria-label="Cari task" className="min-w-48 rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Cari task, project, client" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select aria-label="Filter status" className="rounded border border-slate-300 px-3 py-2 text-sm" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">Semua status</option>{Object.entries(STATUS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <select aria-label="Filter prioritas" className="rounded border border-slate-300 px-3 py-2 text-sm" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">Semua prioritas</option>{Object.entries(PRIORITY).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {loading ? <p className="text-sm text-slate-500">Memuat task...</p> : visibleTasks.length === 0 ? (
        <Card className="p-8 text-center text-sm text-slate-500">{tasks.length ? "Tidak ada task yang cocok dengan filter." : "Belum ada task yang ditugaskan."}</Card>
      ) : projectGroups.map((group) => (
        <Card key={group.id || "unlinked"}>
          <div className="border-b border-slate-100 px-4 py-3">
            {group.id ? <Link className="text-sm font-semibold text-slate-900 hover:underline" to={`/projects#${group.id}`}>{group.title}</Link> : <h2 className="text-sm font-semibold text-slate-900">{group.title}</h2>}
            <p className="mt-0.5 text-xs text-slate-500">{group.client} · {group.tasks.length} task</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {group.tasks.map((task) => {
              const canUpdate = canManage || task.assignees.some((assignee) => assignee._id === user.id);
              return (
                <li key={task._id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{task.project?.title || "Project"} · {task.project?.organization?.name || "Client"}</p>
                    <p className="mt-1 text-xs text-slate-500">{task.assignees.map((assignee) => assignee.name).join(", ") || "Belum ditentukan"} · Tenggat {dateLabel(task.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={task.priority === "urgent" || task.priority === "high" ? "warning" : "neutral"}>{PRIORITY[task.priority]}</Badge>
                    {canUpdate ? (
                      <select aria-label={`Status ${task.title}`} disabled={savingId === task._id} className="rounded border border-slate-300 px-2 py-1.5 text-xs" value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}>
                        {Object.entries(STATUS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                      </select>
                    ) : <Badge tone={task.status === "done" ? "success" : "neutral"}>{STATUS[task.status]}</Badge>}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
    </div>
  );
};
