"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoginAction as loginAction } from "@/actions/Auth";
import { useAuthStore } from "@/lib/zustandStore/useAuthStore";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    console.log("Form Data:", Object.fromEntries(formData.entries())); // Debugging log

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Email:", email); // Debugging log
    console.log("Password:", password); // Debugging log

    try {
      const result = await loginAction({ email, password });
      console.log("Login Result:", result); // Debugging log
      const loginUser = result.res;

      if (!loginUser || "message" in loginUser) {
        throw new Error("User data is missing from login response");
      }

      const user = {
        id: loginUser.id,
        email: loginUser.email,
        role: loginUser.role,
        verified: loginUser.verified,
        loading: false,
      };

      useAuthStore.getState().setUser(user);

      // success
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
        </Field>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Field>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="underline">
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
