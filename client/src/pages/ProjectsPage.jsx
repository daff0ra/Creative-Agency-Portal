import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const PROJECT_STATUS = { planning: "Perencanaan", in_progress: "Berjalan", in_review: "Review", completed: "Selesai", on_hold: "Ditunda" };
const TASK_STATUS = { backlog: "Backlog", in_progress: "Dikerjakan", in_review: "Review", done: "Selesai", blocked: "Terhambat" };
const dateLabel = (date) => date ? new Date(date).toLocaleDateString("id-ID") : "-";

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasksByProject, setTasksByProject] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat project");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => `${project.title} ${project.organization?.name || ""}`.toLowerCase().includes(query));
  }, [projects, search]);

  const loadTasks = async (projectId) => {
    if (tasksByProject[projectId]) return;
    try {
      const { data } = await api.get(`/project-tasks/project/${projectId}`);
      setTasksByProject((current) => ({ ...current, [projectId]: data }));
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat task project");
    }
  };

  return (
    <div className="max-w-6xl flex flex-col gap-5">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">Projects</h1>
        <p className="text-sm text-slate-500">Project lintas client dan progres task</p>
      </header>

      <input aria-label="Cari project" className="w-full max-w-sm rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Cari project atau client" value={search} onChange={(event) => setSearch(event.target.value)} />
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {loading ? <p className="text-sm text-slate-500">Memuat project...</p> : visibleProjects.length === 0 ? (
        <Card className="p-8 text-center text-sm text-slate-500">{projects.length ? "Tidak ada project yang cocok." : "Belum ada project."}</Card>
      ) : visibleProjects.map((project) => {
        const progress = project.taskCount ? Math.round(project.completedTaskCount / project.taskCount * 100) : 0;
        return (
          <Card key={project._id} className="p-4">
            <details onToggle={(event) => { if (event.currentTarget.open) loadTasks(project._id); }}>
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{project.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{project.organization?.name || "Client"} · Tenggat {dateLabel(project.dueDate)}</p>
                    <p className="mt-1 text-xs text-slate-500">Tim: {project.team.map((member) => member.name).join(", ") || "Belum ditentukan"}</p>
                  </div>
                  <Badge tone={project.status === "completed" ? "success" : "neutral"}>{PROJECT_STATUS[project.status] || project.status}</Badge>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500"><span>{project.completedTaskCount}/{project.taskCount} task selesai</span><span>{progress}%</span></div>
                  <div className="h-2 overflow-hidden rounded bg-slate-100"><div className="h-full bg-slate-800" style={{ width: `${progress}%` }} /></div>
                </div>
              </summary>
              <div className="mt-4 border-t border-slate-100 pt-3">
                {!tasksByProject[project._id] ? <p className="text-xs text-slate-500">Memuat task...</p> : tasksByProject[project._id].length === 0 ? <p className="text-xs text-slate-500">Belum ada task di project ini.</p> : (
                  <ul className="divide-y divide-slate-100">
                    {tasksByProject[project._id].map((task) => <li key={task._id} className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm text-slate-800">{task.title}</span>
                      <span className="text-xs text-slate-500">{task.assignees.map((member) => member.name).join(", ") || "Belum ditentukan"} · {TASK_STATUS[task.status] || task.status} · {dateLabel(task.dueDate)}</span>
                    </li>)}
                  </ul>
                )}
              </div>
            </details>
          </Card>
        );
      })}
    </div>
  );
};
