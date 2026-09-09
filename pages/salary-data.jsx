import { useState, useEffect } from "react";
import {
  Wallet,
  User,
  CalendarDays,
  Search,
  Save,
  Trash2,
  TrendingUp,
  TrendingDown,
  FileBarChart,
} from "lucide-react";
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
    <div className="space-y-6">
      <div>
        <span className="text-xs tracking-[0.22em] uppercase text-brass-500 font-medium">
          Payroll Administration
        </span>
        <h1 className="font-display text-2xl font-semibold text-parchment mt-2 flex items-center gap-2.5">
          <Wallet size={21} strokeWidth={1.75} className="text-brass-400" />
          Salary Data Management
        </h1>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-ink-800/60 border border-brass-400/15 rounded-xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] p-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Employee */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <User size={13} strokeWidth={1.75} className="text-slate-500" />
              พนักงาน
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
            <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <CalendarDays size={13} strokeWidth={1.75} className="text-slate-500" />
              เดือน-ปี
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
              className="w-full md:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-md text-sm font-semibold text-[#14100a] bg-gradient-to-b from-brass-300 to-brass-600 hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Search size={15} strokeWidth={2} />
              {loading ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </div>
        </div>
      </div>

      {/* RESULT */}
      {data && (
        <div className="bg-ink-800/60 border border-brass-400/15 rounded-xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="font-display text-xl font-semibold text-parchment">
                {data["ชื่อ - นามสกุล"]}
              </h2>
              <div className="text-sm text-slate-400">
                รหัสพนักงาน:{" "}
                <b className="text-slate-300 font-medium">
                  {data["รหัสพนักงาน"]}
                </b>{" "}
                · สถานะ:{" "}
                <b className="text-slate-300 font-medium">
                  {data["สถานะคนลาออก"]}
                </b>
              </div>
            </div>
            <div className="text-sm text-slate-500">{data.Sheet}</div>
          </div>

          <SectionTable
            title="รายได้ (Earnings)"
            icon={TrendingUp}
            color="text-emerald-brass"
            section="earnings"
            items={data?.datalist?.earnings}
            onEdit={handleFieldEdit}
          />

          <SectionTable
            title="รายจ่าย (Deductions)"
            icon={TrendingDown}
            color="text-oxblood-light"
            section="deductions"
            items={data?.datalist?.deductions}
            onEdit={handleFieldEdit}
          />

          <SectionTable
            title="สรุป (Summary)"
            icon={FileBarChart}
            color="text-brass-400"
            section="summary"
            items={data?.datalist?.summary}
            onEdit={handleFieldEdit}
          />

          <div className="mt-2 flex justify-end gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-6 py-2 rounded-md text-sm font-medium text-oxblood-light border border-oxblood/30 hover:bg-oxblood/10 transition disabled:opacity-50"
            >
              <Trash2 size={15} strokeWidth={1.75} />
              {deleting ? "กำลังลบ..." : "ลบ"}
            </button>

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="flex items-center gap-1.5 px-6 py-2 rounded-md text-sm font-semibold text-[#14100a] bg-gradient-to-b from-brass-300 to-brass-600 hover:brightness-110 transition disabled:opacity-50"
            >
              <Save size={15} strokeWidth={1.75} />
              {updating ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------
   🔸 Subcomponent: Editable Table Section
-------------------------------------------------------- */
function SectionTable({ title, icon: Icon, color, section, items, onEdit }) {
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");

  return (
    <div className="mb-2">
      <h3 className={`text-sm font-semibold mb-3 ${color} flex items-center gap-1.5 tracking-wide`}>
        {Icon && <Icon size={15} strokeWidth={1.75} />}
        {title}
      </h3>

      <div className="overflow-hidden border border-white/8 rounded-lg">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {Object.entries(items || {}).map(([key, value], index) => {
              const rowKey = `${section}-${key}`;
              const numericValue = Number(value);

              return (
                <tr
                  key={rowKey}
                  className={`${
                    index % 2 === 0 ? "bg-white/[0.02]" : ""
                  } hover:bg-brass-400/[0.06] transition-colors`}
                >
                  <td className="p-3 font-medium text-slate-300 border-t border-white/5">
                    {key}
                  </td>

                  <td className="p-3 text-right border-t border-white/5 w-48">
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
                        className="border border-brass-400/40 rounded px-2 py-1 w-28 text-right text-parchment bg-ink-900/60 outline-none focus:ring-2 focus:ring-brass-400/20"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="cursor-pointer text-slate-300 hover:text-brass-300 select-none"
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
