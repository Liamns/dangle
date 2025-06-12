// filepath: src/features/favorites/hooks/useFavorites.ts
import { useCallback, useState } from "react";
import useSWR from "swr";
import { getFavoritesByType, toggleFavoriteByType } from "../apis";
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { ScheduleWithItemsModel } from "@/entities/schedule/model";

type FavoriteType = "routine" | "schedule";
type FavoriteItem = RoutineWithContentsModel | ScheduleWithItemsModel;

/**
 * 즐겨찾기 관리 훅 - 루틴 및 스케줄 즐겨찾기를 단일 인터페이스로 관리
 * @param profileId 프로필 ID
 * @param type 'routine' 또는 'schedule' (즐겨찾기 유형)
 * @returns 즐겨찾기 데이터와 관련 함수들
 */
export function useFavorites(profileId: string, type: FavoriteType) {
  // 진행 중인 즐겨찾기 토글 요청 추적
  const [pendingFavorites, setPendingFavorites] = useState<Set<number>>(
    new Set()
  );

  // SWR을 사용한 데이터 페칭
  const { data, error, isLoading, mutate } = useSWR<FavoriteItem[]>(
    profileId ? [`favorites-${type}`, profileId] : null,
    () => getFavoritesByType(profileId, type),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 1000, // 10초 동안 중복 요청 방지
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

      // 현재 상태 저장 (타입에 따라 다른 처리)
      let targetItem: FavoriteItem | undefined;
      let currentIsFavorite = false;

      if (type === "routine") {
        // 루틴인 경우 처리
        targetItem = (data as RoutineWithContentsModel[]).find(
          (r) => r.id === id
        );
        if (targetItem) {
          currentIsFavorite =
            (targetItem as RoutineWithContentsModel).isFavorite ?? false;
        }
      } else {
        // 스케줄인 경우 처리
        targetItem = (data as ScheduleWithItemsModel[]).find(
          (s) => s.id === id
        );
        if (targetItem) {
          currentIsFavorite =
            (targetItem as ScheduleWithItemsModel).isFavorite ?? false;
        }
      }

      if (!targetItem) return;

      try {
        // 진행 중 표시
        setPendingFavorites((prev) => new Set(prev).add(id));

        // 1. 낙관적 UI 업데이트
        mutate(
          (prevItems) =>
            prevItems?.map((item) =>
              item.id === id
                ? { ...item, isFavorite: !currentIsFavorite }
                : item
            ),
          false
        );

        // 2. API 호출
        await toggleFavoriteByType(profileId, id, type);

        // 3. 성공 시 캐시 확인 (선택사항, 대부분의 경우 필요 없음)
        // mutate();
      } catch (error) {
        console.error("즐겨찾기 토글 실패:", error);

        // 실패 시 롤백
        mutate(
          (prevItems) =>
            prevItems?.map((item) =>
              item.id === id ? { ...item, isFavorite: currentIsFavorite } : item
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
    [profileId, data, type, pendingFavorites, mutate]
  );

  /**
   * 특정 ID가 업데이트 중인지 확인
   */
  const isToggling = useCallback(
    (id: number) => pendingFavorites.has(id),
    [pendingFavorites]
  );

  /**
   * 현재 선택된 항목의 최신 상태 가져오기
   */
  const getUpdatedItem = useCallback(
    (itemId: number | undefined) => {
      if (!itemId || !data) return undefined;
      return data.find((item) => item.id === itemId);
    },
    [data]
  );

  return {
    favorites: data ?? [],
    isLoading,
    error,
    mutate,
    toggleFavorite,
    isToggling,
    getUpdatedItem,
    pendingFavorites,
  };
}
