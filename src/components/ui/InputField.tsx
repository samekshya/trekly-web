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
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        {...rest}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          error
            ? "border-red-400 bg-red-50 focus:ring-red-400"
            : "border-gray-200 bg-gray-50 hover:border-gray-300"
        }`}
      />

      {error && (
        <span className="text-red-500 text-xs flex items-center gap-1">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}