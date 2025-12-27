"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, ...rest }: Props) {
  return (
    <button
      {...rest}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        fontWeight: 700,
        background: "#111827",
        color: "white",
      }}
    >
      {children}
    </button>
  );
}
