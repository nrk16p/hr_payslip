import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { getSession, logout } from "../lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // localStorage isn't available during SSR, so the session can only be
    // read post-mount; this avoids a hydration mismatch with the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(getSession());
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navTabs = [
    { label: "Dashboard", href: "/" },
    { label: "Upload", href: "/upload" },
    { label: "Metadata", href: "/salary-meta" },
    { label: "Salary", href: "/salary-data" },
    { label: "Active Window", href: "/api-window" },
    { label: "Download", href: "/download" },
  ];

  return (
    <nav className="bg-ink-900/80 backdrop-blur border-b border-brass-400/15">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center gap-6">
        {/* Logo section */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <span className="relative flex items-center justify-center w-8 h-8 rounded-full border border-brass-400/50 bg-ink-800">
            <span
              className="text-sm font-semibold italic bg-gradient-to-b from-brass-300 to-brass-600 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-display)" }}
            >
              M
            </span>
          </span>
          <span
            className="font-semibold text-parchment text-base tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Mena Payroll
          </span>
        </div>

        {/* Tab-style navigation */}
        <div className="flex-1 flex gap-1 overflow-x-auto">
          {navTabs.map((tab) => {
            const isActive = router.pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative px-3.5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-brass-300"
                    : "text-slate-400 hover:text-parchment"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute left-3.5 right-3.5 -bottom-[15px] h-px bg-gradient-to-r from-brass-500/0 via-brass-400 to-brass-500/0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User section */}
        {session && (
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-sm text-slate-300">
              {session.name || session.employee_id}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 border border-transparent hover:text-brass-300 hover:border-brass-400/25 transition-colors"
            >
              <LogOut size={13} strokeWidth={1.75} />
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
