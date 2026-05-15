/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/zustandStore/useAuthStore";
import { getCurrentUser } from "@/actions/getCurrentUser";

import { TooltipProvider } from "@/components/ui/tooltip";
// import TestSocket from "@/lib/socketClient";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import Loading from "./loading";
import { getBusinessProfile } from "@/actions/businesssAction";
import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoading = useAuthStore((state) => state.isLoading);
  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      console.log(
        "User loaded in RootLayout:",
        typeof user === "string" ? user : user?.id,
      ); // Debugging log
      // if (user) {
      //   const authStore = useAuthStore.getState();
      //   authStore.setUser(user);

      //   console.log("User set in useAuthStore in RootLayout:", authStore); // Debugging log
      // }
      const businessProfile = await getBusinessProfile();

      console.log("Business Profile found in RootLayout:", businessProfile); // Debugging log

      if (businessProfile.success && businessProfile.businessProfile) {
        useBusinessStore
          .getState()
          .setBusiness(businessProfile.businessProfile);

        console.log("Business in store:", useBusinessStore.getState().business);
      }

      if (user) {
        useAuthStore.getState().setUser(user as any);

        console.log(
          "Updated user:",
          useAuthStore.getState().user, // ✅ fresh state
        );
      }
      useAuthStore.getState().setLoading(false);
    }

    loadUser();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <TooltipProvider>
        {/* <TestSocket /> */}
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            {children}
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
}
