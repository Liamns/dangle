import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProfileModel } from "./model";
import { PersonalityTag } from "../../shared/types/pet";

// 비어있는 프로필 모델 상수 정의
export const EMPTY_PROFILE: ProfileModel = {
  id: "00000000-0000-0000-0000-000000000000",
  userId: "00000000-0000-0000-0000-000000000000",
  petname: "",
  petAge: "",
  petWeight: 0,
  petGender: { gender: null, isNeutered: false },
  petSpec: null,
  etc1: null,
  etc2: null,
  etc3: null,
  vaccinations: {},
  personalityScores: {},
};

interface ProfileState {
  profiles: ProfileModel[];
  currentProfile: ProfileModel | null;
  registeringProfile: ProfileModel & {
    tags?: PersonalityTag[];
    username?: string;
  };
  _hasHydrated: boolean;
  setProfiles: (profiles: ProfileModel[]) => void;
  setCurrentProfile: (profile: ProfileModel | null) => void;
  addProfile: (profile: ProfileModel) => void;
  updateProfile: (profile: Partial<ProfileModel>) => void;
  removeProfile: (profileId: string) => void;
  clearProfiles: () => void;
  updateRegisteringProfile: (
    profileData: Partial<ProfileModel> & {
      tags?: PersonalityTag[];
      username?: string;
    }
  ) => void;
  setHasHydrated: (hydrated: boolean) => void;
  isFirst: boolean;
  setIsFirst: (isFirst: boolean) => void;
}

export const useProfileStore = create(
  persist<ProfileState>(
    (set, get) => ({
      profiles: [],
      currentProfile: null,
      registeringProfile: { ...EMPTY_PROFILE, tags: [], username: "" },
      _hasHydrated: false,
      isFirst: true,

      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      setIsFirst: (isFirst) => set({ isFirst }),

      setProfiles: (profiles) => {
        const currentProfile = get().currentProfile;
        const isCurrentProfileStillValid = profiles.some(
          (p) => p.id === currentProfile?.id
        );

        set({
          profiles: profiles,
          currentProfile: isCurrentProfileStillValid
            ? currentProfile
            : profiles[profiles.length - 1] || null,
        });
      },

      setCurrentProfile: (profile) => set({ currentProfile: profile }),

      addProfile: (profile) => {
        set((state) => ({
          profiles: [...state.profiles, profile],
          currentProfile: profile,
        }));
      },

      updateProfile: (profile) =>
        set((state) => {
          const updatedProfiles = state.profiles.map((p) =>
            p.id === profile.id ? { ...p, ...profile } : p
          );

          let updatedCurrentProfile = state.currentProfile;
          if (state.currentProfile && state.currentProfile.id === profile.id) {
            updatedCurrentProfile = { ...state.currentProfile, ...profile } as ProfileModel;
          }

          return {
            profiles: updatedProfiles,
            currentProfile: updatedCurrentProfile,
          };
        }),

      removeProfile: (profileId) =>
        set((state) => {
          const newProfiles = state.profiles.filter((p) => p.id !== profileId);
          const newCurrentProfile =
            state.currentProfile?.id === profileId
              ? newProfiles.length > 0
                ? newProfiles[0]
                : null
              : state.currentProfile;

          return {
            profiles: newProfiles,
            currentProfile: newCurrentProfile,
          };
        }),

      clearProfiles: () =>
        set({
          profiles: [],
          currentProfile: null,
        }),

      updateRegisteringProfile: (profileData) =>
        set((state) => ({
          registeringProfile: {
            ...state.registeringProfile,
            ...profileData,
          },
        })),
    }),
    {
      name: "profile-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
