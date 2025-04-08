import { create } from "zustand";
import { UserModel } from "@/entities/user/model";
import { ProfileModel } from "@/entities/profile/model";

interface UserStoreState {
  currentUser: UserModel | null;
  setCurrentUser: (user: UserModel | null) => void;
  updateCurrentUser: (userData: Partial<UserModel>) => void;
  loadUserProfiles: () => Promise<ProfileModel[]>;
  clearUser: () => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  currentUser: null,

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
    set({ currentUser: null });

    // 로그아웃 시 프로필 초기화
    // const profileStore = useProfileStore.getState();
    // profileStore.clearProfiles();
  },
}));
