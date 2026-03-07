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
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* ===== LEFT PANEL ===== */}
      <div
        style={{
          width: "45%",
          height: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 40,
              textDecoration: "none",
            }}
          >
            <Image
              src="/treklylogo.png"
              alt="Trekly"
              width={180}
              height={180}
              style={{ objectFit: "contain" }}
            />
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#15803d",
              }}
            >
              
            </span>
          </Link>

          {/* Title */}
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 8,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#9ca3af",
              marginBottom: 20,
            }}
          >
            {subtitle}
          </p>

          {/* Form */}
          {children}

          {/* Footer */}
          {footerText && footerLink && (
            <p
              style={{
                textAlign: "center",
                fontSize: 14,
                color: "#9ca3af",
                marginTop: 28,
              }}
            >
              {footerText}{" "}
              <Link
                href={footerLink}
                style={{
                  color: "#15803d",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div
        style={{
          width: "55%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400"
          alt="Mountains"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(5,46,22,0.85) 0%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 56px",
          }}
        >
          {/* Top Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              padding: "8px 18px",
              borderRadius: 999,
              width: "fit-content",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#4ade80",
              }}
            />
            <span style={{ color: "white", fontSize: 13, fontWeight: 500 }}>
              Nepal's #1 Trekking Platform
            </span>
          </div>

          {/* Bottom Content */}
          <div>
            <h2
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Your Next
              <br />
              <span style={{ color: "#4ade80" }}>Adventure</span>
              <br />
              Awaits
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 360,
                marginBottom: 15,
              }}
            >
              Explore breathtaking trails, expert guides, and unforgettable
              experiences in the Himalayas.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { value: "500+", label: "Happy Trekkers" },
                { value: "12+", label: "Trek Routes" },
                { value: "100%", label: "Safe & Guided" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 16,
                    padding: "20px 24px",
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: "white",
                      marginBottom: 4,
                    }}
                  >
                    {stat.value}
                  </p>
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