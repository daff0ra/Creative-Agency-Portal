// client/src/pages/AddStaffPage.jsx
import { useState } from "react";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const ROLES = ["SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER", "STAFF"];

export const AddStaffPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await api.post("/auth/register", { ...form, userType: "agency" });
      setMessage({ type: "success", text: "Staff berhasil ditambahkan" });
      setForm({ name: "", email: "", password: "", role: "STAFF" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Gagal menambahkan staff" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-semibold text-slate-900 mb-1">Tambah Staff</h1>
      <p className="text-sm text-slate-500 mb-6">Buat akun baru untuk staff agency</p>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              className="px-3 py-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-slate-900"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>

          {message && <p className={`text-xs ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>}

          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
        </form>
      </Card>
    </div>
  );
};