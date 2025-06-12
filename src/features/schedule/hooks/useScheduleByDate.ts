// src/features/schedule/hooks/useScheduleByDate.ts
import useSWR from "swr";
import { ScheduleWithItemsModel } from "@/entities/schedule/model";
import { getScheduleByDate } from "../apis";

export function useScheduleByDate(profileId: string, date: Date) {
  const key = profileId
    ? ["scheduleByDate", profileId, date.toISOString()]
    : null;

  return useSWR<ScheduleWithItemsModel>(key, () =>
    getScheduleByDate(profileId, date)
  );
}
