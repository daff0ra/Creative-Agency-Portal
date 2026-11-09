import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { MANAGERS } from "../../constants/role.js";

const agencyRoles = [...MANAGERS, "STAFF"];
const linkClass = ({ isActive }) => `px-3 py-2 text-sm rounded ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`;

export const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 border-r border-slate-200 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Client Portal</h2>
        </div>

        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          {agencyRoles.includes(user.role) && <>
            <NavLink to="/feed" className={linkClass}>Feed</NavLink>
            <NavLink to="/discuss" className={linkClass}>Discuss</NavLink>
            <NavLink to="/reports" className={linkClass}>Report</NavLink>
            <NavLink to="/projects" className={linkClass}>Project</NavLink>
            <details className="group">
              <summary className="cursor-pointer list-none rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">Work Overview <span className="float-right">⌄</span></summary>
              <div className="ml-3 mt-1 flex flex-col gap-1">
                <NavLink to="/work-overview/tasks" className={linkClass}>Tasks</NavLink>
                <NavLink to="/work-overview/issues" className={linkClass}>Issues</NavLink>
                <NavLink to="/work-overview/milestones" className={linkClass}>Milestones</NavLink>
                <NavLink to="/work-overview/timesheets" className={linkClass}>Timesheets</NavLink>
              </div>
            </details>
            <NavLink to="/calendar" className={linkClass}>Calendar</NavLink>
          </>}
          {user.userType === "client" && <NavLink to="/work-overview/issues" className={linkClass}>Issues</NavLink>}
          {MANAGERS.includes(user.role) && <details className="group mt-2">
            <summary className="cursor-pointer list-none rounded px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 hover:bg-slate-100">Administrasi <span className="float-right">⌄</span></summary>
            <div className="ml-3 mt-1 flex flex-col gap-1">
              <NavLink to="/organizations" className={linkClass}>Client</NavLink>
              {["SUPER_ADMIN", "ADMIN"].includes(user.role) && <NavLink to="/staff" className={linkClass}>Tambah Staff</NavLink>}
            </div>
          </details>}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-2">{user?.name} · {user?.role}</p>
          <Button variant="secondary" className="w-full" onClick={logout}>Keluar</Button>
        </div>
      </aside>

      <main className="flex-1 p-8"><Outlet /></main>
    </div>
  );
};
