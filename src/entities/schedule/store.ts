import { create } from "zustand";
import {
  CategoryMainModel,
  CategorySubModel,
  ScheduleContentModel,
  ScheduleModel,
  ScheduleWithItemsModel,
  FavoriteContentModel,
} from "./model";

// 일정 관련 전체 스토어 상태 타입
interface ScheduleStoreState {
  // 카테고리
  mainCategories: CategoryMainModel[];
  subCategories: CategorySubModel[];
  // 일정 컨텐츠
  scheduleContents: ScheduleContentModel[];
  favoriteContents: FavoriteContentModel[];
  // 일정 인스턴스
  userSchedules: ScheduleWithItemsModel[];
  // 현재 선택된 일정
  currentSchedule: ScheduleWithItemsModel | null;
  // 로딩 상태
  isLoading: boolean;
  error: string | null;

  // 스토어 액션
  setMainCategories: (categories: CategoryMainModel[]) => void;
  setSubCategories: (categories: CategorySubModel[]) => void;
  setScheduleContents: (contents: ScheduleContentModel[]) => void;
  setFavoriteContents: (favorites: FavoriteContentModel[]) => void;
  setUserSchedules: (schedules: ScheduleWithItemsModel[]) => void;
  setCurrentSchedule: (schedule: ScheduleWithItemsModel | null) => void;
  addFavoriteContent: (favorite: FavoriteContentModel) => void;
  removeFavoriteContent: (contentId: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// 일정 관련 스토어 생성
export const useScheduleStore = create<ScheduleStoreState>((set) => ({
  // 초기 상태
  mainCategories: [],
  subCategories: [],
  scheduleContents: [],
  favoriteContents: [],
  userSchedules: [],
  currentSchedule: null,
  isLoading: false,
  error: null,

  // 액션 정의
  setMainCategories: (categories) => set({ mainCategories: categories }),
  setSubCategories: (categories) => set({ subCategories: categories }),
  setScheduleContents: (contents) => set({ scheduleContents: contents }),
  setFavoriteContents: (favorites) => set({ favoriteContents: favorites }),
  setUserSchedules: (schedules) => set({ userSchedules: schedules }),
  setCurrentSchedule: (schedule) => set({ currentSchedule: schedule }),

  // 즐겨찾기 추가
  addFavoriteContent: (favorite) =>
    set((state) => ({
      favoriteContents: [...state.favoriteContents, favorite],
    })),

  // 즐겨찾기 제거
  removeFavoriteContent: (contentId) =>
    set((state) => ({
      favoriteContents: state.favoriteContents.filter(
        (favorite) => favorite.contentId !== contentId
      ),
    })),

  // 로딩 상태 설정
  setLoading: (isLoading) => set({ isLoading }),

  // 에러 설정
  setError: (error) => set({ error }),
}));

// 카테고리 관련 선택자 함수들
export const selectMainCategories = (state: ScheduleStoreState) =>
  state.mainCategories;
export const selectSubCategories = (state: ScheduleStoreState) =>
  state.subCategories;
export const selectSubCategoriesByMain =
  (mainId: number) => (state: ScheduleStoreState) =>
    state.subCategories.filter((sub) => sub.mainId === mainId);

// 컨텐츠 관련 선택자 함수들
export const selectScheduleContents = (state: ScheduleStoreState) =>
  state.scheduleContents;
export const selectFavoriteContents = (state: ScheduleStoreState) =>
  state.favoriteContents;
export const selectContentsByCategory =
  (mainId: number, subId?: number) => (state: ScheduleStoreState) => {
    if (subId) {
      return state.scheduleContents.filter(
        (content) => content.mainId === mainId && content.subId === subId
      );
    }
    return state.scheduleContents.filter(
      (content) => content.mainId === mainId
    );
  };

// 일정 관련 선택자 함수들
export const selectUserSchedules = (state: ScheduleStoreState) =>
  state.userSchedules;
export const selectCurrentSchedule = (state: ScheduleStoreState) =>
  state.currentSchedule;
export const selectIsContentFavorited =
  (contentId: number) => (state: ScheduleStoreState) =>
    state.favoriteContents.some((fav) => fav.contentId === contentId);

// 로딩 및 에러 상태 선택자
export const selectIsLoading = (state: ScheduleStoreState) => state.isLoading;
export const selectError = (state: ScheduleStoreState) => state.error;
