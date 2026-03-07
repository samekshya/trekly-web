"use client";

import React from "react";

type Props = {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InputField({ label, type = "text", placeholder, error, ...rest }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...rest}
        style={{
          padding: "13px 16px",
          borderRadius: 12,
          border: error ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
          backgroundColor: error ? "#fef2f2" : "#f9fafb",
          fontSize: 14,
          color: "#111827",
          outline: "none",
          width: "100%",
          transition: "border 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.border = "1.5px solid #15803d";
          e.target.style.backgroundColor = "#ffffff";
        }}
        onBlur={(e) => {
          e.target.style.border = error ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb";
          e.target.style.backgroundColor = error ? "#fef2f2" : "#f9fafb";
        }}
      />
      {error && (
        <span style={{ fontSize: 12, color: "#ef4444" }}>⚠️ {error}</span>
      )}
    </div>
  );
}