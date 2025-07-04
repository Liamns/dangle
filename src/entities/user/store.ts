import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserModel } from "@/entities/user/model";
import { ProfileModel } from "@/entities/profile/model";

// Empty user model as constant for reset purposes
const EMPTY_USER: UserModel = {
  id: "00000000-0000-0000-0000-000000000000", // Default UUID
  email: "",
  password: "",
  username: "",
  profileIds: null,
};

interface UserStoreState {
  currentUser: UserModel | null;
  _hasHydrated: boolean;
  setCurrentUser: (user: UserModel | null) => void;
  updateCurrentUser: (userData: Partial<UserModel>) => void;
  loadUserProfiles: () => Promise<ProfileModel[]>;
  hasMultipleProfiles: () => boolean;
  clearUser: () => void;
  isFirst: boolean;
  setIsFirst: (isFirst: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useUserStore = create(
  persist<UserStoreState>(
    (set, get) => ({
      currentUser: null,
      isFirst: true, // 초기 상태 플래그
      _hasHydrated: false,

      setHasHydrated: (hydrated) => {
        set({ _hasHydrated: hydrated });
      },

      setCurrentUser: (user) => {
        set({ currentUser: user });

        // 로그인 시 자동으로 사용자의 프로필 로드
        if (user) {
          // 실제 구현에서는 다음과 같이 프로필을 로드할 수 있습니다
          // const profileStore = await import('@/entities/profile/store');
          // profileStore.useProfileStore.getState().loadProfilesByUserId(user.id);
        } else {
          // 로그아웃 시 프로필 초기화
          // profileStore.useProfileStore.getState().clearProfiles();
        }
      },

      updateCurrentUser: (userData) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...userData }
            : null,
        })),

      hasMultipleProfiles: () => {
        const state = get();
        if (!state.currentUser || !state.currentUser.profileIds) {
          return false;
        }
        // profileIds가 배열인 경우 길이가 2 이상인지 확인
        if (Array.isArray(state.currentUser.profileIds)) {
          return state.currentUser.profileIds.length >= 2;
        }
        return false;
      },

      loadUserProfiles: async () => {
        const state = get();

        if (!state.currentUser) {
          return [];
        }

        try {
          // 실제 구현에서는 API 호출이나 프로필 스토어 접근을 통해 프로필 로드
          // const profileStore = await import('@/entities/profile/store');
          // await profileStore.useProfileStore.getState().loadProfilesByUserId(state.currentUser.id);
          // return profileStore.useProfileStore.getState().userProfiles;

          return []; // 임시 반환값
        } catch (error) {
          console.error("사용자 프로필 로드 중 오류 발생:", error);
          return [];
        }
      },

      clearUser: () => {
        set({ currentUser: EMPTY_USER });

        // 로그아웃 시 프로필 초기화
        // const profileStore = useProfileStore.getState();
        // profileStore.clearProfiles();
      },

      setIsFirst: (value) => set({ isFirst: value }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
