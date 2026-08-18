"use client";

import Link from "next/link";
import ThemeToggle from "./Themetoggle";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <Link href="/" className="font-semibold text-gray-900 dark:text-gray-100">
        Medical Vision Assistant
      </Link>
      <Link href="/models" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
  Model Comparison
</Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/upload" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          Upload
        </Link>
        <Link href="/history" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          History
        </Link>
        <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
  Admin
</Link>
        {user ? (
          <button onClick={logout} className="text-gray-600 dark:text-gray-300 hover:text-red-600">
            Sign Out ({user.email})
          </button>
        ) : (
          <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Sign In
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}