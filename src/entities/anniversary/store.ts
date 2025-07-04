import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AnniversaryModel } from "./model";

interface AnniversaryState {
  annivs: AnniversaryModel[];
  currentAnniv: AnniversaryModel | null;
  _hasHydrated: boolean;
  setCurrentAnniv: (item: AnniversaryModel | null) => void;
  setAll: (items: AnniversaryModel[]) => void;
  add: (item: AnniversaryModel) => void;
  update: (item: AnniversaryModel) => void;
  remove: (id: number) => void;
  clear: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAnniversaryStore = create(
  persist<AnniversaryState>(
    (set) => ({
      annivs: [],
      currentAnniv: null,
      _hasHydrated: false,

      setHasHydrated: (hydrated) => {
        set({ _hasHydrated: hydrated });
      },

      setAll: (items) => set({ annivs: items }),
      setCurrentAnniv: (item) => set({ currentAnniv: item }),

      add: (item) => set((state) => ({ annivs: [...state.annivs, item] })),

      update: (item) =>
        set((state) => ({
          annivs: state.annivs.map((a) => (a.id === item.id ? item : a)),
        })),

      remove: (id) =>
        set((state) => ({
          annivs: state.annivs.filter((a) => a.id !== id),
          currentAnniv:
            state.currentAnniv?.id === id ? null : state.currentAnniv,
        })),

      clear: () => set({ annivs: [], currentAnniv: null }),
    }),
    {
      name: "anniversary-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
