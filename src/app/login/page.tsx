"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api/api";
import AuthShell from "@/components/layout/AuthShell";
import { InputField } from "@/components/ui/InputField";
import { loginSchema, LoginValues } from "@/lib/schemas/auth";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setError("");
      const res = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        router.push("/admin/treks");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <AuthShell
      title="Welcome back "
      subtitle="Login to your Trekly account"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Register here"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <InputField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <div style={{ textAlign: "right", marginTop: -12 }}>
  <a href="/forgot-password" style={{
    fontSize: 13, color: "#16a34a", textDecoration: "none", fontWeight: 600,
  }}>
    Forgot password?
  </a>
</div>


        <button
  type="submit"
  disabled={isSubmitting}
  style={{
    width: "100%",
    padding: "14px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: isSubmitting ? "not-allowed" : "pointer",
    opacity: isSubmitting ? 0.7 : 1,
    marginTop: 8,
    letterSpacing: "0.02em",
    boxShadow: "0 4px 14px rgba(22,163,74,0.4)",
    transition: "all 0.2s",
  }}
>
  {isSubmitting ? "Signing in..." : "Login"}
</button>
      </form>
    </AuthShell>
  );
}