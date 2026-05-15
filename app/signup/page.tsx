"use client";

import { useState } from "react";

import Image from "next/image";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { CommandIcon } from "lucide-react";

import { signupAction } from "@/actions/Auth";

import { useAuthStore } from "@/lib/zustandStore/useAuthStore";

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

import LoginImage from "@/app/img/sbs-login.jpg";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const formData = new FormData(e.currentTarget);

      const email = formData.get("email") as string;

      const password = formData.get("password") as string;

      const result = await signupAction({
        email,
        password,
      });

      if (!result.success) {
        setError(result.message);

        return;
      }
      console.log("result from signup page : - ", result);

      const loginUser = result.data;

      const loggedInUser = result.data?.user;

      if (!loginUser || "message" in loginUser || !loggedInUser) {
        setError("Signup failed");

        return;
      }

      useAuthStore.getState().setUser({
        id: loggedInUser.id,
        email: loggedInUser.email,
        role: loggedInUser.role,
        verified: loggedInUser.verified,
        loading: false,
      });
      router.push("/");
    } catch (error) {
      console.error(error);

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-3">
      {/* LEFT IMAGE */}
      <div className="relative hidden lg:col-span-2 lg:block">
        <Image
          src={LoginImage}
          alt="Salon Booking System"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex flex-col justify-between p-6 md:p-10">
        {/* LOGO */}
        <div className="flex justify-center lg:justify-start">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CommandIcon className="size-4" />
            </div>
            Salon Booking Sys.
          </Link>
        </div>

        {/* FORM */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6")}>
              <FieldGroup>
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold">Create Account</h1>

                  <p className="text-sm text-muted-foreground">
                    Enter your credentials to continue
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </Field>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Field>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/" className="font-medium underline">
                    Login up
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
