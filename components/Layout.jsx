import Navbar from "./Navbar";
import { motion } from "framer-motion"; // 👈 add this import

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* 🔹 Top Navbar */}
      <Navbar />

      {/* 🔹 Page content with animation */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* 🔹 Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t bg-white">
        © {new Date().getFullYear()} <span className="font-medium">MenaTech Thailand</span>. All rights reserved.
      </footer>
    </div>
  );
}
