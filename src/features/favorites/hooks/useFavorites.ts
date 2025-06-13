// filepath: src/features/favorites/hooks/useFavorites.ts
import { useCallback, useState } from "react";
import useSWR from "swr";
import { getFavoritesByType, toggleFavoriteByType } from "../apis";
import { FavoriteScheduleModel } from "@/entities/schedule/model";
import { FavoriteRoutineModel } from "@/entities/routine/schema";

export type FavoriteType = "routine" | "schedule";
export type FavoriteItem = FavoriteRoutineModel | FavoriteScheduleModel;

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
    // 기존 API 호출
    const apiData = await getFavoritesByType(profileId, type);

    // 타입 변환 (임시 구현 - 실제 서버 구현 시 이 부분은 필요없음)
    if (type === "routine") {
      // RoutineWithContentsModel[]를 FavoriteRoutineModel[]로 변환
      return (apiData as any[]).map((item) => ({
        id: item.id || Date.now(),
        profileId: profileId,
        routineId: item.id,
        addedAt: new Date(),
      }));
    } else {
      // ScheduleWithItemsModel[]를 FavoriteScheduleModel[]로 변환
      return (apiData as any[]).map((item) => ({
        id: item.id || Date.now(),
        profileId: profileId,
        scheduleId: item.id,
        addedAt: new Date(),
        alias: `일정 ${item.id}`, // 기본값
        icon: 1, // 기본값
      }));
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
   * 스케줄/루틴 즐겨찾기 여부는 해당 컴포넌트에서 처리하고,
   * 이 훅은 favorites 테이블의 레코드 추가/제거만 담당
   */
  const toggleFavorite = useCallback(
    async (id: number, formData?: Partial<FavoriteItem>) => {
      if (!profileId || !data) return;

      // 이미 진행 중인 요청이면 무시
      if (pendingFavorites.has(id)) return;

      // 현재 즐겨찾기 상태 확인 (즐겨찾기 목록에 있는지)
      const isFavorited = data.some((item) =>
        type === "routine"
          ? (item as FavoriteRoutineModel).routineId === id
          : (item as FavoriteScheduleModel).scheduleId === id
      );

      try {
        // 진행 중 표시
        setPendingFavorites((prev) => new Set(prev).add(id));

        if (isFavorited) {
          // 즐겨찾기 제거 - 낙관적 업데이트
          mutate(
            (prevItems) =>
              prevItems?.filter((item) =>
                type === "routine"
                  ? (item as FavoriteRoutineModel).routineId !== id
                  : (item as FavoriteScheduleModel).scheduleId !== id
              ),
            false
          );
        } else if (formData) {
          // 즐겨찾기 추가 - 낙관적 업데이트
          // 필요한 데이터를 포함하여 새 즐겨찾기 항목 추가
          const newFavorite =
            type === "routine"
              ? ({
                  id: Date.now(), // 임시 ID, 서버에서 실제 ID 받아옴
                  profileId,
                  routineId: id,
                  addedAt: new Date(),
                  ...formData,
                } as FavoriteRoutineModel)
              : ({
                  id: Date.now(), // 임시 ID, 서버에서 실제 ID 받아옴
                  profileId,
                  scheduleId: id,
                  addedAt: new Date(),
                  alias:
                    (formData as Partial<FavoriteScheduleModel>).alias ||
                    `일정 ${id}`,
                  icon: (formData as Partial<FavoriteScheduleModel>).icon || 1,
                  ...formData,
                } as FavoriteScheduleModel);

          mutate((prevItems) => [...(prevItems || []), newFavorite], false);
        } else {
          // formData가 없으면 즐겨찾기 추가 불가
          console.error("즐겨찾기 추가에 필요한 데이터가 없습니다");
          return;
        }

        // API 호출 - 4번째 파라미터는 현재 API에서 지원하지 않으므로 제거
        // 실제 서버 구현 시 formData 전달 필요
        await toggleFavoriteByType(profileId, id, type);

        // 성공 시 캐시 갱신 (선택사항)
        mutate();
      } catch (error) {
        console.error("즐겨찾기 토글 실패:", error);

        // 실패 시 롤백 - 원래 상태로 복원
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
          ? (item as FavoriteRoutineModel).routineId === id
          : (item as FavoriteScheduleModel).scheduleId === id
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
          ? (item as FavoriteRoutineModel).routineId === id
          : (item as FavoriteScheduleModel).scheduleId === id
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
