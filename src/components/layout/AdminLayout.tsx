"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setAdminName(parsed.name || "Admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navItems = [
    { href: "/admin/treks", label: "Manage Treks", icon: "" },
    { href: "/admin/users", label: "Manage Users", icon: "👥" },
  ];

  const pageTitle = navItems.find((i) => i.href === pathname)?.label || "Dashboard";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* ===== SIDEBAR ===== */}
      <aside style={{
        width: 260,
        backgroundColor: "#0f172a",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image src="/treklylogo.png" alt="Trekly" width={100} height={100} style={{ objectFit: "contain" }} />
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}></h2>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #16a34a, #4ade80)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: 16,
              boxShadow: "0 2px 8px rgba(22,163,74,0.4)",
              flexShrink: 0,
            }}>
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{adminName}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.12em", padding: "0 12px", marginBottom: 8,
          }}>
            NAVIGATION
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px",
                  borderRadius: 10,
                  marginBottom: 4,
                  backgroundColor: isActive ? "#16a34a" : "transparent",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{
                    fontSize: 14, fontWeight: 600,
                    color: isActive ? "white" : "rgba(255,255,255,0.6)",
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span style={{
                      marginLeft: "auto",
                      width: 6, height: 6,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.6)",
                    }} />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{
          padding: "12px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: 10,
              marginBottom: 4,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(255,255,255,0.06)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"}
            >
              <span style={{ fontSize: 18 }}>🌐</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>View Website</span>
            </div>
          </Link>
          <button onClick={handleLogout} style={{
            width: "100%",
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px", borderRadius: 10,
            border: "none", backgroundColor: "transparent",
            cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239,68,68,0.15)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(239,68,68,0.7)" }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{
        marginLeft: 260,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        minWidth: 0,
      }}>
        {/* Top Bar */}
        <header style={{
          backgroundColor: "white",
          borderBottom: "1px solid #f1f5f9",
          padding: "0 40px",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>
              {pageTitle}
            </h1>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>Welcome back, {adminName}!</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "6px 14px",
              borderRadius: 999,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#16a34a" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>Live</span>
            </div>
            <div style={{
              width: 38, height: 38,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #16a34a, #4ade80)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: 14,
            }}>
              {adminName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: "36px 40px", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;