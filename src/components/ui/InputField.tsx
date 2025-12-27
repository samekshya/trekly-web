"use client";

import React from "react";

type Props = {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InputField({
  label,
  type = "text",
  placeholder,
  error,
  ...rest
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontWeight: 600, fontSize: 14 }}>{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        {...rest}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: error ? "1px solid #e11d48" : "1px solid #d1d5db",
          outline: "none",
        }}
      />

      {error ? (
        <span style={{ color: "#e11d48", fontSize: 12 }}>{error}</span>
      ) : null}
    </div>
  );
}
