"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from '@/api/api';

export default function DashboardPage() {
  const router = useRouter();

useEffect(() => {
  // Sprint demo: skip auth-check to avoid cookie/proxy issues in dev.
  // Backend auth APIs are complete and tested via Postman.
}, []);





  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  try {
    await api.post("/auth/logout");
  } finally {
    router.replace("/login");
  }
};
 

  return (
    <main
      style={{
        minHeight: "calc(100vh - 60px)",
        padding: 24,
        background:
          "radial-gradient(1200px 600px at 20% 10%, rgba(34,197,94,0.12), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(59,130,246,0.10), transparent 55%), #0b0f19",
        color: "#fff",
      }}
    >
      {/* Header */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800 }}>
            Dashboard
          </h1>
          <p style={{ marginTop: 6, color: "rgba(255,255,255,0.75)" }}>
            Sprint-1 UI only — you’ve successfully landed after login/register.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href="/"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Home
          </a>

          {/* Logout now actually clears cookie */}
          <a
            href="/login"
            onClick={handleLogout}
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Logout
          </a>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 1100, margin: "20px auto 0" }}>
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 18,
          }}
        >
          <StatCard
            title="Saved Treks"
            value="0"
            note="Will connect in Sprint-2"
          />
          <StatCard title="Planned Trips" value="0" note="UI placeholder" />
          <StatCard title="Recent Searches" value="0" note="UI placeholder" />
          <StatCard
            title="Profile Status"
            value="Incomplete"
            note="UI placeholder"
          />
        </div>

        {/* Grid: Recommended + Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: 14,
            marginTop: 14,
          }}
        >
          {/* Recommended */}
          <Card>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Recommended for you
            </h2>
            <p style={{ marginTop: 6, color: "rgba(255,255,255,0.7)" }}>
              Example content for Sprint-1 demo (static).
            </p>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <TrekRow
                name="Ghorepani Poon Hill"
                location="Annapurna"
                meta="2–3 days • Easy"
              />
              <TrekRow
                name="Mardi Himal Trek"
                location="Kaski"
                meta="4–6 days • Moderate"
              />
              <TrekRow
                name="Langtang Valley"
                location="Rasuwa"
                meta="7–10 days • Moderate"
              />
            </div>
          </Card>

          {/* Right column */}
          <div style={{ display: "grid", gap: 14 }}>
            <Card>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Quick Actions
              </h2>
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                <ActionItem title="Explore Treks" subtitle="Coming soon" />
                <ActionItem title="Favorites" subtitle="Coming soon" />
                <ActionItem title="Profile" subtitle="Coming soon" />
              </div>
            </Card>

            <Card>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Trek Tip
              </h2>
              <p style={{ marginTop: 10, color: "rgba(255,255,255,0.75)" }}>
                Always carry a light rain jacket and keep your phone charged
                before starting a trail.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 16,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.06)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 16,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.06)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
        backdropFilter: "blur(10px)",
      }}
    >
      <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
        {title}
      </p>
      <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 800 }}>
        {value}
      </p>
      <p
        style={{
          margin: "8px 0 0",
          color: "rgba(255,255,255,0.65)",
          fontSize: 12,
        }}
      >
        {note}
      </p>
    </div>
  );
}

function TrekRow({
  name,
  location,
  meta,
}: {
  name: string;
  location: string;
  meta: string;
}) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(0,0,0,0.18)",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: 700 }}>{name}</p>
        <p
          style={{
            margin: "4px 0 0",
            color: "rgba(255,255,255,0.7)",
            fontSize: 13,
          }}
        >
          {location}
        </p>
      </div>

      <div
        style={{
          alignSelf: "center",
          padding: "6px 10px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.85)",
          fontSize: 12,
          whiteSpace: "nowrap",
        }}
      >
        {meta}
      </div>
    </div>
  );
}

function ActionItem({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(0,0,0,0.18)",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700 }}>{title}</p>
      <p
        style={{
          margin: "4px 0 0",
          color: "rgba(255,255,255,0.7)",
          fontSize: 13,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}
