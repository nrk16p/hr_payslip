import { useState } from "react";

export default function Download() {
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    if (!month.trim()) {
      alert("กรุณาระบุ month-year เช่น January2569");
      return;
    }

    setLoading(true);

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://api-payslip-v2.vercel.app";

    const url = `${apiUrl}/salary_data/export?month-year=${encodeURIComponent(
      month.trim()
    )}`;

    window.open(url, "_blank");

    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📥 Download Payroll Excel
        </h1>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

          <p className="text-gray-700 mb-4">
            ดาวน์โหลดไฟล์เงินเดือน
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">

            <input
              type="text"
              placeholder="เช่น January2569"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-200 outline-none bg-gray-50"
            />

            <button
              onClick={handleDownload}
              disabled={loading}
              className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "กำลังดาวน์โหลด..." : "Download Excel"}
            </button>

          </div>

          <div className="mt-3 text-sm text-gray-500">
            ตัวอย่าง format: <b>January2026</b>
          </div>

        </div>

      </div>
    </div>
  );
}
