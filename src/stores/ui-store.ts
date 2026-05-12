import { create } from "zustand";

type ToastEntry = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type UIState = {
  isNavOpen: boolean;
  activeSheet: string | null;
  toasts: ToastEntry[];
  setNavOpen: (open: boolean) => void;
  toggleNav: () => void;
  openSheet: (id: string) => void;
  closeSheet: () => void;
  showToast: (message: string, type?: ToastEntry["type"]) => void;
  dismissToast: (id: number) => void;
};

let toastCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  isNavOpen: false,
  activeSheet: null,
  toasts: [],
  setNavOpen: (open) => set({ isNavOpen: open }),
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
  openSheet: (id) => set({ activeSheet: id }),
  closeSheet: () => set({ activeSheet: null }),
  showToast: (message, type = "info") =>
    set((state) => ({
      toasts: [...state.toasts, { id: ++toastCounter, message, type }],
    })),
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
