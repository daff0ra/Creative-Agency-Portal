import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { Table } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const STATUS = {
  invited: { label: "Diundang", tone: "neutral" },
  in_progress: { label: "Berjalan", tone: "warning" },
  completed: { label: "Selesai", tone: "success" },
};

const columns = [
//   { key: "name", header: "Perusahaan", render: (r) => <span className="font-medium">{r.name}</span> },
//     { key: "name", header: "Perusahaan",
//         render: (r) => (
//         <Link to={`/organizations/${r._id}`} className="font-medium text-slate-900 hover:underline">{r.name}</Link>
//     ),
//   },
    { key: "name",header: "Perusahaan",
        render: (r) => ( <Link to={`/organizations/${r._id}`} className="inline-block font-medium text-slate-900 hover:underline">
            {r.name}
        </Link>
        ),
    },
    { key: "industry", header: "Industri", render: (r) => r.industry || "-" },
    { key: "owner", header: "Owner", render: (r) => (r.owner ? `${r.owner.name} (${r.owner.email})` : "-") },
    { key: "accountManager", header: "Account Manager", render: (r) => r.accountManager?.name || "-" },
    { key: "onboardingStatus", header: "Onboarding",
        render: (r) => <Badge tone={STATUS[r.onboardingStatus].tone}>{STATUS[r.onboardingStatus].label}</Badge>,
    },
];

export const OrganizationsPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // [] = jalan sekali saat halaman pertama dibuka: ambil data dari server
  useEffect(() => {
    api
      .get("/organizations")
      .then(({ data }) => setRows(data))
      .catch((err) => setError(err.response?.data?.message || "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Client</h1>
          <p className="text-sm text-slate-500">Daftar perusahaan client dan status onboarding</p>
        </div>
        <Button onClick={() => navigate("/organizations/new")}>Tambah Client</Button>
      </div>

      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}
      {loading ? <p className="text-sm text-slate-500">Memuat...</p> : <Table columns={columns} rows={rows} />}
    </div>
  );
};