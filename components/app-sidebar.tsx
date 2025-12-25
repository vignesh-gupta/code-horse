"use client";

import { cn } from "@/lib/utils";
import { useSession } from "@/modules/auth/lib/auth-client";
import {
  BookOpen,
  DollarSign,
  Github,
  LogOutIcon,
  Moon,
  Settings2,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Logout from "@/modules/auth/components/logout";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BookOpen,
  },
  {
    title: "Repository",
    href: "/dashboard/repositories",
    icon: Github,
  },
  {
    title: "Reviews",
    href: "/dashboard/reviews",
    icon: BookOpen,
  },
  {
    title: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: DollarSign,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings2,
  },
];

const AppSideBar = () => {
  const { theme, setTheme } = useTheme();

  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/dashboard");
  };

  if (!session) {
    return null;
  }

  const user = session.user;

  const userName = user?.name || "Guest",
    userEmail = user?.email || "",
    userInitials = userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex flex-col gap-4 px-2 py-6">
          <div className="flex items-center gap-2 px-3 py-4 transition-colors rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent/70">
            <div className="flex flex-col items-center justify-center rounded-lg size-12 bg-primary text-primary-foreground shrink-0">
              <Github className="size-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-wide text-sidebar-foreground">
                Connected Account
              </p>
              <p className="text-sm font-medium text-sidebar-foreground/90">
                @{userName}
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-col gap-1 px-3 py-6">
        <div className="mb-2">
          <p className="px-3 mb-3 text-xs font-semibold tracking-widest uppercase text-sidebar-foreground/60">
            Menu
          </p>
        </div>

        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={cn(
                  "h-11 rounded-lg transition-all duration-200 px-4",
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/60"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="size-5 shrink-0" />
                <span className="text-sm font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="rounded-lg data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
              >
                <Avatar className="rounded-lg size-10 shrink-0 outline-hidden">
                  <AvatarImage src={user?.image || ""} alt={userName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>

                <div className="grid flex-1 min-w-0 text-sm leading-relaxed text-left">
                  <span className="text-base font-semibold truncate">
                    {userName}
                  </span>
                  <span className="text-sm font-normal truncate text-sidebar-foreground/70">
                    {userEmail}
                  </span>
                </div>
              </SidebarMenuButton>
            }
          />

          <DropdownMenuContent
            className="rounded-lg w-80"
            align="end"
            side="right"
            sideOffset={8}
          >
            <div className="flex items-center gap-3 p-4 rounded-t-lg bg-sidebar-accent/30">
              <Avatar className="rounded-lg size-10 shrink-0 outline-hidden">
                <AvatarImage src={user?.image || ""} alt={userName} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 min-w-0 text-sm leading-relaxed text-left">
                <span className="text-base font-semibold truncate">
                  {userName}
                </span>
                <span className="text-sm font-normal truncate text-sidebar-foreground/70">
                  {userEmail}
                </span>
              </div>
            </div>

            <div className="px-2 py-3">
              <DropdownMenuItem
                className="flex items-center w-full gap-3 px-3 py-3 text-sm font-medium transition-colors rounded-md cursor-pointer hover:bg-sidebar-accent/50"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <>
                    <Moon className="shrink-0 size-4" /> Dark mode
                  </>
                ) : (
                  <>
                    <Sun className="shrink-0 size-4" /> Light mode
                  </>
                )}
              </DropdownMenuItem>

              <Logout>
                <DropdownMenuItem className="flex items-center w-full gap-3 px-3 py-3 my-1 text-sm font-medium rounded-md cursor-pointer hover:bg-red-500/50">
                  <LogOutIcon className="shrink-0 size-4" /> Sign out
                </DropdownMenuItem>
              </Logout>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
