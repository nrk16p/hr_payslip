import { useState } from "react";
import { getSalary, updateSalary } from "../lib/api";

export default function SalaryData() {
  const [params, setParams] = useState({ emp_id: "", "month-year": "" });
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    const res = await getSalary(params);
    setData(res.data);
  };

  const handleUpdate = async () => {
    await updateSalary(data);
    alert("✅ Updated successfully");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">💰 Salary Data</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Employee ID"
          value={params.emp_id}
          onChange={(e) => setParams({ ...params, emp_id: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Month-Year (e.g. November2025)"
          value={params["month-year"]}
          onChange={(e) => setParams({ ...params, "month-year": e.target.value })}
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-3 py-2 rounded">
          Search
        </button>
      </div>

      {data && (
        <div className="bg-gray-50 p-4 rounded">
          <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
          <button onClick={handleUpdate} className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
