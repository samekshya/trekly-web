import Link from "next/link";

export default function Navbar() {
  return (
    <header
      style={{
        padding: "14px 20px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        href="/"
        style={{ fontWeight: 900, textDecoration: "none", color: "#111827" }}
      >
        Trekly Web
      </Link>

      <nav style={{ display: "flex", gap: 14 }}>
        <Link href="/login" style={{ textDecoration: "none", color: "#111827" }}>
          Login
        </Link>
        <Link
          href="/register"
          style={{ textDecoration: "none", color: "#111827" }}
        >
          Register
        </Link>
        <Link
          href="/auth/dashboard"
          style={{ textDecoration: "none", color: "#111827" }}
        >
          Dashboard
        </Link>
      </nav>
    </header>
  );
}
