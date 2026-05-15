"use client";

import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
} from "lucide-react";
import {
  MessageSquareIcon,
  CalendarCheckIcon,
  BadgePercentIcon,
  ScissorsIcon,
  ReceiptIcon,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/zustandStore/useAuthStore";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.in",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Inquery",
      url: "/dashboard/inquery",
      icon: <MessageSquareIcon />,
    },
    {
      title: "Booking",
      url: "/dashboard/booking",
      icon: <CalendarCheckIcon />,
    },
    {
      title: "Discount",
      url: "/dashboard/discount",
      icon: <BadgePercentIcon />,
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: <UsersIcon />,
    },
    {
      title: "Services",
      url: "/dashboard/services",
      icon: <ScissorsIcon />,
    },
  ],
  // navMain: [
  //   {
  //     title: "Dashboard",
  //     url: "/dashboard",
  //     icon: <LayoutDashboardIcon />,
  //   },
  //   {
  //     title: "Inquery",
  //     url: "/dashboard/inquery",
  //     icon: <MessageSquareIcon />,
  //   },
  //   {
  //     title: "Booking",
  //     url: "/dashboard/booking",
  //     icon: <CalendarCheckIcon />,
  //   },
  //   {
  //     title: "Discount",
  //     url: "/dashboard/discount",
  //     icon: <BadgePercentIcon />,
  //   },
  //   // {
  //   //   title: "Team",
  //   //   url: "/dashboard/team",
  //   //   icon: <UsersIcon />,
  //   // },
  //   {
  //     title: "Services",
  //     url: "/dashboard/services",
  //     icon: <ScissorsIcon />,
  //   },
  // ],
  navClouds: [
    {
      title: "Capture",
      icon: <CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "/dashboard/help",
      icon: <CircleHelpIcon />,
    },
    // {
    //   title: "Search",
    //   url: "/dashboard/search",
    //   icon: <SearchIcon />,
    // },
  ],
  documents: [
    {
      name: "Add booking",
      url: "/dashboard/booking/create-booking",
      icon: <DatabaseIcon />,
    },
    // {
    //   name: "Reports",
    //   url: "#",
    //   icon: <FileChartColumnIcon />,
    // },
    // {
    //   name: "Word Assistant",
    //   url: "#",
    //   icon: <FileIcon />,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);
  // console.log("User in AppSidebar:", user);

  const userData = {
    role: user?.role || "Guest",
    email: user?.email || "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-1.5 py-2 text-sm font-medium data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground"
              >
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">
                  Salon Booking Sys.
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} where="sidebar" />
      </SidebarFooter>
    </Sidebar>
  );
}
