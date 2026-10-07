import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/staff", label: "Tambah Staff" },
];

export const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 border-r border-slate-200 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Client Portal</h2>
        </div>
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `px-3 py-2 text-sm rounded ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              {item.label}
            </NavLink>
          ))}
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