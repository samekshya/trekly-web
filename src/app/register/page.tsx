"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api/api";
import AuthShell from "@/components/layout/AuthShell";
import { InputField } from "@/components/ui/InputField";
import { registerSchema, RegisterValues } from "@/lib/schemas/auth";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      setError("");
      await api.post("/auth/register", {
        name: values.fullName,
        email: values.email,
        password: values.password,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthShell
      title="Create account 🏔️"
      subtitle="Join Trekly and start your adventure"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login here"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <InputField
          label="Full name"
          placeholder="Your name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

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

        <InputField
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-base hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthShell>
  );
}