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
      {/* LEFT - White with centered card */}
      <div style={{
        width: "50%",
        height: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 40px",
      }}>
        {/* Card */}
        <div style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#ffffff",
          borderRadius: 24,
          padding: "40px 40px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          border: "1px solid #f0f0f0",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 0 }}>
            <Image
              src="/treklylogo.png"
              alt="Trekly"
              width={150}
              height={60}
              style={{ objectFit: "contain", marginBottom: 0}}
            />
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 4,
            textAlign: "center",
          }}>
            {title}
          </h1>
          <p style={{
            fontSize: 14,
            color: "#9ca3af",
            marginBottom: 28,
            textAlign: "center",
          }}>
            {subtitle}
          </p>

          {/* Form */}
          {children}

          {/* Footer */}
          {footerText && footerLink && (
            <p style={{
              textAlign: "center",
              fontSize: 13,
              color: "#9ca3af",
              marginTop: 20,
            }}>
              {footerText}{" "}
              <Link href={footerLink} style={{ color: "#15803d", fontWeight: 700, textDecoration: "none" }}>
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* RIGHT - Mountain image */}
      <div style={{ width: "50%", height: "100%", position: "relative", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400"
          alt="Mountains"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(5,46,22,0.85) 0%, rgba(0,0,0,0.4) 100%)",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            padding: "8px 18px",
            borderRadius: 999,
            width: "fit-content",
            border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4ade80" }} />
            <span style={{ color: "white", fontSize: 13, fontWeight: 500 }}>Nepal's #1 Trekking Platform</span>
          </div>

          {/* Bottom */}
          <div>
            <h2 style={{ fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 20 }}>
              Your Next<br />
              <span style={{ color: "#4ade80" }}>Adventure</span><br />
              Awaits
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.7, maxWidth: 360, marginBottom: 40 }}>
              Explore breathtaking trails, expert guides, and unforgettable experiences in the Himalayas.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { value: "500+", label: "Happy Trekkers" },
                { value: "12+", label: "Trek Routes" },
                { value: "100%", label: "Safe & Guided" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 16,
                  padding: "20px 24px",
                  flex: 1,
                }}>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>{stat.value}</p>
                  <p style={{ fontSize: 12, color: "#86efac" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
