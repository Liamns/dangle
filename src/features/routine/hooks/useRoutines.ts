import useSWR from "swr";
import { getRoutinesByProfile } from "@/features/routine/apis";
import { RoutineWithContentsModel } from "@/entities/routine/schema";

/**
 * profileId 기반 루틴 목록 가져오기
 * @param profileId - 현재 프로필 ID (필수)
 */
export function useRoutines(profileId: string) {
  const shouldFetch = Boolean(profileId);

  const { data, error, isLoading } = useSWR<RoutineWithContentsModel[]>(
    shouldFetch ? ["routines", profileId] : null,
    () => getRoutinesByProfile(profileId)
  );

  return {
    routines: data ?? [],
    isLoading,
    error,
  };
}
