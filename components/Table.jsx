export default function Table({ columns = [], data = [] }) {
  return (
    <table className="min-w-full border border-gray-300 rounded">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="text-left px-3 py-2 border-b">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="text-center py-4 text-gray-400">
              No data available
            </td>
          </tr>
        )}
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50 border-b">
            {columns.map((col) => (
              <td key={col} className="px-3 py-2">{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
