import { create } from "zustand";

interface AppState {
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    userRole: "creator" | "brand" | null;
    setUserRole: (role: "creator" | "brand") => void;
}

export const useAppStore = create<AppState>((set) => ({
    isSidebarOpen: false,
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    userRole: null,
    setUserRole: (role) => set({ userRole: role }),
}));
