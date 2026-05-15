// store/useLeadsStore.ts
import { create } from "zustand";

type Lead = {
  id: string;
  name: string;
  contact: string;
  service: string;
  type: string;
  category: string;
  subcategory: string;
  bookingConfirmation: string;
  price: string;
    date: string;
    time: string;
};

type LeadsState = {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
};

export const useLeadsStore = create<LeadsState>((set) => ({
  leads: [],

  setLeads: (leads) => set({ leads }),

  addLead: (lead) =>
    set((state) => ({
      leads: [...state.leads, lead],
    })),
}));