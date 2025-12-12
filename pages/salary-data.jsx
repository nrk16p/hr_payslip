import { useState } from "react";
import { getSalary, updateSalary, deleteSalary } from "../lib/api";

export default function SalaryData() {
  const [params, setParams] = useState({ emp_id: "", "month-year": "" });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔍 Load salary data
  const handleSearch = async () => {
    if (!params.emp_id || !params["month-year"]) {
      alert("กรุณากรอก รหัสพนักงาน และ เดือน-ปี");
      return;
    }

    setLoading(true);
    try {
      const res = await getSalary(params);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setData(res.data[0]);
      } else if (res.data && Object.keys(res.data).length > 0) {
        setData(res.data);
      } else {
        alert("ไม่พบข้อมูล");
        setData(null);
      }
    } catch (err) {
      console.error("❌ Error fetching salary data:", err);
      alert("❌ ดึงข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // 💾 Update full dataset
  const handleUpdate = async () => {
    if (!data) return alert("ไม่มีข้อมูลให้บันทึก");
    setUpdating(true);
    try {
      await updateSalary(data);
      alert("✅ บันทึกสำเร็จ");
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("❌ บันทึกไม่สำเร็จ");
    } finally {
      setUpdating(false);
    }
  };

  // 🗑️ Delete salary data
  const handleDelete = async () => {
    if (!data) return alert("ไม่มีข้อมูลให้ลบ");

    const confirmDelete = confirm(
      `⚠️ ต้องการลบข้อมูลเงินเดือนของ ${data["ชื่อ - นามสกุล"]} (${data["รหัสพนักงาน"]})\nเดือน ${data.Sheet} ใช่หรือไม่?`
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await deleteSalary(data.Sheet, data["รหัสพนักงาน"]);
      alert("🗑️ ลบข้อมูลเรียบร้อยแล้ว");
      setData(null);
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("❌ ลบข้อมูลไม่สำเร็จ");
    } finally {
      setDeleting(false);
    }
  };

  // ✏️ Edit a single field
  const handleFieldEdit = (section, key, newValue) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = structuredClone(prev);
      updated.datalist[section][key] = newValue;
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>💰</span> ข้อมูลเงินเดือน (Salary Data)
        </h1>

        {/* Search Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              className="border border-gray-300 p-2 rounded-md flex-1 min-w-[250px] focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="รหัสพนักงาน (Employee ID)"
              value={params.emp_id}
              onChange={(e) => setParams({ ...params, emp_id: e.target.value })}
            />
            <input
              className="border border-gray-300 p-2 rounded-md flex-1 min-w-[250px] focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="เดือน-ปี (เช่น November2025)"
              value={params["month-year"]}
              onChange={(e) =>
                setParams({ ...params, "month-year": e.target.value })
              }
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </div>
        </div>

        {/* Results */}
        {data && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8">
            {/* Header Info */}
            <h2 className="text-xl font-semibold mb-4">
              🧾 ใบจ่ายเงินเดือน {data.Sheet}
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 grid sm:grid-cols-3 gap-3 text-gray-700">
              <p>
                <b>ชื่อ - นามสกุล:</b> {data["ชื่อ - นามสกุล"]}
              </p>
              <p>
                <b>รหัสพนักงาน:</b> {data["รหัสพนักงาน"]}
              </p>
              <p>
                <b>สถานะ:</b> {data["สถานะคนลาออก"]}
              </p>
            </div>

            {/* Sections */}
            <SectionTable
              title="รายได้ (Earnings)"
              color="text-green-700"
              section="earnings"
              items={data.datalist.earnings}
              onEdit={handleFieldEdit}
            />

            <SectionTable
              title="รายจ่าย (Deductions)"
              color="text-red-700"
              section="deductions"
              items={data.datalist.deductions}
              onEdit={handleFieldEdit}
            />

            <SectionTable
              title="สรุป (Summary)"
              color="text-blue-700"
              section="summary"
              items={data.datalist.summary}
              onEdit={handleFieldEdit}
            />

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "กำลังลบ..." : "🗑️ ลบข้อมูล"}
              </button>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                {updating ? "กำลังบันทึก..." : "💾 บันทึกข้อมูล"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------
   🔸 Subcomponent: Editable Table Section
-------------------------------------------------------- */
function SectionTable({ title, color, section, items, onEdit }) {
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");

  return (
    <div className="mb-8">
      <h3 className={`text-lg font-semibold mb-3 ${color} flex items-center gap-1`}>
        {title}
      </h3>
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {Object.entries(items || {}).map(([key, value], index) => (
              <tr
                key={key}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="p-3 font-medium text-gray-800 border-b border-gray-100">
                  {key}
                </td>
                <td className="p-3 text-right border-b border-gray-100 w-40">
                  {editingKey === `${section}-${key}` ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => {
                        onEdit(section, key, editValue);
                        setEditingKey(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onEdit(section, key, editValue);
                          setEditingKey(null);
                        }
                      }}
                      className="border border-blue-400 rounded px-2 py-1 w-24 text-right outline-none focus:ring focus:ring-blue-200"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="cursor-pointer text-gray-700 hover:text-blue-700 select-none"
                      onClick={() => {
                        setEditingKey(`${section}-${key}`);
                        setEditValue(parseFloat(value));
                      }}
                      title="คลิกเพื่อแก้ไข"
                    >
                      {parseFloat(value).toLocaleString()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
