



"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/logoutAction";
import { useAuthStore } from "@/lib/zustandStore/useAuthStore";

export function Logout() {
  const router = useRouter();

  const logout = async () => {
    await logoutAction();

    // clear Zustand
    useAuthStore.getState().logout();

    router.push("/login");
  };

  return logout;
}