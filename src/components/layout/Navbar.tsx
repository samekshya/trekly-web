"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <Link href="/" className="text-xl font-bold text-green-700">
        🏔️ Trekly
      </Link>

      <nav className="flex items-center gap-6">
        <Link
          href="/treks"
          className="text-gray-600 hover:text-green-700 font-medium transition"
        >
          Explore Treks
        </Link>
        <Link
          href="/login"
          className="text-gray-600 hover:text-green-700 font-medium transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition"
        >
          Register
        </Link>
      </nav>
    </header>
  );
}