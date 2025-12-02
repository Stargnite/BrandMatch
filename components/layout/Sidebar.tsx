"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Plus,
  Briefcase,
  FileText,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { UserButton } from "@clerk/nextjs";
import { UserAvatar } from "@/components/ui/user-avatar";

interface NavItem {
  label: string;
  href: string;
  icon: typeof Home;
  roles?: ("CREATOR" | "BRAND" | "ADMIN")[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Explore", href: "/campaigns", icon: Search },
  {
    label: "Create Campaign",
    href: "/campaigns/new",
    icon: Plus,
    roles: ["BRAND"],
  },
  {
    label: "My Campaigns",
    href: "/campaigns/my-campaigns",
    icon: Briefcase,
    roles: ["BRAND"],
  },
  { label: "Applications", href: "/applications", icon: FileText },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, userRole, sessionUser } = useAppStore();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!userRole) return false;
    return item.roles.includes(userRole.toUpperCase() as "CREATOR" | "BRAND");
  });

  return (
    <aside
      className={cn(
        "fixed lg:static left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform",
        // "sticky left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="text-xl font-bold">
            BrandMatch
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t p-4">
          {sessionUser ? (
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <UserAvatar
                src={sessionUser.avatarUrl}
                name={sessionUser.name}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{sessionUser.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole || "User"}
                </p>
              </div>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

