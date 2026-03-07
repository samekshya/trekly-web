"use client";
import React from "react";

type Props = {
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InputField({ label, type = "text", placeholder, error, ...rest }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...rest}
        style={{
          padding: "12px 0",
          borderRadius: 0,
          border: "none",
          borderBottom: error ? "2px solid #ef4444" : "1.5px solid #e5e7eb",
          backgroundColor: "transparent",
          fontSize: 15,
          color: "#111827",
          outline: "none",
          width: "100%",
        }}
        onFocus={(e) => {
          e.target.style.borderBottom = "2px solid #15803d";
        }}
        onBlur={(e) => {
          e.target.style.borderBottom = error ? "2px solid #ef4444" : "1.5px solid #e5e7eb";
        }}
      />
      {error && (
        <span style={{ fontSize: 12, color: "#ef4444" }}>⚠️ {error}</span>
      )}
    </div>
  );
}