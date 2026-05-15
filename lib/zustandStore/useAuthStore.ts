// // store/useAuthStore.ts
// import { create } from "zustand";

// type Role = "USER" | "ADMIN";

// type User = {
//   id: string;
//   email: string;
//   role: Role;
//   verified: boolean;
//   loading: boolean;
// };

// type AuthState = {
//   user: User | null;
//   isLoading: boolean;
//   setLoading: (loading: boolean) => void;
//   isAuthenticated: boolean;
//   setUser: (user: User) => void;
//   logout: () => void;
// };

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   isAuthenticated: false,
//   isLoading: true, // 👈 start as loading

//   setUser: (user) =>
//     set({
//       user,
//       isAuthenticated: true,
//     }),
//   setLoading: (loading) => set({ isLoading: loading }),

//   logout: () =>
//     set({
//       user: null,
//       isAuthenticated: false,
//     }),
// }));

import { create } from "zustand";
type Role = "USER" | "ADMIN";

type User = {
  id: string;

  email: string;

  role: Role;

  verified: boolean;

  loading: boolean;
};

type AuthState = {
  user: User | null;

  isLoading: boolean;

  setLoading: (loading: boolean) => void;

  isAuthenticated: boolean;

  setUser: (user: User) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isAuthenticated: false,

  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
