import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">💼 Mena Payroll Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/upload" className="bg-blue-100 p-6 rounded shadow hover:bg-blue-200">
          📤 Upload Excel
        </Link>
        <Link href="/salary-meta" className="bg-green-100 p-6 rounded shadow hover:bg-green-200">
          ⚙️ Salary Metadata
        </Link>
        <Link href="/salary-data" className="bg-yellow-100 p-6 rounded shadow hover:bg-yellow-200">
          💰 Salary Data
        </Link>
      </div>
    </div>
  );
}
