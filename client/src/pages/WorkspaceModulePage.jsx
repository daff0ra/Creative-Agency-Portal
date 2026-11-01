import { Card } from "../components/ui/Card";

export const WorkspaceModulePage = ({ title }) => (
  <div className="max-w-5xl flex flex-col gap-4">
    <header>
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500">Modul ini belum tersedia.</p>
    </header>
    <Card className="p-6 text-sm text-slate-600">Navigasi sudah disiapkan untuk pengembangan modul {title.toLowerCase()}.</Card>
  </div>
);
