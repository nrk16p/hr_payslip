import { useEffect, useState } from "react";
import { SlidersHorizontal, Plus, Trash2 } from "lucide-react";
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
      console.error("Failed to load metadata:", err);
      alert("โหลดข้อมูลไม่สำเร็จ");
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
      console.error("Add failed:", err);
      alert("เพิ่มข้อมูลไม่สำเร็จ");
    }
  };

  const handleDelete = async (name) => {
    if (!confirm(`ลบ "${name}" ใช่หรือไม่?`)) return;
    try {
      await deleteMeta(name);
      loadMeta();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("ลบข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs tracking-[0.22em] uppercase text-brass-500 font-medium">
          Payroll Administration
        </span>
        <h1 className="font-display text-2xl font-semibold text-parchment mt-2 flex items-center gap-2.5">
          <SlidersHorizontal size={21} strokeWidth={1.75} className="text-brass-400" />
          Salary Item Metadata
        </h1>
      </div>

      {/* Input card */}
      <div className="bg-ink-800/60 border border-brass-400/15 rounded-xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] p-6 mb-6 flex flex-wrap gap-3 items-center">
        <input
          value={newItem.item_name}
          onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
          placeholder="ชื่อรายการ (Item Name)"
          className="flex-1 min-w-[200px] border border-white/10 rounded-md p-2 text-sm text-parchment bg-ink-900/60 placeholder:text-slate-500 outline-none transition-colors focus:border-brass-400/50 focus:ring-2 focus:ring-brass-400/15"
        />
        <select
          value={newItem.item_group}
          onChange={(e) => setNewItem({ ...newItem, item_group: e.target.value })}
          className="border border-white/10 rounded-md p-2 text-sm text-parchment bg-ink-900/60 outline-none focus:border-brass-400/50"
        >
          <option value="earnings">รายได้ (earnings)</option>
          <option value="deductions">รายจ่าย (deductions)</option>
          <option value="summary">สรุป (summary)</option>
        </select>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-[#14100a] bg-gradient-to-b from-brass-300 to-brass-600 hover:brightness-110 transition-all"
        >
          <Plus size={15} strokeWidth={2} />
          เพิ่มรายการ
        </button>
      </div>

      {/* Metadata table */}
      <div className="bg-ink-800/60 border border-brass-400/15 rounded-xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-ink-900/60 text-slate-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="p-3 text-left font-medium">ชื่อรายการ</th>
              <th className="p-3 text-left font-medium">กลุ่ม</th>
              <th className="p-3 text-center w-24 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-slate-500">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : meta.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-slate-500">
                  ไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              meta.map((m, i) => (
                <tr
                  key={m.item_name}
                  className={`${
                    i % 2 === 0 ? "bg-white/[0.02]" : ""
                  } hover:bg-brass-400/[0.06] transition-colors`}
                >
                  <td className="p-3 text-parchment border-t border-white/5">
                    {m.item_name}
                  </td>
                  <td className="p-3 text-slate-400 border-t border-white/5">
                    {m.item_group}
                  </td>
                  <td className="p-3 text-center border-t border-white/5">
                    <button
                      onClick={() => handleDelete(m.item_name)}
                      className="inline-flex items-center gap-1 text-oxblood hover:text-oxblood-light font-medium transition-colors"
                    >
                      <Trash2 size={13} strokeWidth={1.75} />
                      ลบ
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
