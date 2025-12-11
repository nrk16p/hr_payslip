import { useEffect, useState } from "react";
import { getMeta, addMeta, deleteMeta } from "../lib/api";

export default function SalaryMeta() {
  const [meta, setMeta] = useState([]);
  const [newItem, setNewItem] = useState({ item_name: "", item_group: "earnings" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMeta();
  }, []);

  const loadMeta = async () => {
    setLoading(true);
    try {
      const res = await getMeta();
      setMeta(res.data);
    } catch (err) {
      console.error("❌ Failed to load metadata:", err);
      alert("❌ โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newItem.item_name) return alert("กรุณากรอกชื่อรายการ");
    try {
      await addMeta(newItem);
      setNewItem({ item_name: "", item_group: "earnings" });
      loadMeta();
    } catch (err) {
      console.error("❌ Add failed:", err);
      alert("❌ เพิ่มข้อมูลไม่สำเร็จ");
    }
  };

  const handleDelete = async (name) => {
    if (!confirm(`ลบ "${name}" ใช่หรือไม่?`)) return;
    try {
      await deleteMeta(name);
      loadMeta();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("❌ ลบข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">⚙️ Salary Item Metadata</h1>

      {/* Input card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6 flex flex-wrap gap-3 items-center">
        <input
          value={newItem.item_name}
          onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
          placeholder="ชื่อรายการ (Item Name)"
          className="border border-gray-300 rounded-md p-2 flex-1 min-w-[200px]"
        />
        <select
          value={newItem.item_group}
          onChange={(e) => setNewItem({ ...newItem, item_group: e.target.value })}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="earnings">รายได้ (earnings)</option>
          <option value="deductions">รายจ่าย (deductions)</option>
          <option value="summary">สรุป (summary)</option>
        </select>
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          ➕ เพิ่มรายการ
        </button>
      </div>

      {/* Metadata table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">ชื่อรายการ</th>
              <th className="p-3 text-left">กลุ่ม</th>
              <th className="p-3 text-center w-24">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : meta.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  ไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              meta.map((m, i) => (
                <tr
                  key={m.item_name}
                  className={`${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 text-gray-800 border-b border-gray-100">
                    {m.item_name}
                  </td>
                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {m.item_group}
                  </td>
                  <td className="p-3 text-center border-b border-gray-100">
                    <button
                      onClick={() => handleDelete(m.item_name)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      🗑 ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
