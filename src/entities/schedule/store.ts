import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  ScheduleWithItemsModel,
  CategorySubModel,
} from "@/entities/schedule/model";

// ===== 스토어 상태 타입 정의 =====

export interface ScheduleStoreState {
  // 선택된 날짜
  selectedDate: Date;
  // 현재 월에 해당하는 일정 목록
  schedules: ScheduleWithItemsModel[];
  // 즐겨찾기한 서브 카테고리 목록
  favoriteSubCategories: CategorySubModel[];
  // 현재 보고 있는 일정 (상세)
  currentSchedule: ScheduleWithItemsModel;
  _hasHydrated: boolean; // 하이드레이션 상태 추가

  // 액션 함수들
  setSelectedDate: (date: Date) => void;
  setSchedules: (schedules: ScheduleWithItemsModel[]) => void;
  addSchedule: (schedule: ScheduleWithItemsModel) => void;
  updateSchedule: (schedule: ScheduleWithItemsModel) => void;
  removeSchedule: (scheduleId: number) => void;
  setFavoriteSubCategories: (favorites: CategorySubModel[]) => void;
  addFavoriteSubCategory: (favorite: CategorySubModel) => void;
  removeFavoriteSubCategory: (subCategoryId: number) => void;
  setCurrentSchedule: (schedule: ScheduleWithItemsModel) => void;
  setHasHydrated: (hasHydrated: boolean) => void; // 하이드레이션 상태 설정 함수 추가
}

// ===== 스토어 구현 =====

export const useScheduleStore = create<ScheduleStoreState>()(
  persist( // persist 미들웨어 적용
    devtools(
      (set) => ({
        // 초기 상태
        selectedDate: new Date(),
        schedules: [],
        favoriteSubCategories: [],
        currentSchedule: {} as ScheduleWithItemsModel, // 초기값 명확화
        _hasHydrated: false, // 초기값은 false

        // 액션 구현
        setSelectedDate: (date) => set({ selectedDate: date }),
        setSchedules: (schedules) => set({ schedules }),
        addSchedule: (schedule) =>
          set((state) => ({ schedules: [...state.schedules, schedule] })),
        updateSchedule: (updatedSchedule) =>
          set((state) => ({
            schedules: state.schedules.map((s) =>
              s.id === updatedSchedule.id ? updatedSchedule : s
            ),
          })),
        removeSchedule: (scheduleId) =>
          set((state) => ({
            schedules: state.schedules.filter((s) => s.id !== scheduleId),
          })),
        setFavoriteSubCategories: (favorites) =>
          set({ favoriteSubCategories: favorites }),
        addFavoriteSubCategory: (favorite) =>
          set((state) => ({
            favoriteSubCategories: [...state.favoriteSubCategories, favorite],
          })),
        removeFavoriteSubCategory: (subCategoryId) =>
          set((state) => ({
            favoriteSubCategories: state.favoriteSubCategories.filter(
              (fav) => fav.id !== subCategoryId
            ),
          })),
        setCurrentSchedule: (schedule) => set({ currentSchedule: schedule }),
        setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }), // 하이드레이션 상태 설정 함수 구현
      }),
      { name: "ScheduleStore" } // Redux DevTools에 표시될 스토어 이름
    ),
    {
      name: "schedule-storage", // 로컬 스토리지에 저장될 키 이름
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // 하이드레이션 완료 시 _hasHydrated를 true로 설정
      },
    }
  )
);

// ===== 스토어 셀렉터 =====

export const selectSelectedDate = (state: ScheduleStoreState) =>
  state.selectedDate;

export const selectFavoriteSubCategories = (state: ScheduleStoreState) =>
  state.favoriteSubCategories;

export const selectIsFavoriteSubCategory = (
  subCategoryId: number
) => (state: ScheduleStoreState) =>
  state.favoriteSubCategories.some((fav) => fav.id === subCategoryId);

export const selectCurrentSchedule = (state: ScheduleStoreState) =>
  state.currentSchedule;