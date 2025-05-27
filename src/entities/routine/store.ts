import { persist } from "zustand/middleware";
import { RoutineModel } from "./model";
import { create } from "zustand";

interface RoutineState {
  routines: RoutineModel[];
  addRoutine: (routine: RoutineModel) => void;
  updateRoutine: (id: number, updates: Partial<RoutineModel>) => void;
  removeRoutine: (id: number) => void;
  clearRoutines: () => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      routines: [],
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
    }
  )
);
