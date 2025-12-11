import { useState } from "react";
import { uploadExcel } from "../lib/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please choose an Excel file!");
    const r = await uploadExcel(file);
    setRes(r.data);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📤 Upload Payroll Excel</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".xlsx" />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded mt-3">
        Upload
      </button>

      {res && (
        <div className="bg-green-100 rounded p-4 mt-4">
          <p>✅ {res.status}</p>
          <p>Sheet: {res.sheet}</p>
          <p>Rows inserted: {res.rows_inserted}</p>
        </div>
      )}
    </div>
  );
}
