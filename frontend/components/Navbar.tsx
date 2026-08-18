"use client";

import Link from "next/link";
import { ScanLine } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
        <ScanLine className="h-5 w-5 text-blue-500" />
        Medical Vision Assistant
      </Link>

      <div className="flex items-center gap-5 text-sm">
        <Link href="/upload" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          Upload
        </Link>
        <Link href="/history" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          History
        </Link>

        {/* Secondary/admin-ish links, visually de-emphasized and hidden on smaller screens */}
        <div className="hidden md:flex items-center gap-5 pl-5 border-l border-gray-200 dark:border-gray-800">
          <Link href="/admin" className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs uppercase tracking-wide">
            Admin
          </Link>
          <Link href="/models" className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs uppercase tracking-wide">
            Models
          </Link>
        </div>

        {user ? (
          <button onClick={logout} className="text-gray-600 dark:text-gray-300 hover:text-red-600 pl-3">
            Sign Out
          </button>
        ) : (
          <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white pl-3">
            Sign In
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}