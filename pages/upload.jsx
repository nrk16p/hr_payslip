import { useState } from "react";
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
      console.error("❌ Upload failed:", err);
      alert("❌ ไม่สามารถอัปโหลดไฟล์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>📤</span> Upload Payroll Excel
        </h1>

        {/* Upload Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <p className="text-gray-700 mb-4">
            อัปโหลดไฟล์ Excel (.xlsx) เพื่อบันทึกข้อมูลเงินเดือนพนักงานเข้าสู่ระบบ
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "กำลังอัปโหลด..." : "อัปโหลด"}
            </button>
          </div>

          {file && (
            <div className="mt-3 text-sm text-gray-600">
              📎 <b>ไฟล์ที่เลือก:</b> {file.name}
            </div>
          )}
        </div>

        {/* Response Card */}
        {res && (
          <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              ✅ อัปโหลดสำเร็จ
            </h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <b>สถานะ:</b> {res.status}
              </p>
              <p>
                <b>Sheet:</b> {res.sheet}
              </p>
              <p>
                <b>Rows inserted:</b> {res.rows_inserted}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
