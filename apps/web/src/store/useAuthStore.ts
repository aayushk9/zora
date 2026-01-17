import { create } from "zustand";

interface auth {
    isAuthWindowOpen: boolean;
    setIsAuthWindow: (value: boolean) => void
}

export const useAuthStore = create<auth>((set) => ({
    isAuthWindowOpen: false,
    setIsAuthWindow: (value) => set({isAuthWindowOpen: value})
}));