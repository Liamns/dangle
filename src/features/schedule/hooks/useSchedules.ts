import { useProfileStore } from "@/entities/profile/store";
import {
  NewScheduleItem,
  ScheduleItemWithSubCategoryModel,
  ScheduleWithItemsModel,
} from "@/entities/schedule/model";
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
  } = useSWR<ScheduleWithItemsModel>(endPoint, getSchedulesFetcher);

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

  const isProcessing = isScheduleLoading || isAddLoading;

  return {
    schedule,
    fetchError,
    revalidateSchedule,
    addSchedule,
    addError,
    isProcessing,
  };
}
