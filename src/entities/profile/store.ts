import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProfileModel } from "./model";
import { allVaccines, personalityTraits } from "../../shared/types/pet";

// 비어있는 프로필 모델 상수 정의
export const EMPTY_PROFILE: ProfileModel = {
  id: "00000000-0000-0000-0000-000000000000",
  userId: "00000000-0000-0000-0000-000000000000",
  username: "",
  petname: "",
  petAge: "", // petAge를 문자열로 수정 (yyyy-mm-dd 형식)
  petWeight: 0,
  petGender: { gender: null, isNeutered: false },
  petSpec: null,
  etc1: null,
  etc2: null,
  etc3: null,
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
  isLoaded: boolean;
  isFirstVisit: boolean; // 최초 방문 여부 상태 추가
  registeringProfile: ProfileModel;
  setCurrentProfile: (profile: ProfileModel | null) => void;
  setUserProfiles: (profiles: ProfileModel[]) => void;
  updateCurrentProfile: (profileData: Partial<ProfileModel>) => void;
  addProfile: (profile: ProfileModel) => void;
  updateProfile: (profile: ProfileModel) => void;
  removeProfile: (profileId: string) => void;
  loadProfilesByUserId: (userId: string) => Promise<void>;
  clearProfiles: () => void;
  isProfileValid: (profile: ProfileModel | null) => boolean; // 검증 함수 추가
  getCurrentProfile: () => ProfileModel | null;
  setFirstVisit: (value: boolean) => void; // 상태 변경 메서드 추가
  updateRegisteringProfile: (profileData: Partial<ProfileModel>) => void;
}

export const useProfileStore = create(
  persist<ProfileStoreState>(
    (set, get) => ({
      currentProfile: null,
      userProfiles: [],
      isLoaded: false,
      isFirstVisit: true, // 기본값 true로 설정
      registeringProfile: EMPTY_PROFILE,

      setCurrentProfile: (profile) => {
        set({ currentProfile: profile, isLoaded: true });
      },

      setUserProfiles: (profiles) => set({ userProfiles: profiles }),

      updateCurrentProfile: (profileData) =>
        set((state) => ({
          currentProfile: state.currentProfile
            ? {
                ...state.currentProfile,
                ...profileData,
              }
            : null,
        })),

      addProfile: (profile) => {
        set((state) => ({
          userProfiles: [...state.userProfiles, profile],
        }));

        const { currentProfile } = get();
        if (!currentProfile) {
          set({ currentProfile: profile, isLoaded: true });
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
            isLoaded: true,
          });
        } catch (error) {
          console.error("프로필 로드 중 오류 발생:", error);
        }

        return Promise.resolve();
      },

      clearProfiles: () =>
        set({
          currentProfile: EMPTY_PROFILE,
          userProfiles: [],
          isLoaded: false,
        }),

      isProfileValid: (profile) => {
        if (!profile) return false;
        const { petname, petAge, petWeight, petGender, petSpec, vaccinations } =
          profile;
        return (
          !!petname &&
          !!petAge && // petAge를 문자열로 검사
          !!petWeight &&
          petSpec !== null &&
          petSpec !== undefined &&
          !!petGender &&
          Object.keys(vaccinations || {}).length > 0
          // etc1, etc2, etc3는 필수가 아니므로 검사에서 제외
        );
      },

      getCurrentProfile: () => {
        const state = get();
        if (!state.isLoaded) {
          set({ isLoaded: true });
        }
        return state.currentProfile;
      },

      setFirstVisit: (value) => set({ isFirstVisit: value }), // 상태 변경 메서드 구현

      updateRegisteringProfile: (profileData: Partial<ProfileModel>) =>
        set((state) => ({
          registeringProfile: state.registeringProfile
            ? {
                ...state.registeringProfile,
                ...profileData,
              }
            : EMPTY_PROFILE,
        })),
    }),
    {
      name: "profile-store",
    }
  )
);
