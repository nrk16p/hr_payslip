import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = ["All", "Active", "Draft", "Archived"];

  const cards = [
    {
      id: "upload",
      title: "📤 Upload Excel",
      desc: "อัปโหลดไฟล์เงินเดือน (.xlsx) เพื่อบันทึกและอัปเดตข้อมูลพนักงานแบบอัตโนมัติ",
      color: "from-blue-50 to-blue-100",
      href: "/upload",
    },
    {
      id: "meta",
      title: "⚙️ Salary Metadata",
      desc: "จัดการหมวดหมู่รายได้ รายจ่าย และหมวดสรุปของแต่ละรายการ",
      color: "from-green-50 to-green-100",
      href: "/salary-meta",
    },
    {
      id: "data",
      title: "💰 Salary Data",
      desc: "ค้นหา ดูรายละเอียด และแก้ไขข้อมูลเงินเดือนพนักงานในแต่ละเดือน",
      color: "from-yellow-50 to-yellow-100",
      href: "/salary-data",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          💼 Mena Payroll Dashboard
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed max-w-3xl">
          ระบบบริหารจัดการเงินเดือนของ MenaTech ช่วยให้คุณสามารถอัปโหลดไฟล์ Excel
          จัดหมวดหมู่รายการเงินเดือน และดูข้อมูลพนักงานได้อย่างง่ายดาย
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white border border-gray-200 rounded-xl w-fit p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.toLowerCase()
                  ? "bg-gray-100 text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className={`bg-gradient-to-b ${card.color} p-6 rounded-xl shadow-sm border border-gray-200 
                hover:shadow-md hover:-translate-y-1 transition-transform duration-200`}
            >
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{card.desc}</p>
            </Link>
          ))}
        </div>

        {/* Explanation Section */}
        <div className="mt-12 bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📘 แนะนำการใช้งานระบบ</h2>
          <ul className="text-gray-700 space-y-3 text-sm leading-relaxed list-disc pl-6">
            <li>
              <b>Upload Excel</b> — อัปโหลดไฟล์ Excel เงินเดือน (.xlsx) ระบบจะอ่านข้อมูลและบันทึกอัตโนมัติ
            </li>
            <li>
              <b>Salary Metadata</b> — ใช้กำหนดหมวดหมู่ของรายการเงินเดือน เช่น รายได้ รายจ่าย และสรุป
            </li>
            <li>
              <b>Salary Data</b> — สำหรับดู/แก้ไขข้อมูลเงินเดือนของพนักงานในแต่ละเดือน
            </li>
            <li>
              รองรับการอัปเดตข้อมูลย้อนหลัง โดยระบบจะตรวจจับและอัปเดตเฉพาะข้อมูลที่เปลี่ยนแปลง
            </li>
            <li>
              รองรับภาษาไทยเต็มรูปแบบ และจัดรูปแบบเดือน-ปีอัตโนมัติ (พ.ย.2568 → November2025)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
