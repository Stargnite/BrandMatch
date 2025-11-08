import { create } from "zustand";

interface SessionUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  userRole: "creator" | "brand" | null;
  setUserRole: (role: "creator" | "brand" | null) => void;
  sessionUser: SessionUser | null;
  setSessionUser: (user: SessionUser | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),
  sessionUser: null,
  setSessionUser: (user) => set({ sessionUser: user }),
}));
