import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { OrganizationDetailPage } from "./OrganizationDetailPage";
import { ORG_STATUS, PROJECT_STATUS } from "../constants/status";
import { ClientDashboard } from "./ClientDashboard";

const Stat = ({ label, value }) => (
  <Card className="p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-2xl font-semibold text-slate-900 mt-1">
      {value}
    </p>
  </Card>
);

const Breakdown = ({ title, statusMap, counts = {} }) => (
  <Card>
    <h2 className="px-4 py-3 border-b border-slate-200 text-sm font-semibold text-slate-900">
      {title}
    </h2>
    <ul className="divide-y divide-slate-100">
      {Object.entries(statusMap).map(([key, { label }]) => (
        <li
          key={key}
          className="flex justify-between px-4 py-2.5 text-sm"
        >
          <span className="text-slate-600">{label}</span>
          <span className="font-medium text-slate-900">
            {counts?.[key] || 0}
          </span>
        </li>
      ))}
    </ul>
  </Card>
);

const AgencyDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then(({ data }) => {
        setSummary(data);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Gagal memuat ringkasan"
        );
      });
  }, []);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!summary) {
    return <p className="text-sm text-slate-500">Memuat...</p>;
  }

  const organizations = summary.organizations ?? {};
  const projects = summary.projects ?? {};

  const totalClients = Object.values(organizations).reduce(
    (total, count) => total + (Number(count) || 0),
    0
  );

  const activeProjects =
    (projects.in_progress || 0) +
    (projects.in_review || 0);

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Ringkasan seluruh client dan project
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Client" value={totalClients} />
        <Stat
          label="Onboarding Berjalan"
          value={organizations.in_progress || 0}
        />
        <Stat label="Project Aktif" value={activeProjects} />
        <Stat
          label="Task Belum Selesai"
          value={summary.pendingTasks ?? 0}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Breakdown
          title="Client per Status Onboarding"
          statusMap={ORG_STATUS}
          counts={organizations}
        />
        <Breakdown
          title="Project per Status"
          statusMap={PROJECT_STATUS}
          counts={projects}
        />
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-sm text-slate-500">Memuat...</p>;
  }

  if (user.userType === "client") return <ClientDashboard />;
  return <AgencyDashboard />;
};