export const Table = ({ columns, rows, emptyText = "Belum ada data" }) => (
    <div className="bg-white border border-slate-200 rounded shadow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">{emptyText}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row._id} className="hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2.5 text-slate-800">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );