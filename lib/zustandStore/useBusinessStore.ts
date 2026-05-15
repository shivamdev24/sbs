// lib/zustandStore/useBusinessStore.ts
import { create } from "zustand";
import { BusinessProfile } from "@/generated/prisma/client";

type BusinessState = {
  business: BusinessProfile | null;

  setBusiness: (data: BusinessProfile) => void;
  clear: () => void;
};

export const useBusinessStore = create<BusinessState>((set) => ({
  business: null,

  setBusiness: (data) => set({ business: data }),


  clear: () => set({ business: null }),
}));
