import { commonHeader } from "@/shared/consts/apis";
import { PROFILE_ERROR_MESSAGE } from "../consts";
import { useUserStore } from "@/entities/user/store";
import useSWR from "swr";
import { ProfileModel } from "@/entities/profile/model";
import useSWRMutation from "swr/mutation";

async function getProfileFetcher(url: string): Promise<ProfileModel[]> {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || PROFILE_ERROR_MESSAGE.UNKNOWN_USER);
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

export function useProfile() {
  const userId = useUserStore((state) => state.currentUser?.id);

  const {
    data: profiles,
    error: fetchError,
    isLoading: isProfileLoading,
    mutate: revalidateProfile,
  } = useSWR<ProfileModel[]>(
    userId ? `/api/profile?userId=${userId}` : null,
    getProfileFetcher
  );

  const {
    trigger: registerProfile,
    isMutating: isRegistering,
    error: registerError,
  } = useSWRMutation("/api/profile", registerProfileFetcher);

  const isProcessing = isProfileLoading || isRegistering;

  return {
    profiles,
    fetchError,
    isProcessing,
    revalidateProfile,
    registerProfile,
    registerError,
  };
}
