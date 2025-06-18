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
   * 즐겨찾기 토글 함수 - isFavorite 플래그 토글 방식
   * 즐겨찾기 시: 해당 루틴의 isFavorite=true로 설정
   * 해제 시: 해당 루틴의 isFavorite=false로 설정
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

        // 낙관적 UI 업데이트 - isFavorite 플래그만 토글
        mutate(
          (prevRoutines) =>
            prevRoutines?.map((r) =>
              r.id === id ? { ...r, isFavorite: !currentIsFavorite } : r
            ),
          false
        );

        // API 호출 (모의 구현)
        setTimeout(() => {
          console.log(
            `루틴 즐겨찾기 토글: ${id}, 변경된 상태: ${!currentIsFavorite}`
          );
        }, 500);

        // 성공 시 캐시 갱신 (선택사항)
        // mutate();
      } catch (error) {
        console.error("즐겨찾기 토글 실패:", error);

        // 실패 시 상태 복원
        mutate();

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
