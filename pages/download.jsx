import { useState } from "react";
import { Download as DownloadIcon } from "lucide-react";

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
    <div className="max-w-3xl">
      <div className="mb-8">
        <span className="text-xs tracking-[0.22em] uppercase text-brass-500 font-medium">
          Payroll Administration
        </span>
        <h1 className="font-display text-2xl font-semibold text-parchment mt-2 flex items-center gap-2.5">
          <DownloadIcon size={22} strokeWidth={1.75} className="text-brass-400" />
          Download Payroll Excel
        </h1>
      </div>

      <div className="bg-ink-800/60 border border-brass-400/15 rounded-xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] p-6">
        <p className="text-slate-400 text-sm mb-4">ดาวน์โหลดไฟล์เงินเดือน</p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="เช่น January2569"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="flex-1 w-full border border-white/10 rounded-md px-3 py-2 text-sm text-parchment bg-ink-900/60 placeholder:text-slate-500 outline-none transition-colors focus:border-brass-400/50 focus:ring-2 focus:ring-brass-400/15"
          />

          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-md text-sm font-semibold text-[#14100a] bg-gradient-to-b from-brass-300 to-brass-600 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังดาวน์โหลด..." : "Download Excel"}
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          ตัวอย่าง format: <b className="text-slate-400 font-medium">January2026</b>
        </div>
      </div>
    </div>
  );
}
