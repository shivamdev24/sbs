// store/useServiceStore.ts
import { create } from "zustand";

type Service = {
  id: string;
  name: string;
  price: GLfloat;
  category: string;
  description: string;
  duration: string;
};

type ServiceState = {
  services: Service[];
  setServices: (services: Service[]) => void;
};

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],

  setServices: (services) => set({ services }),
}));