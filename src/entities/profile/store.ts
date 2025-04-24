import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProfileModel } from "./model";
import { useUserStore } from "@/entities/user/store";
import {
  PetAgeFormData,
  PetGenderFormData,
  PetVaccinationFormData,
  PetPersonalityFormData,
  PetWeightFormData,
} from "./schema";
import { allVaccines, personalityTraits } from "../../shared/types/pet";

// 비어있는 프로필 모델 상수 정의
const EMPTY_PROFILE: ProfileModel = {
  id: "00000000-0000-0000-0000-000000000000",
  userId: "00000000-0000-0000-0000-000000000000",
  username: "",
  petname: "",
  petAge: { age: 0, isMonth: false },
  petWeight: 0,
  petGender: { gender: null, isNeutered: false },
  petSpec: null,
  vaccinations: Object.fromEntries(
    allVaccines.map((vaccine) => [vaccine, false])
  ),
  personalityScores: Object.fromEntries(
    personalityTraits.map((trait) => [trait, 0])
  ),
};

interface ProfileStoreState {
  currentProfile: ProfileModel | null;
  userProfiles: ProfileModel[];
  setCurrentProfile: (profile: ProfileModel | null) => void;
  setUserProfiles: (profiles: ProfileModel[]) => void;
  updateCurrentProfile: (profileData: Partial<ProfileModel>) => void;
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

      updateCurrentProfile: (profileData) =>
        set((state) => ({
          currentProfile: state.currentProfile
            ? { ...state.currentProfile, ...profileData }
            : null,
        })),

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

      clearProfiles: () =>
        set({ currentProfile: EMPTY_PROFILE, userProfiles: [] }),
    }),
    {
      name: "profile-store",
    }
  )
);
