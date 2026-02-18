import { useState, useEffect } from "react";
import { getSalary, updateSalary, deleteSalary } from "../lib/api";
import DropdownSearch from "../components/DropdownSearch";

export default function SalaryData() {
  const [params, setParams] = useState({
    emp_id: "",
    full_name: "",
    "month-year": "",
  });

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ================= LOAD EMPLOYEES =================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          "https://api-payslip-v2.vercel.app/salary/employees"
        );
        const json = await res.json();

        const list = Array.isArray(json.employees) ? json.employees : [];

        const options = list
          .filter((e) => e.emp_code && e.full_name)
          .map((e) => {
            const code = e.emp_code.toString().replace(".0", "").trim();
            return {
              value: code,
              label: `${code} - ${e.full_name.trim()}`,
              full_name: e.full_name.trim(),
            };
          });

        setEmployeeOptions(options);
      } catch (err) {
        console.error("โหลด employee ไม่สำเร็จ:", err);
      }
    };

    fetchEmployees();
  }, []);

  // ================= LOAD MONTHS =================
  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const res = await fetch(
          "https://api-payslip-v2.vercel.app/salary/month-years"
        );
        const json = await res.json();

        const list = Array.isArray(json.month_years)
          ? json.month_years
          : [];

        // 🧠 map month name to number
        const monthMap = {
          January: 1,
          February: 2,
          March: 3,
          April: 4,
          May: 5,
          June: 6,
          July: 7,
          August: 8,
          September: 9,
          October: 10,
          November: 11,
          December: 12,
        };

        const sorted = list
          .filter((m) => m && m !== "Unknown")
          .sort((a, b) => {
            const parse = (val) => {
              const match = val.match(/^([A-Za-z]+)(\d{4})$/);
              if (!match) return { year: 0, month: 0 };

              const monthName = match[1];
              const year = parseInt(match[2], 10);
              const month = monthMap[monthName] || 0;

              return { year, month };
            };

            const A = parse(a);
            const B = parse(b);

            // 🔥 เรียงใหม่ → เก่า
            if (A.year !== B.year) return B.year - A.year;
            return B.month - A.month;
          })
          .map((m) => ({
            value: m,
            label: m,
          }));

        setMonthOptions(sorted);
      } catch (err) {
        console.error("โหลด month-year ไม่สำเร็จ:", err);
      }
    };

    fetchMonths();
  }, []);

  // ================= HANDLE SELECT =================
  const handleEmployeeChange = (value) => {
    const selected = employeeOptions.find((o) => o.value === value);
    if (!selected) return;

    setParams((prev) => ({
      ...prev,
      emp_id: selected.value,
      full_name: selected.full_name,
    }));
  };

  const handleMonthChange = (value) => {
    setParams((prev) => ({
      ...prev,
      "month-year": value,
    }));
  };

  // ================= SEARCH =================
  const handleSearch = async () => {
    if (!params.emp_id || !params["month-year"]) {
      alert("กรุณาเลือกพนักงาน และ เดือน-ปี");
      return;
    }

    setLoading(true);
    try {
      const res = await getSalary({
        emp_id: params.emp_id,
        "month-year": params["month-year"],
      });

      // API returns array
      if (Array.isArray(res.data) && res.data.length > 0) {
        setData(res.data[0]);
      } else {
        alert("ไม่พบข้อมูล");
        setData(null);
      }
    } catch (err) {
      console.error(err);
      alert("ดึงข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!data) return alert("ไม่มีข้อมูลให้บันทึก");

    setUpdating(true);
    try {
      await updateSalary(data);
      alert("✅ บันทึกสำเร็จ");
    } catch (err) {
      console.error(err);
      alert("❌ บันทึกไม่สำเร็จ");
    } finally {
      setUpdating(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!data) return alert("ไม่มีข้อมูลให้ลบ");
    if (!confirm("ต้องการลบข้อมูลใช่หรือไม่?")) return;

    setDeleting(true);
    try {
      await deleteSalary(data.Sheet, data["รหัสพนักงาน"]);
      alert("🗑️ ลบสำเร็จ");
      setData(null);
    } catch (err) {
      console.error(err);
      alert("❌ ลบไม่สำเร็จ");
    } finally {
      setDeleting(false);
    }
  };

  // ================= ✏️ Edit a single field =================
  const handleFieldEdit = (section, key, newValue) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = structuredClone(prev);

      // ensure nested object exists
      if (!updated.datalist) updated.datalist = {};
      if (!updated.datalist[section]) updated.datalist[section] = {};

      // normalize numeric string
      const num = Number(newValue);
      updated.datalist[section][key] = Number.isFinite(num)
        ? num.toFixed(2)
        : String(newValue);

      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          💰 Salary Data Management
        </h1>

        {/* SEARCH CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

            {/* Employee */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">
                👨‍✈️ พนักงาน 
              </label>
              <DropdownSearch
                value={params.emp_id}
                onChange={handleEmployeeChange}
                options={employeeOptions}
                placeholder="-- เลือกพนักงาน --"
                searchPlaceholder="ค้นหา รหัส หรือ ชื่อ..."
                error={!params.emp_id}
              />
            </div>

            {/* Month-Year */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">
                🗓️ เดือน-ปี
              </label>
              <DropdownSearch
                value={params["month-year"]}
                onChange={handleMonthChange}
                options={monthOptions}
                placeholder="-- เลือกเดือน-ปี --"
                searchPlaceholder="ค้นหาเดือน..."
                error={!params["month-year"]}
              />
            </div>

            {/* Button */}
            <div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {loading ? "กำลังค้นหา..." : "🔍 ค้นหา"}
              </button>
            </div>

          </div>
        </div>

        {/* RESULT */}
        {data && (
          <div className="bg-white border rounded-xl shadow-sm p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  🧾 {data["ชื่อ - นามสกุล"]}
                </h2>
                <div className="text-sm text-slate-600">
                  รหัสพนักงาน: <b>{data["รหัสพนักงาน"]}</b> · สถานะ:{" "}
                  <b>{data["สถานะคนลาออก"]}</b>
                </div>
              </div>
              <div className="text-sm text-slate-600">{data.Sheet}</div>
            </div>

            <SectionTable
              title="รายได้ (Earnings)"
              color="text-green-700"
              section="earnings"
              items={data?.datalist?.earnings}
              onEdit={handleFieldEdit}
            />

            <SectionTable
              title="รายจ่าย (Deductions)"
              color="text-red-700"
              section="deductions"
              items={data?.datalist?.deductions}
              onEdit={handleFieldEdit}
            />

            <SectionTable
              title="สรุป (Summary)"
              color="text-blue-700"
              section="summary"
              items={data?.datalist?.summary}
              onEdit={handleFieldEdit}
            />

            <div className="mt-2 flex justify-end gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "กำลังลบ..." : "🗑️ ลบ"}
              </button>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                {updating ? "กำลังบันทึก..." : "💾 บันทึก"}
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
    <div className="mb-2">
      <h3 className={`text-lg font-semibold mb-3 ${color} flex items-center gap-1`}>
        {title}
      </h3>

      <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {Object.entries(items || {}).map(([key, value], index) => {
              const rowKey = `${section}-${key}`;
              const numericValue = Number(value);

              return (
                <tr
                  key={rowKey}
                  className={`${
                    index % 2 === 0 ? "bg-slate-50" : "bg-white"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="p-3 font-medium text-slate-800 border-b border-slate-100">
                    {key}
                  </td>

                  <td className="p-3 text-right border-b border-slate-100 w-48">
                    {editingKey === rowKey ? (
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
                          if (e.key === "Escape") {
                            setEditingKey(null);
                          }
                        }}
                        className="border border-blue-300 rounded px-2 py-1 w-28 text-right outline-none focus:ring focus:ring-blue-200"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="cursor-pointer text-slate-700 hover:text-blue-700 select-none"
                        onClick={() => {
                          setEditingKey(rowKey);
                          setEditValue(
                            Number.isFinite(numericValue)
                              ? numericValue.toFixed(2)
                              : String(value ?? "")
                          );
                        }}
                        title="คลิกเพื่อแก้ไข"
                      >
                        {Number.isFinite(numericValue)
                          ? numericValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : String(value ?? "")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        * คลิกที่ตัวเลขเพื่อแก้ไข (Enter เพื่อยืนยัน, Esc เพื่อยกเลิก)
      </p>
    </div>
  );
}
