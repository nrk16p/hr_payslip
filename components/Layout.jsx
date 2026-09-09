import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import { motion } from "framer-motion"; // 👈 add this import
import { getSession } from "../lib/auth";

export default function Layout({ children }) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;
    if (!getSession()) {
      router.replace("/login");
      return;
    }
    // localStorage isn't available during SSR, so the auth check can only
    // happen post-mount; this mirrors the server-rendered "checking" state
    // until the client confirms a session, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthChecked(true);
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="ledger-surface min-h-screen flex items-center justify-center text-sm tracking-wide text-slate-400">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-brass-500 mr-2 animate-pulse" />
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  return (
    <div className="ledger-surface relative min-h-screen flex flex-col text-parchment">
      <div className="ledger-grain" />

      {/* 🔹 Top Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* 🔹 Page content with animation */}
      <main className="relative z-10 flex-1 container mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* 🔹 Footer */}
      <footer className="relative z-10 text-center py-4 text-xs tracking-wide text-slate-500 border-t border-brass-400/10">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-slate-400">MenaTech Thailand</span>.
        All rights reserved.
      </footer>
    </div>
  );
}
