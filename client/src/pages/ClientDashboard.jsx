// client/src/pages/ClientDashboard.jsx
import { useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useOrganizationData } from "../hooks/useOrganizationData";
import { ORG_STATUS, PROJECT_STATUS } from "../constants/status";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Icon } from "../components/ui/icon.jsx";
import { ProgressRing } from "../components/ui/ProgressRing";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";

const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000); // 86400000 ms = 1 hari

const Hero = ({ userName, org, percent, nextTask, hasTasks, onComplete }) => (
  <section className="bg-slate-900 text-white rounded p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
    <div className="flex-1 min-w-0">
      <p className="text-sm text-white/60">Selamat datang, {userName}</p>
      <div className="flex flex-wrap items-center gap-3 mt-1">
        <h1 className="text-2xl font-semibold tracking-tight">{org.name}</h1>
        <span className="px-2 py-0.5 text-xs font-medium border border-white/30 rounded text-white/90">
          {ORG_STATUS[org.onboardingStatus].label}
        </span>
      </div>
      <p className="text-sm text-white/60 mt-2">Pantau progres onboarding dan project Anda di sini.</p>

      <div className="mt-5 flex items-center justify-between gap-4 rounded border border-white/15 bg-white/10 px-4 py-3">
        {nextTask ? (
          <>
            <div className="min-w-0">
              <p className="text-xs text-white/60">Langkah berikutnya</p>
              <p className="text-sm font-medium truncate">{nextTask.title}</p>
            </div>
            <Button variant="inverse" className="shrink-0" onClick={() => onComplete(nextTask._id)}>
              Tandai selesai
            </Button>
          </>
        ) : (
          <p className="text-sm text-white/80">
            {hasTasks ? "Seluruh tahapan onboarding telah selesai." : "Tim agency sedang menyiapkan tahapan onboarding Anda."}
          </p>
        )}
      </div>
    </div>

    <div className="self-center text-white">
      <ProgressRing percent={percent} trackClass="text-white/20" barClass="text-white" />
      <p className="text-center text-xs text-white/60 mt-2">Progres onboarding</p>
    </div>
  </section>
);

const StatCard = ({ icon, label, value }) => (
  <Card className="p-4 flex items-center gap-4">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-700">
      <Icon name={icon} />
    </span>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900 leading-tight">{value}</p>
    </div>
  </Card>
);

