// client/src/pages/OrganizationFormPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const initialForm = { name: "", industry: "", website: "", ownerName: "", ownerEmail: "", ownerPassword: "" };

export const OrganizationFormPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // set("name") mengembalikan handler onChange khusus field "name".
  // [field] (computed key) = pakai ISI variabel field sebagai nama properti.
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/organizations", {
        name: form.name,
        industry: form.industry,
        website: form.website,
        owner: { name: form.ownerName, email: form.ownerEmail, password: form.ownerPassword },
      });
      navigate("/organizations");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-semibold text-slate-900 mb-1">Tambah Client</h1>
      <p className="text-sm text-slate-500 mb-6">Buat perusahaan client beserta akun owner-nya</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-900">Data Perusahaan</h2>
          <Input label="Nama Perusahaan" value={form.name} onChange={set("name")} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Industri" value={form.industry} onChange={set("industry")} />
            <Input label="Website" value={form.website} onChange={set("website")} />
          </div>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-900">Akun Owner</h2>
          <Input label="Nama" value={form.ownerName} onChange={set("ownerName")} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={form.ownerEmail} onChange={set("ownerEmail")} required />
            <Input label="Password" type="password" value={form.ownerPassword} onChange={set("ownerPassword")} required />
          </div>
        </Card>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/organizations")}>Batal</Button>
        </div>
      </form>
    </div>
  );
};