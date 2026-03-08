"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [time, setTime] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setAdminName(parsed.name || "Admin");
    }
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navItems = [
  { href: "/admin/analytics", label: "Analytics", icon: "📊", sub: "Overview & insights" },
  { href: "/admin/treks", label: "Treks", icon: "🏔️", sub: "Manage all treks" },
  { href: "/admin/users", label: "Users", icon: "👥", sub: "Manage accounts" },
];

  const pageTitle = navItems.find((i) => i.href === pathname)?.label || "Dashboard";

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#070d0f",
      fontFamily: "'DM Sans', 'Outfit', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .nav-item { transition: all 0.2s ease; }
        .nav-item:hover { background: rgba(255,255,255,0.05) !important; }
        .action-btn { transition: all 0.18s ease; }
        .action-btn:hover { transform: translateY(-1px); }
        .table-row { transition: background 0.15s ease; }
        .table-row:hover { background: rgba(255,255,255,0.03) !important; }
        .stat-card { transition: all 0.2s ease; }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(52,211,153,0.3) !important; }
      `}</style>

      {/* ===== SIDEBAR ===== */}
      <aside style={{
        width: 240,
        background: "linear-gradient(180deg, #0d1117 0%, #0a0f0a 100%)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        top: 0, left: 0,
        zIndex: 100,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}>

        {/* Logo */}
        <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #059669, #34d399)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(52,211,153,0.3)",
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <Image src="/treklylogo.png" alt="Trekly" width={28} height={28} style={{ objectFit: "contain" }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>Trekly</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", fontWeight: 500 }}>ADMIN CONSOLE</p>
            </div>
          </div>
        </div>

        {/* Admin profile */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: "14px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #059669, #34d399)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: 14,
              flexShrink: 0,
            }}>
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminName}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#34d399" }} />
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "0.14em", padding: "0 12px", marginBottom: 10 }}>
            MANAGEMENT
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "block", marginBottom: 2 }}>
                <div className="nav-item" style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px",
                  borderRadius: 10,
                  backgroundColor: isActive ? "rgba(52,211,153,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(52,211,153,0.2)" : "1px solid transparent",
                  position: "relative",
                }}>
                  {isActive && (
                    <div style={{
                      position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                      width: 3, height: 20, borderRadius: "0 2px 2px 0",
                      backgroundColor: "#34d399",
                    }} />
                  )}
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#34d399" : "rgba(255,255,255,0.55)" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{item.sub}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Link href="/" style={{ textDecoration: "none", display: "block", marginBottom: 2 }}>
            <div className="nav-item" style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 10,
              border: "1px solid transparent",
            }}>
              <span style={{ fontSize: 14 }}>🌐</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>View Website</span>
            </div>
          </Link>
          <button onClick={handleLogout} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "11px 14px", borderRadius: 10,
            border: "1px solid transparent", background: "none", cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239,68,68,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.15)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
            }}
          >
            <span style={{ fontSize: 14 }}>🚪</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(239,68,68,0.6)" }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          background: "rgba(7,13,15,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "0 40px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <h1 style={{
                fontSize: 17, fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.01em",
              }}>
                {pageTitle}
              </h1>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                Trekly Admin · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Clock */}
            <div style={{
              padding: "6px 14px",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>{time}</span>
            </div>

            {/* Status */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 8,
              backgroundColor: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.15)",
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                backgroundColor: "#34d399",
                boxShadow: "0 0 6px #34d399",
              }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#34d399", letterSpacing: "0.05em" }}>LIVE</span>
            </div>

            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #059669, #34d399)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: 13,
              boxShadow: "0 0 12px rgba(52,211,153,0.2)",
            }}>
              {adminName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{
          flex: 1,
          padding: "36px 40px",
          minWidth: 0,
          color: "white",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;