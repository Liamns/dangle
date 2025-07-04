import { persist, createJSONStorage } from "zustand/middleware";
import { RoutineModel } from "./model";
import { create } from "zustand";

interface RoutineState {
  routines: RoutineModel[];
  _hasHydrated: boolean;
  addRoutine: (routine: RoutineModel) => void;
  updateRoutine: (id: number, updates: Partial<RoutineModel>) => void;
  removeRoutine: (id: number) => void;
  clearRoutines: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      routines: [],
      _hasHydrated: false,
      setHasHydrated: (hydrated) => {
        set({ _hasHydrated: hydrated });
      },
      addRoutine: (routine) =>
        set((state) => ({ routines: [...state.routines, routine] })),
      updateRoutine: (id, updates) =>
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      removeRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        })),
      clearRoutines: () => set({ routines: [] }),
    }),
    {
      name: "routine-storage", // 로컬스토리지 키
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
