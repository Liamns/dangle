// filepath: src/features/favorites/apis.ts
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { ScheduleWithItemsModel } from "@/entities/schedule/model";
import { getMockFavorites } from "./mocks/favoritesMock";

/**
 * 즐겨찾기된 루틴 목록을 가져오는 API (모의 데이터 사용)
 */
export async function getFavoriteRoutines(
  profileId: string
): Promise<RoutineWithContentsModel[]> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          getMockFavorites(profileId, "routine") as RoutineWithContentsModel[]
        ),
      500
    );
  });
}

/**
 * 즐겨찾기된 일정 목록을 가져오는 API (모의 데이터 사용)
 */
export async function getFavoriteSchedules(
  profileId: string
): Promise<ScheduleWithItemsModel[]> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          getMockFavorites(profileId, "schedule") as ScheduleWithItemsModel[]
        ),
      500
    );
  });
}

/**
 * 타입에 따라 즐겨찾기 목록을 가져오는 통합 API
 */
export async function getFavoritesByType(
  profileId: string,
  type: "routine" | "schedule"
): Promise<RoutineWithContentsModel[] | ScheduleWithItemsModel[]> {
  if (type === "routine") {
    return getFavoriteRoutines(profileId);
  } else {
    return getFavoriteSchedules(profileId);
  }
}

/**
 * 루틴 즐겨찾기 토글 API (모의 구현)
 */
export async function toggleRoutineFavorite(
  profileId: string,
  routineId: number
): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    // 실제 API에서는 여기서 서버 호출 구현
    console.log(
      `루틴 즐겨찾기 토글 API 호출: 프로필 ${profileId}, 루틴 ID ${routineId}`
    );
    setTimeout(() => resolve({ success: true }), 300);
  });
}

/**
 * 일정 즐겨찾기 토글 API (모의 구현)
 */
export async function toggleScheduleFavorite(
  profileId: string,
  scheduleId: number
): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    // 실제 API에서는 여기서 서버 호출 구현
    console.log(
      `일정 즐겨찾기 토글 API 호출: 프로필 ${profileId}, 일정 ID ${scheduleId}`
    );
    setTimeout(() => resolve({ success: true }), 300);
  });
}

/**
 * 타입에 따른 즐겨찾기 토글 통합 API
 */
export async function toggleFavoriteByType(
  profileId: string,
  itemId: number,
  type: "routine" | "schedule"
): Promise<{ success: boolean }> {
  if (type === "routine") {
    return toggleRoutineFavorite(profileId, itemId);
  } else {
    return toggleScheduleFavorite(profileId, itemId);
  }
}
