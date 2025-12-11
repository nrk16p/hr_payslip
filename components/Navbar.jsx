import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const navTabs = [
    { label: "Dashboard", href: "/" },
    { label: "Upload", href: "/upload" },
    { label: "Metadata", href: "/salary-meta" },
    { label: "Salary", href: "/salary-data" },
  ];

  return (
    <nav className="bg-gray-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo section */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">💼</span>
          <span className="font-bold text-gray-800 text-lg">Mena Payroll</span>
        </div>

        {/* Tab-style navigation */}
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {navTabs.map((tab) => {
            const isActive = router.pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
