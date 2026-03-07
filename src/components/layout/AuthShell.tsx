import React from "react";
import Image from "next/image";
import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}: AuthShellProps) {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", zIndex: 9999 }}>
      
      {/* LEFT */}
      <div style={{
        width: "50%",
        height: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "60px",
        alignItems: "center",
        padding: "40px 60px",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 20px" }}>
          
          {/* Big Logo */}
          <Link href="/">
            <Image
              src="/treklylogo.png"
              alt="Trekly"
              width={160}
              height={160}
              style={{ objectFit: "contain", marginBottom: 8 }}
            />
          </Link>

          {/* Title */}
          <h1 style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#0f172a",
            marginBottom: 4,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}>
            {title}
          </h1>
          <p style={{
            fontSize: 14,
            color: "#94a3b8",
            marginBottom: 32,
            textAlign: "center",
          }}>
            {subtitle}
          </p>

          {/* Form - full width */}
          <div style={{ width: "100%" }}>
            {children}
          </div>

          {/* Footer */}
          {footerText && footerLink && (
            <p style={{
              textAlign: "center",
              fontSize: 13,
              color: "#94a3b8",
              marginTop: 24,
            }}>
              {footerText}{" "}
              <Link href={footerLink} style={{ color: "#16a34a", fontWeight: 700, textDecoration: "none" }}>
                {footerLinkText}
              </Link>
            </p>
          )}

          {/* Bottom copyright */}
          <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: 48, textAlign: "center" }}>
            © 2026 Trekly. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ width: "50%", height: "100%", position: "relative", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400"
          alt="Mountains"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(5,46,22,0.88) 0%, rgba(0,0,0,0.35) 100%)",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            padding: "10px 20px",
            borderRadius: 999,
            width: "fit-content",
            border: "1px solid rgba(255,255,255,0.18)",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              backgroundColor: "#4ade80",
              boxShadow: "0 0 8px #4ade80",
            }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500 }}>
              Nepal's #1 Trekking Platform
            </span>
          </div>

          {/* Bottom */}
          <div>
            {/* Testimonial */}
            <div style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 32,
              maxWidth: 400,
            }}>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.7, fontStyle: "italic", marginBottom: 12 }}>
                "Trekly made our Everest Base Camp trek completely stress-free. The best trekking platform in Nepal!"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #4ade80, #16a34a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: "white",
                }}>S</div>
                <div>
                  <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Sarah K.</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Trekked EBC, 2025</p>
                </div>
                <div style={{ marginLeft: "auto", color: "#fbbf24", fontSize: 14 }}>★★★★★</div>
              </div>
            </div>

            <h2 style={{
              fontSize: 50,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.05,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}>
              Your Next<br />
              <span style={{
                background: "linear-gradient(90deg, #4ade80, #86efac)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Adventure</span><br />
              Awaits
            </h2>

            <p style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 15,
              lineHeight: 1.7,
              maxWidth: 340,
              marginBottom: 32,
            }}>
              Join thousands of trekkers exploring Nepal's most breathtaking mountain trails.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { value: "500+", label: "Happy Trekkers", icon: "🧗" },
                { value: "12+", label: "Trek Routes", icon: "🏔️" },
                { value: "100%", label: "Safe & Guided", icon: "🛡️" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  flex: 1,
                }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{stat.icon}</div>
                  <p style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 2 }}>{stat.value}</p>
                  <p style={{ fontSize: 11, color: "#86efac", fontWeight: 500 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}