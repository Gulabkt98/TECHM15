"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  email: string | null;
  demo: boolean;
  signIn: (token: string, email: string, demo: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      demo: false,
      signIn: (token, email, demo) => set({ token, email, demo }),
      signOut: () => set({ token: null, email: null, demo: false }),
    }),
    { name: "lexguard-auth" },
  ),
);
