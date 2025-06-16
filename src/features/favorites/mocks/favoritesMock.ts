// filepath: src/features/favorites/mocks/favoritesMock.ts
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { ScheduleWithItemsModel } from "@/entities/schedule/model";
import { getMockRoutines } from "@/features/routine/mocks/routineMocks";
import { getMockSchedules } from "@/features/schedule/mocks/scheduleMocks";

/**
 * 프로필 기반으로 즐겨찾기된 루틴 목록 생성 (모의 데이터)
 */
export function getMockFavoriteRoutines(
  profileId: string
): RoutineWithContentsModel[] {
  const allRoutines = getMockRoutines(profileId);
  // 즐겨찾기된 루틴만 필터링
  return allRoutines.filter((routine) => routine.isFavorite);
}

/**
 * 프로필 기반으로 즐겨찾기된 스케줄 생성 (모의 데이터)
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

  // 여러 날짜의 일정을 가져와서 즐겨찾기 정보 추가
  const schedules = [
    { ...getMockSchedules(profileId, now), isFavorite: true },
    { ...getMockSchedules(profileId, yesterday), isFavorite: true },
    { ...getMockSchedules(profileId, twoDaysAgo), isFavorite: true },
    { ...getMockSchedules(profileId, now), isFavorite: true },
    { ...getMockSchedules(profileId, yesterday), isFavorite: true },
    { ...getMockSchedules(profileId, twoDaysAgo), isFavorite: true },
    { ...getMockSchedules(profileId, now), isFavorite: true },
    { ...getMockSchedules(profileId, yesterday), isFavorite: true },
    { ...getMockSchedules(profileId, twoDaysAgo), isFavorite: true },
    { ...getMockSchedules(profileId, now), isFavorite: true },
    { ...getMockSchedules(profileId, yesterday), isFavorite: true },
    { ...getMockSchedules(profileId, twoDaysAgo), isFavorite: true },
    { ...getMockSchedules(profileId, now), isFavorite: true },
    { ...getMockSchedules(profileId, yesterday), isFavorite: true },
    { ...getMockSchedules(profileId, twoDaysAgo), isFavorite: true },
  ];

  // 즐겨찾기된 일정만 반환
  return schedules.filter((schedule) => schedule.isFavorite);
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
