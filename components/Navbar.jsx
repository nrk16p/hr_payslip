import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold">💼 Mena Payroll</h1>
      <div className="flex gap-4">
        <Link href="/" className="hover:text-blue-300">Dashboard</Link>
        <Link href="/upload" className="hover:text-blue-300">Upload</Link>
        <Link href="/salary-meta" className="hover:text-blue-300">Metadata</Link>
        <Link href="/salary-data" className="hover:text-blue-300">Salary</Link>
      </div>
    </nav>
  );
}
