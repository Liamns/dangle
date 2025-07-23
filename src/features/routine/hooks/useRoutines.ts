import useSWR from "swr";
import { getRoutinesByProfile } from "@/features/routine/apis";
import {
  NewRoutineWithContents,
  RoutineWithContentsModel,
} from "@/entities/routine/schema";
import { useCallback, useState } from "react";
import { useProfile } from "@/features/profile/hooks/useProfiles";
import { useProfileStore } from "@/entities/profile/store";
import { commonHeader } from "@/shared/consts/apis";
import { ROUTINE_MESSAGE } from "../consts";
import { FAVORITE_MESSAGE } from "@/features/favorites/consts";
import useSWRMutation from "swr/mutation";
import { blobUrlToBase64 } from "@/shared/lib/string";

async function getRoutinesFetcher(
  url: string
): Promise<RoutineWithContentsModel[]> {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || ROUTINE_MESSAGE.FAIL_FETCH);
  }

  return response.json();
}

async function toggleRoutineFavoriteFetcher(
  url: string,
  { arg }: { arg: { routineId: number; profileId: string } }
): Promise<{ message: string; isFavorite: boolean }> {
  const response = await fetch(url, {
    headers: commonHeader,
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || FAVORITE_MESSAGE.TOGGLE_ROUTINE);
  }

  return response.json();
}

async function addRoutineFetcher(
  url: string,
  { arg }: { arg: NewRoutineWithContents }
) {
  // arg.contents 배열을 순회하며 blob URL을 Base64로 변환
  const processedContents = await Promise.all(
    arg.contents.map(async (content) => {
      if (content.image && content.image.startsWith("blob:http")) {
        const base64Image = await blobUrlToBase64(content.image);
        return { ...content, image: base64Image };
      }
      return content;
    })
  );

  const response = await fetch(url, {
    headers: commonHeader,
    method: "POST",
    body: JSON.stringify({ ...arg, contents: processedContents }), // 변환된 contents로 교체
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || ROUTINE_MESSAGE.FAIL_ADD);
  }

  return response.json();
}

export function useRoutines() {
  const profileId = useProfileStore((state) => state.currentProfile?.id);
  const shouldFetch = Boolean(profileId);
  const endPoint = shouldFetch ? `/api/routine?profileId=${profileId}` : null;
  // 진행 중인 즐겨찾기 토글 요청 추적
  const [pendingFavorites, setPendingFavorites] = useState<Set<number>>(
    new Set()
  );

  // SWR을 사용한 데이터 페칭
  const {
    data: routines,
    error: fetchError,
    isLoading: isFetching,
    mutate: revalidateRoutines,
  } = useSWR<RoutineWithContentsModel[]>(endPoint, getRoutinesFetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    dedupingInterval: 10000, // 10초 동안 중복 요청 방지
  });

  const {
    trigger: addRoutine,
    error: addError,
    isMutating: isAdding,
  } = useSWRMutation("api/routine", addRoutineFetcher);

  const { trigger: triggerToggleFavorite } = useSWRMutation(
    "/api/routine/favorite",
    toggleRoutineFavoriteFetcher
  );

  /**
   * 즐겨찾기 토글 함수
   * SWR의 mutate를 활용한 낙관적 업데이트(Optimistic Update)를 적용하여
   * 즉각적인 UI 반응성과 성능을 개선합니다.
   */
  const toggleFavorite = useCallback(
    async (id: number) => {
      if (!profileId || !routines) return;
      if (pendingFavorites.has(id)) return;

      // 롤백을 위해 현재 데이터 복사
      const originalRoutines = [...routines];

      // 즉각적인 UI 업데이트를 위해 낙관적 데이터 생성
      const optimisticRoutines = routines.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      );

      // revalidate: false 옵션으로 캐시만 업데이트하고 서버 재요청은 방지
      revalidateRoutines(optimisticRoutines, { revalidate: false });

      try {
        // 중복 실행 방지를 위해 pending 상태 추가
        setPendingFavorites((prev) => new Set(prev).add(id));

        // 서버에 즐겨찾기 토글 요청
        await triggerToggleFavorite({ routineId: id, profileId });
      } catch (error) {
        console.error("즐겨찾기 토글 실패:", error);
        // 에러 발생 시 원래 데이터로 롤백
        revalidateRoutines(originalRoutines, { revalidate: false });
        throw error;
      } finally {
        // pending 상태 제거
        setPendingFavorites((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [
      profileId,
      routines,
      revalidateRoutines,
      triggerToggleFavorite,
      pendingFavorites,
    ]
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
      if (!routineId || !routines) return undefined;
      return routines.find((r) => r.id === routineId);
    },
    [routines]
  );

  return {
    routines,
    isFetching,
    fetchError,
    revalidateRoutines,
    toggleFavorite, // 즐겨찾기 토글 함수
    isToggling, // 특정 ID의 로딩 상태 확인
    getUpdatedRoutine, // 최신 루틴 데이터 가져오기
    pendingFavorites, // 진행 중인 요청 ID 세트
    addRoutine, // 루틴 추가 함수
    addError, // 루틴 추가 에러
    isAdding, // 루틴 추가 중 여부
  };
}
