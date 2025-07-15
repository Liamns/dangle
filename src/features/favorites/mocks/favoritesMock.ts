// filepath: src/features/favorites/mocks/favoritesMock.ts
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { ScheduleWithItemsModel } from "@/entities/schedule/model";
import { getMockRoutines } from "@/features/routine/mocks/routineMocks";

/**
 * 프로필 기반으로 즐겨찾기된 루틴 목록 생성 (모의 데이터)
 * isFavorite=true인 루틴만 필터링
 */
export function getMockFavoriteRoutines(
  profileId: string
): RoutineWithContentsModel[] {
  const allRoutines = getMockRoutines(profileId);

  // 기존 루틴 중 isFavorite=true인 것만 반환
  return allRoutines.filter((routine) => routine.isFavorite);
}

/**
 * 프로필 기반으로 즐겨찾기된 스케줄 생성 (모의 데이터)
 * isFavorite=true인 스케줄만 필터링
 */
export function getMockFavoriteSchedules(
  profileId: string
): ScheduleWithItemsModel[] {
  // 예시 일정 생성 (현재, 하루 전, 이틀 전)
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);

  // 즐겨찾기된 일정만 반환
  return [];
}

/**
 * 타입에 따라 즐겨찾기 항목 가져오기 (통합 함수)
 * @param profileId 프로필 ID
 * @param type 'routine' 또는 'schedule'
 */
export function getMockFavorites(
  profileId: string,
  type: "routine" | "schedule"
) {
  if (type === "routine") {
    return getMockFavoriteRoutines(profileId);
  } else {
    return getMockFavoriteSchedules(profileId);
  }
}
