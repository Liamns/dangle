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
        set((state) => ({
          userProfiles: [...state.userProfiles, profile],
        }));

        const { currentProfile } = get();
        if (!currentProfile) {
          set({ currentProfile: profile });
        }
      },

      updateProfile: (profile) =>
        set((state) => ({
          userProfiles: state.userProfiles.map((p) =>
            p.id === profile.id ? { ...p, ...profile } : p
          ),
          currentProfile:
            state.currentProfile?.id === profile.id
              ? { ...state.currentProfile, ...profile }
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
        try {
          const profiles: ProfileModel[] = [];

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
      name: "profile-store",
    }
  )
);
