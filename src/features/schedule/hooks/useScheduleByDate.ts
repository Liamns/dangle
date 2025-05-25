// src/features/schedule/hooks/useScheduleByDate.ts
import useSWR from "swr";
import { getScheduleByDate } from "../apis";

export function useScheduleByDate(profileId: string, date: Date) {
  const key = profileId
    ? ["scheduleByDate", profileId, date.toISOString()]
    : null;
  const fetcher = () => getScheduleByDate(profileId, date);
  return useSWR(key, fetcher);
}
