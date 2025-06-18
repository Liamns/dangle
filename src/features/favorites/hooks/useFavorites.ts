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

export type FavoriteType = "routine" | "schedule";
export type FavoriteItem = RoutineWithContentsModel | ScheduleModel;

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

  // 기존 API에서 FavoriteItem[] 타입으로 변환하는 함수
  async function fetchFavorites(): Promise<FavoriteItem[]> {
    // API 호출
    const apiData = await getFavoritesByType(profileId, type);

    // 즐겨찾기 항목 반환 (각 타입별 실제 모델 사용)
    if (type === "routine") {
      // RoutineWithContentsModel[]을 그대로 사용
      return apiData as RoutineWithContentsModel[];
    } else {
      // ScheduleWithItemsModel[]을 그대로 사용 (이제 동일한 방식으로 처리)
      return apiData as ScheduleWithItemsModel[];
    }
  }

  // SWR을 사용한 데이터 페칭 - FavoriteItem[] 타입으로 직접 가져옴
  const { data, error, isLoading, mutate } = useSWR<FavoriteItem[]>(
    profileId ? [`favorites-${type}`, profileId] : null,
    fetchFavorites,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 1000, // 1초 동안 중복 요청 방지
    }
  );

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
            mutate(
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
            mutate((prevItems) => [...(prevItems || []), targetRoutine], false);
          } else {
            console.error("즐겨찾기 추가에 필요한 루틴 데이터가 없습니다");
            return;
          }
        } else {
          // 일정의 경우도 루틴과 동일한 방식으로 처리
          if (isFavorited) {
            // 즐겨찾기 해제 - 목록에서 제거
            mutate(
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
            mutate(
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
        mutate();
      } catch (error) {
        console.error("즐겨찾기 토글 실패:", error);

        // 실패 시 롤백
        mutate();

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
    [profileId, data, type, pendingFavorites, mutate]
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
    favorites: data ?? [],
    isLoading,
    error,
    mutate,
    toggleFavorite,
    isFavorited,
    getFavoriteItem,
    isToggling,
    pendingFavorites,
  };
}
