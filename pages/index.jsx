import Link from "next/link";
import { UploadCloud, SlidersHorizontal, Wallet, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const cards = [
    {
      id: "upload",
      title: "Upload Excel",
      desc: "อัปโหลดไฟล์เงินเดือน (.xlsx) เพื่อบันทึกและอัปเดตข้อมูลพนักงานแบบอัตโนมัติ",
      href: "/upload",
      icon: UploadCloud,
    },
    {
      id: "meta",
      title: "Salary Metadata",
      desc: "จัดการหมวดหมู่รายได้ รายจ่าย และหมวดสรุปของแต่ละรายการ",
      href: "/salary-meta",
      icon: SlidersHorizontal,
    },
    {
      id: "data",
      title: "Salary Data",
      desc: "ค้นหา ดูรายละเอียด และแก้ไขข้อมูลเงินเดือนพนักงานในแต่ละเดือน",
      href: "/salary-data",
      icon: Wallet,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs tracking-[0.22em] uppercase text-brass-500 font-medium">
          Payroll Administration
        </span>
        <h1 className="font-display text-3xl font-semibold text-parchment mt-2 mb-3">
          Mena Payroll Dashboard
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-2xl text-sm">
          ระบบบริหารจัดการเงินเดือนช่วยให้คุณสามารถอัปโหลดไฟล์ Excel
          จัดหมวดหมู่รายการเงินเดือนและดูข้อมูลพนักงานได้อย่างง่ายดาย
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group relative bg-ink-800/60 border border-brass-400/15 rounded-xl p-6 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] hover:border-brass-400/40 hover:-translate-y-1 transition-all duration-200"
            >
              <span className="absolute top-4 right-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-brass-400 transition-all">
                <ArrowUpRight size={16} strokeWidth={1.75} />
              </span>

              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-ink-700 border border-brass-400/20 text-brass-400 mb-4">
                <Icon size={19} strokeWidth={1.75} />
              </span>

              <h2 className="font-display text-lg font-semibold text-parchment mb-2">
                {card.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Explanation Section */}
      <div className="mt-10 bg-ink-800/40 border border-brass-400/10 rounded-xl p-8">
        <h2 className="font-display text-lg font-semibold mb-4 text-parchment">
          แนะนำการใช้งานระบบ
        </h2>
        <ul className="text-slate-400 space-y-3 text-sm leading-relaxed">
          <li className="flex gap-2.5">
            <span className="mt-2 w-1 h-1 rounded-full bg-brass-500 shrink-0" />
            <span>
              <b className="text-parchment font-medium">Upload Excel</b> —
              อัปโหลดไฟล์ Excel เงินเดือน (.xlsx) ระบบจะอ่านข้อมูลและบันทึกอัตโนมัติ
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 w-1 h-1 rounded-full bg-brass-500 shrink-0" />
            <span>
              <b className="text-parchment font-medium">Salary Metadata</b> —
              ใช้กำหนดหมวดหมู่ของรายการเงินเดือน เช่น รายได้ รายจ่าย และสรุป
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 w-1 h-1 rounded-full bg-brass-500 shrink-0" />
            <span>
              <b className="text-parchment font-medium">Salary Data</b> —
              สำหรับดู/แก้ไข/ลบข้อมูลเงินเดือนของพนักงานในแต่ละเดือน
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
