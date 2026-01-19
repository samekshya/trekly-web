"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";


import AuthShell from "@/components/layout/AuthShell";
import { InputField } from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { loginSchema, LoginValues, registerSchema, RegisterValues } from "@/lib/schemas/auth";


export default function RegisterPage() {
  const router = useRouter();

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
    await api.post("/auth/register", {
      name: values.fullName,
      email: values.email,
      password: values.password,
    });

    router.push("/login");
  } catch (err: any) {
    console.log(err?.response?.data || err);
    alert(err?.response?.data?.message || "Registration failed");
  }
};


  // const onSubmit = async (values: RegisterValues) => {
  //   console.log("Register:", values);
  //   router.push("/login");
  // };

  return (
    <AuthShell title="Create account" subtitle="Register to get started">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gap: 12 }}
      >
        <InputField
          label="Full name"
          placeholder="Your name"
          {...register("fullName")}
          error={errors.fullName?.message}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />

        <InputField
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
