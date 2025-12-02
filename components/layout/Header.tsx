"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { useAppStore } from "@/lib/store";

export function Header() {
  const { toggleSidebar } = useAppStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-accent"
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search campaigns, creators..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* User menu */}
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}



