import { create } from "zustand";

type UIState = {
  isNavOpen: boolean;
  activeSheet: string | null;
  setNavOpen: (open: boolean) => void;
  toggleNav: () => void;
  openSheet: (id: string) => void;
  closeSheet: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isNavOpen: false,
  activeSheet: null,
  setNavOpen: (open) => set({ isNavOpen: open }),
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
  openSheet: (id) => set({ activeSheet: id }),
  closeSheet: () => set({ activeSheet: null }),
}));
