"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthShell from "@/components/layout/AuthShell";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { loginSchema, LoginValues } from "@/lib/schemas/auth";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    console.log(values);
    router.push("/auth/dashboard");
  };

  return (
    <AuthShell title="Welcome back" subtitle="Login to continue">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gap: 12 }}
      >
        <InputField
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <InputField
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" disabled={isSubmitting}>
          Login
        </Button>
      </form>
    </AuthShell>
  );
}
