// filepath: src/features/routine/mocks/routineMocks.ts
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { RoutineCategory, RoutineType } from "@/entities/routine/types";

/**
 * profileId 기반으로 반환할 목업 루틴 데이터 생성
 */
export function getMockRoutines(profileId: string): RoutineWithContentsModel[] {
  const now = new Date();
  return [
    {
      id: 1,
      profileId,
      category: RoutineCategory.EXERCISE,
      type: RoutineType.TIP,
      name: "조깅",

      createdAt: now,
      updatedAt: now,
      isFavorite: false,
      contents: [
        {
          id: 101,
          routineId: 1,
          title: "아침 조깅",
          memo: "아침 30분 조깅",
          image: "",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
    {
      id: 2,
      profileId,
      category: RoutineCategory.MEAL,
      type: RoutineType.CAUTION,
      name: "식단",

      createdAt: now,
      updatedAt: now,
      isFavorite: true,
      contents: [
        {
          id: 201,
          routineId: 2,
          title: "건강을 위한 식단",
          memo: "채소 위주 식단",
          image: "",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
    // 추가 mock: BEAUTY
    {
      id: 3,
      profileId,
      category: RoutineCategory.BEAUTY,
      type: RoutineType.TIP,
      name: "미용",

      createdAt: now,
      updatedAt: now,
      isFavorite: false,
      contents: [
        {
          id: 301,
          routineId: 3,
          title: "장모종 관리",
          memo: "주 1회 손질하기",
          image: "",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
    // 추가 mock: LIFESTYLE
    {
      id: 4,
      profileId,
      category: RoutineCategory.LIFESTYLE,
      type: RoutineType.CAUTION,
      name: "수면",

      createdAt: now,
      updatedAt: now,
      isFavorite: false,
      contents: [
        {
          id: 401,
          routineId: 4,
          title: "충분한 수면",
          memo: "8시간 수면 확보",
          image: "",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
    // 추가 mock: OTHER
    {
      id: 5,
      profileId,
      category: RoutineCategory.OTHER,
      type: RoutineType.TIP,
      name: "기타",

      createdAt: now,
      updatedAt: now,
      isFavorite: true,
      contents: [
        {
          id: 501,
          routineId: 5,
          title: "옆집 댕그리 만나기",
          memo: "친구 만나기",
          image: "",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
  ];
}
