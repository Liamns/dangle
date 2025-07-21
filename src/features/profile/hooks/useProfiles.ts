import { commonHeader } from "@/shared/consts/apis";
import { PROFILE_ERROR_MESSAGE } from "../consts";
import { useUserStore } from "@/entities/user/store";
import useSWR from "swr";
import { ProfileModel } from "@/entities/profile/model";
import useSWRMutation from "swr/mutation";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { useProfileStore } from "@/entities/profile/store";
import { useEffect } from "react";

async function getProfileFetcher(url: string): Promise<ProfileModel[]> {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || COMMON_MESSAGE.UNKNOWN_USER);
  }

  return response.json();
}

async function registerProfileFetcher(
  url: string,
  { arg }: { arg: { profileData: Partial<ProfileModel> } }
) {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || PROFILE_ERROR_MESSAGE.FAIL_REGISTER);
  }

  return response.json();
}

async function updateProfileFetcher(
  url: string,
  { arg }: { arg: { inputData: ProfileModel } }
) {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "PATCH",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || PROFILE_ERROR_MESSAGE.FAIL_UPDATE);
  }

  return response.json();
}

export function useProfile() {
  const userId = useUserStore((state) => state.currentUser?.id);
  const { setProfiles, currentProfile, setCurrentProfile } = useProfileStore();

  const {
    data: profiles,
    error: fetchError,
    isLoading: isProfileLoading,
    mutate: revalidateProfile,
  } = useSWR<ProfileModel[]>(
    userId ? `/api/profile?userId=${userId}` : null,
    getProfileFetcher
  );

  useEffect(() => {
    if (profiles) {
      // SWR로 가져온 데이터를 setProfiles 액션을 통해 스토어에 한 번에 저장합니다.
      setProfiles(profiles);
    }
  }, [profiles, setProfiles]);

  useEffect(() => {
    if (profiles) {
      if (currentProfile) {
        const found = profiles.find((it) => it.id === currentProfile.id);
        if (found) {
          setCurrentProfile(found);
        }
      } else {
        setCurrentProfile(profiles[0]);
      }
    }
  }, [profiles, setCurrentProfile]);

  const {
    trigger: registerProfile,
    isMutating: isRegistering,
    error: registerError,
  } = useSWRMutation("/api/profile", registerProfileFetcher);

  const {
    trigger: updateProfile,
    isMutating: isUpdating,
    error: updateError,
  } = useSWRMutation("/api/profile", updateProfileFetcher);

  const isProcessing = isProfileLoading || isRegistering || isUpdating;

  return {
    profiles,
    fetchError,
    isProcessing,
    revalidateProfile,
    registerProfile,
    registerError,
    updateProfile,
    updateError,
  };
}
