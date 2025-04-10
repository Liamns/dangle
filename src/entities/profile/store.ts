import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProfileModel } from "./model";
import { useUserStore } from "@/entities/user/store";

interface ProfileStoreState {
  currentProfile: ProfileModel | null;
  userProfiles: ProfileModel[];
  setCurrentProfile: (profile: ProfileModel | null) => void;
  setUserProfiles: (profiles: ProfileModel[]) => void;
  addProfile: (profile: ProfileModel) => void;
  updateProfile: (profile: ProfileModel) => void;
  removeProfile: (profileId: string) => void;
  loadProfilesByUserId: (userId: string) => Promise<void>;
  clearProfiles: () => void;
}

export const useProfileStore = create(
  persist<ProfileStoreState>(
    (set, get) => ({
      currentProfile: null,
      userProfiles: [],

      setCurrentProfile: (profile) => set({ currentProfile: profile }),

      setUserProfiles: (profiles) => set({ userProfiles: profiles }),

      addProfile: (profile) => {
        // 프로필 추가 로직
        set((state) => ({
          userProfiles: [...state.userProfiles, profile],
        }));

        // 프로필이 추가되면 현재 프로필이 없는 경우 자동으로 설정
        const { currentProfile } = get();
        if (!currentProfile) {
          set({ currentProfile: profile });
        }
      },

      updateProfile: (profile) =>
        set((state) => ({
          userProfiles: state.userProfiles.map((p) =>
            p.id === profile.id ? profile : p
          ),
          currentProfile:
            state.currentProfile?.id === profile.id
              ? profile
              : state.currentProfile,
        })),

      removeProfile: (profileId) =>
        set((state) => {
          const newProfiles = state.userProfiles.filter(
            (p) => p.id !== profileId
          );
          const newCurrentProfile =
            state.currentProfile?.id === profileId
              ? newProfiles.length > 0
                ? newProfiles[0]
                : null
              : state.currentProfile;

          return {
            userProfiles: newProfiles,
            currentProfile: newCurrentProfile,
          };
        }),

      loadProfilesByUserId: async (userId) => {
        // 실제 구현에서는 API 호출을 통해 프로필을 가져올 것입니다.
        // 예: const profiles = await api.fetchProfilesByUserId(userId);
        // set({ userProfiles: profiles });

        // 데모 목적으로 임시 로직 구현
        try {
          // API 호출 시뮬레이션
          // const profiles = await api.fetchProfilesByUserId(userId);
          const profiles: ProfileModel[] = []; // API 응답 시뮬레이션

          set({
            userProfiles: profiles,
            currentProfile: profiles.length > 0 ? profiles[0] : null,
          });
        } catch (error) {
          console.error("프로필 로드 중 오류 발생:", error);
        }

        return Promise.resolve();
      },

      clearProfiles: () => set({ currentProfile: null, userProfiles: [] }),
    }),
    {
      name: "profile-store", // 로컬 스토리지 키 이름
    }
  )
);
