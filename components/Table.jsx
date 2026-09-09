export default function Table({ columns = [], data = [] }) {
  return (
    <table className="min-w-full border border-brass-400/15 rounded text-sm">
      <thead className="bg-ink-900/60 text-slate-400 uppercase text-xs tracking-wide">
        <tr>
          {columns.map((col) => (
            <th key={col} className="text-left px-3 py-2 font-medium">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="text-center py-4 text-slate-500">
              No data available
            </td>
          </tr>
        )}
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-brass-400/[0.06] border-t border-white/5 text-slate-300">
            {columns.map((col) => (
              <td key={col} className="px-3 py-2">{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
