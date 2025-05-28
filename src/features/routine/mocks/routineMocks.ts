// filepath: src/features/routine/mocks/routineMocks.ts
import { RoutineModel } from "@/entities/routine/schema";
import { RoutineCategory, RoutineType } from "@/entities/routine/types";

/**
 * profileId 기반으로 반환할 목업 루틴 데이터 생성
 */
export function getMockRoutines(profileId: string): RoutineModel[] {
  const now = new Date();
  return [
    {
      id: 1,
      profileId,
      category: RoutineCategory.EXERCISE,
      type: RoutineType.TIP,
      name: "조깅",
      title: "아침 조깅",
      content: "아침 30분 조깅",
      image: undefined,
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
    },
    {
      id: 2,
      profileId,
      category: RoutineCategory.MEAL,
      type: RoutineType.CAUTION,
      name: "식단",
      title: "건강을 위한 식단",
      content: "채소 위주 식단",
      image: undefined,
      createdAt: now,
      updatedAt: now,
      isFavorite: true,
    },
    // 추가 mock: BEAUTY
    {
      id: 3,
      profileId,
      category: RoutineCategory.BEAUTY,
      type: RoutineType.TIP,
      name: "미용",
      title: "장모종 관리",
      content: "주 1회 손질하기",
      image: undefined,
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
    },
    // 추가 mock: LIFESTYLE
    {
      id: 4,
      profileId,
      category: RoutineCategory.LIFESTYLE,
      type: RoutineType.CAUTION,
      name: "수면",
      title: "충분한 수면",
      content: "8시간 수면 확보",
      image: undefined,
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
    },
    // 추가 mock: OTHER
    {
      id: 5,
      profileId,
      category: RoutineCategory.OTHER,
      type: RoutineType.TIP,
      name: "기타",
      title: "옆집 댕그리 만나기",
      content: "친구 만나기",
      image: undefined,
      createdAt: now,
      updatedAt: now,
      isFavorite: true,
    },
  ];
}
