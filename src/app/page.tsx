"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Trek {
  _id: string;
  name: string;
  location: string;
  duration: number;
  difficulty: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function HomePage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/treks?limit=6");
        const data = await res.json();
        setTreks(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTreks();
  }, []);

  const difficultyColor = (d: string) => {
    if (d === "Easy") return { bg: "#dcfce7", color: "#16a34a" };
    if (d === "Moderate") return { bg: "#fef9c3", color: "#ca8a04" };
    return { bg: "#fee2e2", color: "#dc2626" };
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", backgroundColor: "#ffffff" }}>

      {/* ===== HERO ===== */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800"
          alt="Himalayas"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)",
        }} />

        {/* Hero Content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end", alignItems: "flex-start",
          padding: "0 80px 80px",
          maxWidth: 1400, margin: "0 auto", left: 0, right: 0,
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "8px 18px", borderRadius: 999, marginBottom: 24,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
            <span style={{ color: "white", fontSize: 13, fontWeight: 500 }}>Trusted by 500+ trekkers</span>
          </div>

          <h1 style={{
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.0,
            marginBottom: 24,
            letterSpacing: "-0.03em",
            maxWidth: 800,
          }}>
            Discover<br />
            <span style={{
              background: "linear-gradient(90deg, #4ade80, #86efac)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Nepal's</span><br />
            Hidden Peaks
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 18, lineHeight: 1.7,
            maxWidth: 480, marginBottom: 40,
          }}>
            Expertly guided treks through the world's most breathtaking mountain landscapes. Your adventure begins here.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/treks" style={{
              backgroundColor: "#16a34a",
              color: "white",
              padding: "16px 36px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(22,163,74,0.5)",
              transition: "all 0.2s",
            }}>
              Explore Treks →
            </Link>
            <Link href="/register" style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              color: "white",
              padding: "16px 36px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.25)",
            }}>
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.1em" }}>SCROLL</span>
          <div style={{
            width: 1, height: 48,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
          }} />
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section style={{
        backgroundColor: "#0f172a",
        padding: "32px 80px",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 32, textAlign: "center",
        }}>
          {[
            { value: "12+", label: "Trek Routes" },
            { value: "500+", label: "Happy Trekkers" },
            { value: "8+", label: "Years Experience" },
            { value: "100%", label: "Safe & Guided" },
          ].map((stat) => (
            <div key={stat.label}>
              <p style={{ fontSize: 36, fontWeight: 900, color: "#4ade80", marginBottom: 4 }}>{stat.value}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED TREKS ===== */}
      <section style={{ padding: "100px 80px", backgroundColor: "#f8fafc", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", letterSpacing: "0.1em", marginBottom: 8 }}>
              FEATURED TREKS
            </p>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Popular Adventures
            </h2>
          </div>
          <Link href="/treks" style={{
            color: "#16a34a", fontWeight: 700, textDecoration: "none",
            fontSize: 15, display: "flex", alignItems: "center", gap: 4,
          }}>
            View all treks →
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                height: 380, borderRadius: 20,
                backgroundColor: "#e2e8f0",
                animation: "pulse 1.5s infinite",
              }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {treks.map((trek, index) => {
              const diff = difficultyColor(trek.difficulty);
              return (
                <Link key={trek._id} href={`/treks/${trek._id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    backgroundColor: "white",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                    transition: "transform 0.25s, box-shadow 0.25s",
                    cursor: "pointer",
                    border: "1px solid #f1f5f9",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                      {trek.imageUrl ? (
                        <img
                          src={trek.imageUrl}
                          alt={trek.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🏔️</div>
                      )}
                      {/* Difficulty badge */}
                      <div style={{
                        position: "absolute", top: 16, left: 16,
                        backgroundColor: diff.bg, color: diff.color,
                        padding: "4px 12px", borderRadius: 999,
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {trek.difficulty}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "20px 24px 24px" }}>
                      <h3 style={{
                        fontSize: 18, fontWeight: 800,
                        color: "#0f172a", marginBottom: 6,
                        letterSpacing: "-0.01em",
                      }}>
                        {trek.name}
                      </h3>
                      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
                        📍 {trek.location} · {trek.duration} days
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Starting from</p>
                          <p style={{ fontSize: 22, fontWeight: 900, color: "#16a34a" }}>
                            Rs. {trek.price?.toLocaleString()}
                          </p>
                        </div>
                        <div style={{
                          backgroundColor: "#f0fdf4",
                          color: "#16a34a",
                          padding: "10px 18px",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 700,
                        }}>
                          View →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section style={{ padding: "100px 80px", backgroundColor: "#ffffff", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", letterSpacing: "0.1em", marginBottom: 8 }}>WHY TREKLY</p>
          <h2 style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
            The Trekly Difference
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {[
            { icon: "🧭", title: "Expert Local Guides", desc: "Our guides are certified professionals with decades of experience navigating Nepal's most challenging terrains." },
            { icon: "🛡️", title: "Safety First", desc: "Every trek includes comprehensive safety protocols, emergency equipment, and real-time weather monitoring." },
            { icon: "🌿", title: "Eco-Friendly", desc: "We practice Leave No Trace principles and actively support local conservation efforts in every region." },
            { icon: "💰", title: "Best Price Guarantee", desc: "We match any competitor's price for the same trek package. Your adventure shouldn't break the bank." },
            { icon: "📱", title: "24/7 Support", desc: "Our team is available around the clock before, during, and after your trek for complete peace of mind." },
            { icon: "🏆", title: "Award Winning", desc: "Recognized as Nepal's best trekking platform for 3 consecutive years by the Nepal Tourism Board." },
          ].map((item) => (
            <div key={item.title} style={{
              padding: "32px",
              borderRadius: 20,
              border: "1px solid #f1f5f9",
              backgroundColor: "#f8fafc",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "#fff";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f8fafc";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ margin: "0 80px 100px", borderRadius: 28, overflow: "hidden", position: "relative" }}>
        <img
          src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1600"
          alt="Trek"
          style={{ width: "100%", height: 400, objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(5,46,22,0.95) 0%, rgba(5,46,22,0.6) 60%, transparent 100%)",
          display: "flex", alignItems: "center",
          padding: "0 72px",
        }}>
          <div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: "white", marginBottom: 16, lineHeight: 1.1 }}>
              Ready for your<br />next adventure?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 32, maxWidth: 400 }}>
              Join thousands of trekkers who've discovered Nepal's most beautiful trails with Trekly.
            </p>
            <Link href="/register" style={{
              backgroundColor: "#4ade80",
              color: "#0f172a",
              padding: "16px 36px",
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 16,
              textDecoration: "none",
              display: "inline-block",
            }}>
              Start Your Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ backgroundColor: "#0f172a", padding: "60px 80px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <img src="/treklylogo.png" alt="Trekly" style={{ height: 36, objectFit: "contain" }} />
                <span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>Trekly</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
                Nepal's premier trekking platform, connecting adventurers with the world's most breathtaking mountain trails.
              </p>
            </div>
            {[
              { title: "Explore", links: ["All Treks", "Easy Treks", "Hard Treks", "Moderate Treks"] },
              { title: "Company", links: ["About Us", "Our Guides", "Safety", "Blog"] },
              { title: "Account", links: ["Login", "Register", "Dashboard", "Favourites"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16, letterSpacing: "0.05em" }}>{col.title}</h4>
                {col.links.map((link) => (
                  <p key={link} style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 10, cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#4ade80")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                  >{link}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>© 2026 Trekly. All rights reserved.</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Made with ❤️ in Nepal</p>
          </div>
        </div>
      </footer>

    </div>
  );
}