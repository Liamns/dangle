import { useProfileStore } from "@/entities/profile/store";
import {
  NewScheduleItem,
  ScheduleItemWithSubCategoryModel,
  ScheduleWithItemsModel,
} from "@/entities/schedule/model";
import { ScheduleItemFormData } from "@/entities/schedule/schema";
import { useScheduleStore } from "@/entities/schedule/store";
import { SubCategory } from "@/entities/schedule/types";
import { PROFILE_ERROR_MESSAGE } from "@/features/profile/consts";
import { commonHeader } from "@/shared/consts/apis";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { NextResponse } from "next/server";
import { useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

async function getSchedulesFetcher(
  url: string
): Promise<ScheduleWithItemsModel> {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || PROFILE_ERROR_MESSAGE.EMPTY_PROFILE);
  }

  return response.json();
}

async function addScheduleFetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      inputData: Partial<
        Record<
          SubCategory,
          (ScheduleItemWithSubCategoryModel | NewScheduleItem) & {
            isFavorite?: boolean;
          }
        >
      >;
      profileId: string;
      date: Date | string;
    };
  }
) {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.error || COMMON_MESSAGE.WRONG_ACCESS },
      { status: 400 }
    );
  }

  return response.json();
}

async function updateScheduleFetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      itemId: number;
      isFavorite: boolean;
      item: Omit<ScheduleItemFormData, "scheduleId">;
    };
  }
) {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "PATCH",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.error || COMMON_MESSAGE.WRONG_ACCESS },
      { status: 400 }
    );
  }

  return response.json();
}

async function getIsFavoriteSubCategoryFetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      profileId: string;
      subIds: number[];
    };
  }
) {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.error || COMMON_MESSAGE.WRONG_ACCESS },
      { status: 400 }
    );
  }

  return response.json();
}

async function deleteScheduleItemFetcher(
  url: string,
  { arg }: { arg: { scheduleId: number; subId: number } }
) {
  const response = await fetch(
    `${url}?scheduleId=${arg.scheduleId}&subId=${arg.subId}`,
    { headers: commonHeader, method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.error || COMMON_MESSAGE.WRONG_ACCESS },
      { status: 400 }
    );
  }

  return response.json();
}

/**
 * React hook to fetch schedules for a given profile and date.
 * @param date Optional date string in 'YYYY-MM-DD' format. Defaults to today if not provided.
 */
export function useSchedules(date?: string) {
  const profileId = useProfileStore((state) => state.currentProfile?.id);

  // Determine the target date: use provided date or today's date in 'YYYY-MM-DD'
  const targetDate = date ?? new Date().toLocaleDateString("en-CA");

  // Only fetch if profileId is available
  const shouldFetch = Boolean(profileId);
  const endPoint = shouldFetch
    ? `/api/schedule?profileId=${profileId}&date=${targetDate}`
    : null;

  const {
    data: schedule,
    error: fetchError,
    isLoading: isScheduleLoading,
    mutate: revalidateSchedule,
  } = useSWR<ScheduleWithItemsModel>(endPoint, getSchedulesFetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    dedupingInterval: 10000, // 10초 동안 중복 요청 방지
  });

  const { currentSchedule, setCurrentSchedule } = useScheduleStore();

  useEffect(() => {
    if (schedule) {
      setCurrentSchedule(schedule);
    }
  }, [currentSchedule, setCurrentSchedule]);

  const {
    trigger: addSchedule,
    error: addError,
    isMutating: isAddLoading,
  } = useSWRMutation("/api/schedule", addScheduleFetcher);

  const {
    trigger: updateSchedule,
    error: updateError,
    isMutating: isUpdateLoading,
  } = useSWRMutation("/api/schedule", updateScheduleFetcher);

  const {
    trigger: checkFavoriteSub, // (1) trigger 함수를 받아옵니다. 이름 변경
    data: favoriteSub, // (2) 결과 데이터입니다.
    error: favoriteStatusSub,
    isMutating: isCheckingFavoriteSub, // (3) 로딩 상태입니다.
  } = useSWRMutation(
    "/api/schedule/favorite/sub",
    getIsFavoriteSubCategoryFetcher
  );

  const {
    trigger: deleteScheduleItem,
    error: deleteError,
    isMutating: isDeleteLoading,
  } = useSWRMutation("/api/schedule", deleteScheduleItemFetcher);

  const isProcessing =
    isScheduleLoading ||
    isAddLoading ||
    isUpdateLoading ||
    isCheckingFavoriteSub;

  return {
    schedule,
    fetchError,
    revalidateSchedule,
    addSchedule,
    addError,
    updateSchedule,
    updateError,
    checkFavoriteSub,
    favoriteSub,
    favoriteStatusSub,
    deleteScheduleItem,
    deleteError,
    isDeleteLoading,
    isProcessing,
  };
}
