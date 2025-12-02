"use client";

import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppStore } from "@/lib/store";
import { syncCurrentUser, getCurrentUser } from "@/app/actions/user";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { setSessionUser, setUserRole, isSidebarOpen, toggleSidebar } = useAppStore();

  useEffect(() => {
    async function loadUser() {
      // Sync user to database
      const syncResult = await syncCurrentUser();
      if (syncResult.success) {
        setUserRole(syncResult.user.role.toLowerCase() as "creator" | "brand");
      }

      // Get full user data
      const userResult = await getCurrentUser();
      if (userResult.success && userResult.user) {
        setSessionUser({
          id: userResult.user.id,
          name: userResult.user.name,
          avatarUrl: userResult.user.avatarUrl || undefined,
        });
        setUserRole(userResult.user.role.toLowerCase() as "creator" | "brand");
      }
    }

    loadUser();
  }, [setSessionUser, setUserRole]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all",
          isSidebarOpen && "lg:ml-64"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

