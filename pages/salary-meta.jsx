import { useEffect, useState } from "react";
import { getMeta, addMeta, deleteMeta } from "../lib/api";

export default function SalaryMeta() {
  const [meta, setMeta] = useState([]);
  const [newItem, setNewItem] = useState({ item_name: "", item_group: "earnings" });

  useEffect(() => { loadMeta(); }, []);
  const loadMeta = async () => setMeta((await getMeta()).data);

  const handleAdd = async () => {
    if (!newItem.item_name) return alert("Enter item name");
    await addMeta(newItem);
    setNewItem({ item_name: "", item_group: "earnings" });
    loadMeta();
  };

  const handleDelete = async (name) => {
    await deleteMeta(name);
    loadMeta();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">⚙️ Salary Item Metadata</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={newItem.item_name}
          onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
          placeholder="Item name"
          className="border p-2 rounded"
        />
        <select
          value={newItem.item_group}
          onChange={(e) => setNewItem({ ...newItem, item_group: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="earnings">earnings</option>
          <option value="deductions">deductions</option>
          <option value="summary">summary</option>
        </select>
        <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Item Name</th>
            <th className="p-2 text-left">Group</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {meta.map((m) => (
            <tr key={m.item_name} className="border-t">
              <td className="p-2">{m.item_name}</td>
              <td className="p-2">{m.item_group}</td>
              <td className="p-2">
                <button onClick={() => handleDelete(m.item_name)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
