"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser, ] = useState<{ name: string; role: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/login" || pathname === "/register") return null;

  const isHome = pathname === "/";

  return (
    <header style={{
      position: "fixed",
      width: "100%",
      top: 0,
      zIndex: 50,
      backgroundColor: scrolled || !isHome ? "white" : "transparent",
      borderBottom: scrolled || !isHome ? "1px solid #f1f5f9" : "none",
      boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
      transition: "all 0.3s ease",
      padding: "12px 48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <Image
          src="/treklylogo.png"
          alt="Trekly"
          width={99}
          height={99}
          style={{ objectFit: "contain" }}
        />
        <span style={{
          fontSize: 20,
          fontWeight: 800,
          color: scrolled || !isHome ? "#15803d" : "white",
          transition: "color 0.3s",
        }}>
          
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link href="/treks" style={{
          color: scrolled || !isHome ? "#4b5563" : "rgba(255,255,255,0.9)",
          fontWeight: 500,
          fontSize: 15,
          textDecoration: "none",
          padding: "8px 16px",
          borderRadius: 8,
          transition: "all 0.2s",
        }}>
          Explore Treks
        </Link>

        {user ? (
          <>
            {user.role === "admin" ? (
              // Admin navigation
              <>
                <Link href="/admin/treks" style={{
                  backgroundColor: "#16a34a",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                }}>
                  🔧 Admin Panel
                </Link>
              </>
            ) : (
              // User navigation
              <>
                <Link href="/favourites" style={{
                  color: scrolled || !isHome ? "#4b5563" : "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                  fontSize: 15,
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  transition: "all 0.2s",
                }}>
                  ❤️ Favourites
                </Link>
                <Link href="/dashboard" style={{
                  color: scrolled || !isHome ? "#4b5563" : "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                  fontSize: 15,
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  transition: "all 0.2s",
                }}>
                  Dashboard
                </Link>
              </>
            )}

            {/* Avatar dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 8 }}>
              <Link href="/profile" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 34, height: 34,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #16a34a, #4ade80)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 14, fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 600,
                  color: scrolled || !isHome ? "#374151" : "white",
                }}>
                  {user.name.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  fontSize: 13,
                  color: "#ef4444",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: 8,
                  transition: "all 0.2s",
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" style={{
              color: scrolled || !isHome ? "#4b5563" : "rgba(255,255,255,0.9)",
              fontWeight: 500,
              fontSize: 15,
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: 8,
              transition: "all 0.2s",
            }}>
              Login
            </Link>
            <Link href="/register" style={{
              backgroundColor: "#16a34a",
              color: "white",
              padding: "10px 22px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(22,163,74,0.35)",
              transition: "all 0.2s",
            }}>
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}