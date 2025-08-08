import { AnniversaryModel } from "@/entities/anniversary/model";
import { commonHeader } from "@/shared/consts/apis";
import { ANNIV_ERROR_MESSAGE } from "../consts";
import { AnniversaryFormData } from "@/entities/anniversary/schema";
import { useUserStore } from "@/entities/user/store";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useAnniversaryStore } from "@/entities/anniversary/store";
import { useEffect } from "react";

async function getAnnivFetcher(url: string): Promise<AnniversaryModel[]> {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || ANNIV_ERROR_MESSAGE.FAIL_FETCH);
  }

  return response.json();
}

async function registerAnnivFetcher(
  url: string,
  { arg }: { arg: { inputData: AnniversaryFormData } }
) {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || ANNIV_ERROR_MESSAGE.FAIL_REGISTER);
  }

  return response.json();
}

async function updateAnnivFetch(
  url: string,
  { arg }: { arg: { inputData: AnniversaryFormData & { id: number } } }
) {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "PATCH",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || ANNIV_ERROR_MESSAGE.FAIL_UPDATE);
  }

  return response.json();
}

async function deleteAnnivFethcer(
  url: string,
  { arg }: { arg: { id: number } }
) {
  const response = await fetch(`${url}?id=${arg.id}`, {
    headers: commonHeader,
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || ANNIV_ERROR_MESSAGE.FAIL_DELETE);
  }

  return response.json();
}

export function useAnniversaries() {
  const userId = useUserStore((state) => state.currentUser?.id);

  const { setAll } = useAnniversaryStore();

  const {
    data: annivsaries,
    isLoading: isAnnivLoading,
    error: fetchError,
    mutate: revalidateAnniv,
  } = useSWR<AnniversaryModel[]>(
    userId ? `/api/anniversary?userId=${userId}` : null,
    getAnnivFetcher
  );

  useEffect(() => {
    if (annivsaries) {
      setAll(annivsaries);
    }
  }, [setAll, annivsaries]);

  const {
    trigger: registerAnniv,
    isMutating: isAnnivRegistering,
    error: registerError,
  } = useSWRMutation("/api/anniversary", registerAnnivFetcher);

  const {
    trigger: updateAnniv,
    isMutating: isAnnivUpdating,
    error: updateError,
  } = useSWRMutation("/api/anniversary", updateAnnivFetch);

  const isProcessing = isAnnivLoading || isAnnivRegistering || isAnnivUpdating;

  const {
    trigger: deleteAnniv,
    isMutating: isAnnivDeleting,
    error: deleteError,
  } = useSWRMutation(`/api/anniversary`, deleteAnnivFethcer);

  return {
    annivsaries,
    fetchError,
    revalidateAnniv,
    registerAnniv,
    registerError,
    updateAnniv,
    updateError,
    isProcessing,
    deleteAnniv,
    isAnnivDeleting,
    deleteError,
  };
}
