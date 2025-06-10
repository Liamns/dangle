import useSWR from "swr";
import { getRoutinesByProfile } from "@/features/routine/apis";
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { useCallback, useState } from "react";

/**
 * profileId 기반 루틴 목록 가져오기
 * @param profileId - 현재 프로필 ID (필수)
 */
export function useRoutines(profileId: string) {
  // 진행 중인 즐겨찾기 토글 요청 추적
  const [pendingFavorites, setPendingFavorites] = useState<Set<number>>(
    new Set()
  );

  // SWR을 사용한 데이터 페칭
  const { data, error, isLoading, mutate } = useSWR<RoutineWithContentsModel[]>(
    profileId ? ["routines", profileId] : null,
    () => getRoutinesByProfile(profileId),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 10000, // 10초 동안 중복 요청 방지
    }
  );

  /**
   * 즐겨찾기 토글 함수 - 낙관적 UI 업데이트 + API 호출
   */
  const toggleFavorite = useCallback(
    async (id: number) => {
      if (!profileId || !data) return;

      // 이미 진행 중인 요청이면 무시
      if (pendingFavorites.has(id)) return;

      // 현재 상태 저장
      const routine = data.find((r) => r.id === id);
      if (!routine) return;

      const currentIsFavorite = routine.isFavorite ?? false;

      try {
        // 진행 중 표시
        setPendingFavorites((prev) => new Set(prev).add(id));

        // 1. 낙관적 UI 업데이트
        mutate(
          (prevRoutines) =>
            prevRoutines?.map((r) =>
              r.id === id ? { ...r, isFavorite: !currentIsFavorite } : r
            ),
          false
        );

        // 2. API 호출
        // 실제 API 호출은 여기에 추가 (예: toggleFavoriteApi(profileId, id))
        setTimeout(() => {
          console.log(
            `즐겨찾기 토글 API 호출: ${id}, 현재 상태: ${!currentIsFavorite}`
          );
        }, 500); // 모의 API 호출 (실제 API로 대체 필요)

        // 3. 성공 시 캐시 확인 (선택사항, 대부분의 경우 필요 없음)
        // mutate();
      } catch (error) {
        console.error("즐겨찾기 토글 실패:", error);

        // 실패 시 롤백
        mutate(
          (prevRoutines) =>
            prevRoutines?.map((r) =>
              r.id === id ? { ...r, isFavorite: currentIsFavorite } : r
            ),
          false
        );

        throw error; // 호출자가 오류 처리할 수 있도록
      } finally {
        // 진행 중 표시 제거
        setPendingFavorites((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [profileId, data, pendingFavorites, mutate]
  );

  /**
   * 특정 루틴 ID가 업데이트 중인지 확인
   */
  const isToggling = useCallback(
    (id: number) => pendingFavorites.has(id),
    [pendingFavorites]
  );

  /**
   * 현재 선택된 루틴의 최신 상태 가져오기 (모달용)
   */
  const getUpdatedRoutine = useCallback(
    (routineId: number | undefined) => {
      if (!routineId || !data) return undefined;
      return data.find((r) => r.id === routineId);
    },
    [data]
  );

  return {
    routines: data ?? [],
    isLoading,
    error,
    mutate,
    toggleFavorite, // 즐겨찾기 토글 함수
    isToggling, // 특정 ID의 로딩 상태 확인
    getUpdatedRoutine, // 최신 루틴 데이터 가져오기
    pendingFavorites, // 진행 중인 요청 ID 세트
  };
}
