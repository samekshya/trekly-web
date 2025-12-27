import React from "react";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 60px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <section style={{ width: "100%", maxWidth: 420 }}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </section>
    </main>
  );
}
