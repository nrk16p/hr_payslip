import { useState } from "react";
import { UploadCloud, Paperclip, CheckCircle2 } from "lucide-react";
import { uploadExcel } from "../lib/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("กรุณาเลือกไฟล์ Excel ก่อนอัปโหลด!");
    setLoading(true);
    try {
      const r = await uploadExcel(file);
      setRes(r.data);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("ไม่สามารถอัปโหลดไฟล์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs tracking-[0.22em] uppercase text-brass-500 font-medium">
          Payroll Administration
        </span>
        <h1 className="font-display text-2xl font-semibold text-parchment mt-2 flex items-center gap-2.5">
          <UploadCloud size={22} strokeWidth={1.75} className="text-brass-400" />
          Upload Payroll Excel
        </h1>
      </div>

      {/* Upload Card */}
      <div className="bg-ink-800/60 border border-brass-400/15 rounded-xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] p-6 mb-6">
        <p className="text-slate-400 text-sm mb-4">
          อัปโหลดไฟล์ Excel (.xlsx) เพื่อบันทึกข้อมูลเงินเดือนพนักงานเข้าสู่ระบบ
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 w-full border border-white/10 rounded-md px-3 py-2 text-sm text-slate-300 bg-ink-900/60 outline-none transition-colors focus:border-brass-400/50 focus:ring-2 focus:ring-brass-400/15
              file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-ink-700 file:text-slate-300 file:text-xs hover:file:bg-ink-600"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-md text-sm font-semibold text-[#14100a] bg-gradient-to-b from-brass-300 to-brass-600 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังอัปโหลด..." : "อัปโหลด"}
          </button>
        </div>

        {file && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-400">
            <Paperclip size={13} strokeWidth={1.75} />
            <b className="text-slate-300 font-medium">ไฟล์ที่เลือก:</b> {file.name}
          </div>
        )}
      </div>

      {/* Response Card */}
      {res && (
        <div className="bg-ink-800/60 border border-emerald-brass/25 rounded-xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] p-6">
          <h2 className="text-base font-semibold text-emerald-brass mb-3 flex items-center gap-2">
            <CheckCircle2 size={17} strokeWidth={1.75} />
            อัปโหลดสำเร็จ
          </h2>
          <div className="text-sm text-slate-400 space-y-1">
            <p>
              <b className="text-slate-300 font-medium">สถานะ:</b> {res.status}
            </p>
            <p>
              <b className="text-slate-300 font-medium">Sheet:</b> {res.sheet}
            </p>
            <p>
              <b className="text-slate-300 font-medium">Rows inserted:</b>{" "}
              {res.rows_inserted}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