const Stepper = ({ tasks, onComplete }) => {
  const currentId = tasks.find((t) => !t.isCompleted)?._id; // task pertama yang belum selesai = langkah aktif

  return (
    <ol>
      {tasks.map((task, i) => {
        const isDone = task.isCompleted;
        const isCurrent = task._id === currentId;
        const isLast = i === tasks.length - 1;

        const circleStyle = isDone
          ? "bg-slate-900 border-slate-900 text-white"
          : isCurrent
          ? "bg-white border-slate-900 text-slate-900 ring-4 ring-slate-100"
          : "bg-white border-slate-300 text-slate-400";

        return (
          <li key={task._id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* garis penghubung antar langkah, tidak ditampilkan di langkah terakhir */}
            {!isLast && <span className="absolute left-3.5 top-8 bottom-0 w-px bg-slate-200" />}

            <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${circleStyle}`}>
              {isDone ? <Icon name="check" className="h-4 w-4" /> : i + 1}
            </span>

            <div className="flex-1 min-w-0 pt-0.5">
              <p className={`text-sm font-medium ${isDone ? "text-slate-500" : "text-slate-900"}`}>{task.title}</p>
              {task.description && <p className="text-sm text-slate-500 mt-0.5">{task.description}</p>}
              {isDone && <p className="text-xs text-slate-400 mt-1">Selesai pada {formatDate(task.completedAt)}</p>}
              {isCurrent && (
                <div className="mt-3">
                  <Button onClick={() => onComplete(task._id)}>Tandai selesai</Button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

const ProjectCard = ({ project }) => {
  const status = PROJECT_STATUS[project.status];
  const left = project.dueDate && project.status !== "completed" ? daysLeft(project.dueDate) : null;

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{project.title}</h3>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      <p className="text-sm text-slate-500 truncate">{project.description || "Tidak ada deskripsi"}</p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex -space-x-2">
          {project.team.map((m) => (
            <span key={m._id} className="rounded-full ring-2 ring-white">
              <Avatar name={m.name} size="sm" />
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Icon name="calendar" className="h-4 w-4" />
          <span>{formatDate(project.dueDate)}</span>
          {left !== null && (
            <span className={`font-medium ${left < 0 ? "text-red-600" : "text-slate-700"}`}>
              · {left < 0 ? `Terlambat ${-left} hari` : left === 0 ? "Hari ini" : `${left} hari lagi`}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

const AccountManagerCard = ({ manager }) => (
  <Card className="p-4">
    <h2 className="text-sm font-semibold text-slate-900 mb-4">Account Manager</h2>
    {manager ? (
      <div className="flex items-center gap-3">
        <Avatar name={manager.name} size="lg" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">{manager.name}</p>
          <a href={`mailto:${manager.email}`}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900">
            <Icon name="mail" className="h-4 w-4 shrink-0" />
            <span className="truncate">{manager.email}</span>
          </a>
        </div>
      </div>
    ) : (
      <p className="text-sm text-slate-500">Belum ada account manager yang ditugaskan.</p>
    )}
  </Card>
);

const CompanyCard = ({ org }) => (
  <Card className="p-4">
    <h2 className="text-sm font-semibold text-slate-900 mb-4">Informasi Perusahaan</h2>
    <dl className="flex flex-col gap-3">
      <div>
        <dt className="text-xs text-slate-500">Industri</dt>
        <dd className="text-sm text-slate-900">{org.industry || "-"}</dd>
      </div>
      <div>
        <dt className="text-xs text-slate-500">Website</dt>
        <dd className="text-sm text-slate-900">{org.website || "-"}</dd>
      </div>
      <div>
        <dt className="text-xs text-slate-500">Owner</dt>
        <dd className="text-sm text-slate-900">{org.owner?.name || "-"}</dd>
      </div>
    </dl>
  </Card>
);

export const ClientDashboard = () => {
  const { user } = useAuth();
  const { org, projects, tasks, loading, error, reload } = useOrganizationData(user.organization);
  const [actionError, setActionError] = useState("");

  const handleComplete = async (taskId) => {
    try {
      await api.patch(`/onboardingTask/${taskId}/complete`);
      setActionError("");
      await reload(); // ambil ulang supaya progres, status, dan langkah berikutnya ikut berubah
    } catch (err) {
      setActionError(err.response?.data?.message || "Gagal memperbarui tahapan");
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Memuat...</p>;
  if (!org) return <p className="text-sm text-red-600">{error || "Akun Anda belum terhubung ke organisasi"}</p>;

  const done = tasks.filter((t) => t.isCompleted).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const nextTask = tasks.find((t) => !t.isCompleted);
  const activeProjects = projects.filter((p) => ["in_progress", "in_review"].includes(p.status)).length;
  const nearest = projects
    .filter((p) => p.dueDate && p.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      <Hero
        userName={user.name.split(" ")[0]}
        org={org}
        percent={percent}
        nextTask={nextTask}
        hasTasks={tasks.length > 0}
        onComplete={handleComplete}
      />

      {actionError && <p className="text-xs text-red-600">{actionError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="list" label="Tahapan selesai" value={`${done} dari ${tasks.length}`} />
        <StatCard icon="folder" label="Project aktif" value={activeProjects} />
        <StatCard icon="calendar" label="Tenggat terdekat" value={nearest ? formatDate(nearest.dueDate) : "-"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-5">Tahapan Onboarding</h2>
            {tasks.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada tahapan onboarding.</p>
            ) : (
              <Stepper tasks={tasks} onComplete={handleComplete} />
            )}
          </Card>

          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Project Anda</h2>
            {projects.length === 0 ? (
              <Card className="p-6 text-center text-sm text-slate-500">Belum ada project</Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <AccountManagerCard manager={org.accountManager} />
          <CompanyCard org={org} />
        </div>
      </div>
    </div>
  );
};