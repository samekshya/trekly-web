"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/treklylogo.png"
          alt="Trekly"
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-xl font-bold text-green-700">Trekly</span>
      </Link>

      {/* Nav Links */}
      <nav className="flex items-center gap-6">
        <Link
          href="/treks"
          className="text-gray-600 hover:text-green-700 font-medium transition"
        >
          Explore Treks
        </Link>

        {user ? (
          <>
            <Link
              href="/favourites"
              className="text-gray-600 hover:text-green-700 font-medium transition"
            >
              ❤️ Favourites
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-green-700 font-medium transition"
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </nav>
    </header>
  );
}