// filepath: src/features/favorites/hooks/useFavorites.ts
import { useCallback, useState } from "react";
import useSWR from "swr";
import { getFavoritesByType, toggleFavoriteByType } from "../apis";
import {
  FavoriteScheduleModel,
  ScheduleModel,
  ScheduleWithItemsModel,
} from "@/entities/schedule/model";
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { useProfileStore } from "@/entities/profile/store";
import { commonHeader } from "@/shared/consts/apis";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import useSWRMutation from "swr/mutation";

export type FavoriteType = "routine" | "schedule";
export type FavoriteItem = RoutineWithContentsModel | ScheduleWithItemsModel;

async function getFavoritesFetcher(url: string) {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || COMMON_MESSAGE.WRONG_ACCESS);
  }

  return response.json();
}

async function updateScheduleFavoriteFetcher(
  url: string,
  { arg }: { arg: { id: number; alias: string; icon: number } }
) {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "PATCH",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || COMMON_MESSAGE.WRONG_ACCESS);
  }

  return response.json();
}

export function useFavorites(type: FavoriteType) {
  const profileId = useProfileStore((s) => s.currentProfile?.id);
  const shouldFetch = Boolean(profileId);
  const endPoint = shouldFetch
    ? `/api/${type === "routine" ? "routine" : "schedule"}/favorite?profileId=${profileId}`
    : null;
  // 진행 중인 즐겨찾기 토글 요청 추적
  const [pendingFavorites, setPendingFavorites] = useState<Set<number>>(
    new Set()
  );

  const {
    data,
    isLoading: isFetching,
    mutate: revalidateFavorites,
    error: fetchError,
  } = useSWR<FavoriteItem[]>(endPoint, getFavoritesFetcher);

  const {
    trigger: updateScheduleFavorite,
    isMutating: isScheduleFavoriteUpdating,
    error: updateError,
  } = useSWRMutation("/api/schedule/favorite", updateScheduleFavoriteFetcher);
  /**
   * 즐겨찾기 토글 함수 - API 호출
   * 루틴: isFavorite 플래그만 토글
   * 스케줄: 기존 방식 유지
   */
  const toggleFavorite = useCallback(
    async (id: number, formData?: Partial<FavoriteItem>) => {
      if (!profileId || !data) return;

      // 이미 진행 중인 요청이면 무시
      if (pendingFavorites.has(id)) return;

      // 현재 즐겨찾기 상태 확인 (즐겨찾기 목록에 있는지)
      const isFavorited = data.some((item) =>
        type === "routine"
          ? (item as RoutineWithContentsModel).id === id
          : (item as ScheduleWithItemsModel).id === id
      );

      try {
        // 진행 중 표시
        setPendingFavorites((prev) => new Set(prev).add(id));

        if (type === "routine") {
          // 루틴의 경우 isFavorite 플래그만 토글
          if (isFavorited) {
            // 즐겨찾기 해제 - 목록에서 제거
            revalidateFavorites(
              (prevItems) =>
                prevItems?.filter(
                  (item) => (item as RoutineWithContentsModel).id !== id
                ),
              false
            );
          } else if (formData) {
            // 즐겨찾기 추가
            const targetRoutine = formData as RoutineWithContentsModel;
            targetRoutine.isFavorite = true;

            // 목록에 추가
            revalidateFavorites(
              (prevItems) => [...(prevItems || []), targetRoutine],
              false
            );
          } else {
            console.error("즐겨찾기 추가에 필요한 루틴 데이터가 없습니다");
            return;
          }
        } else {
          // 일정의 경우도 루틴과 동일한 방식으로 처리
          if (isFavorited) {
            // 즐겨찾기 해제 - 목록에서 제거
            revalidateFavorites(
              (prevItems) =>
                prevItems?.filter(
                  (item) => (item as ScheduleWithItemsModel).id !== id
                ),
              false
            );
          } else if (formData) {
            // 즐겨찾기 추가
            const targetSchedule = formData as ScheduleWithItemsModel;
            targetSchedule.isFavorite = true;

            // alias와 icon 설정 (제공된 경우)
            if ((formData as any).alias) {
              targetSchedule.alias = (formData as any).alias;
            } else {
              targetSchedule.alias = `일정 ${id}`;
            }

            if ((formData as any).icon !== undefined) {
              targetSchedule.icon = (formData as any).icon;
            } else {
              targetSchedule.icon = 1; // 기본 아이콘
            }

            // 즐겨찾기 추가 시간 설정
            targetSchedule.addedAt = new Date();

            // 목록에 추가
            revalidateFavorites(
              (prevItems) => [...(prevItems || []), targetSchedule],
              false
            );
          } else {
            console.error("즐겨찾기 추가에 필요한 데이터가 없습니다");
            return;
          }
        }

        // API 호출
        await toggleFavoriteByType(profileId, id, type);

        // 성공 시 캐시 갱신 (선택사항)
        revalidateFavorites();
      } catch (error) {
        console.error("즐겨찾기 토글 실패:", error);

        // 실패 시 롤백
        revalidateFavorites();

        throw error;
      } finally {
        // 진행 중 표시 제거
        setPendingFavorites((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [profileId, data, type, pendingFavorites, revalidateFavorites]
  );

  /**
   * 특정 ID가 즐겨찾기 되어 있는지 확인
   */
  const isFavorited = useCallback(
    (id: number): boolean => {
      if (!data) return false;

      return data.some((item) =>
        type === "routine"
          ? (item as RoutineWithContentsModel).id === id
          : (item as ScheduleWithItemsModel).id === id
      );
    },
    [data, type]
  );

  /**
   * 특정 ID의 즐겨찾기 항목 가져오기
   */
  const getFavoriteItem = useCallback(
    (id: number): FavoriteItem | undefined => {
      if (!data) return undefined;

      return data.find((item) =>
        type === "routine"
          ? (item as RoutineWithContentsModel).id === id
          : (item as ScheduleWithItemsModel).id === id
      );
    },
    [data, type]
  );

  /**
   * 특정 ID가 업데이트 중인지 확인
   */
  const isToggling = useCallback(
    (id: number) => pendingFavorites.has(id),
    [pendingFavorites]
  );

  return {
    favorites: data || [],
    isFetching,
    fetchError,
    revalidateFavorites,
    toggleFavorite,
    isFavorited,
    getFavoriteItem,
    isToggling,
    pendingFavorites,
    updateScheduleFavorite,
    isScheduleFavoriteUpdating,
    updateError,
  };
}
