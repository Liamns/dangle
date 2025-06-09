import { ScheduleWithItemsModel } from "@/entities/schedule/model";
import {
  mainCategories,
  mainCategoryIds,
  healthSubCategories,
  educationSubCategories,
  dailySubCategories,
  anniversarySubCategories,
  meetingSubCategories,
  outingSubCategories,
} from "@/shared/types/schedule-category";

export const EMPTY_SCHEDULE: ScheduleWithItemsModel = {
  id: 0,
  profileId: "",
  createdAt: new Date(),
  scheduleItems: [],
};

/**
 * Returns mock schedules for the given profile (only for FIXED_TODAY)
 */
export function getMockSchedules(
  profileId: string,
  baseDateParam: Date = new Date()
): ScheduleWithItemsModel {
  const baseDate = new Date(baseDateParam);
  const morning = new Date(baseDate);
  morning.setHours(8, 0, 0, 0);
  const noon = new Date(baseDate);
  noon.setHours(12, 30, 0, 0);
  const afternoon = new Date(baseDate);
  afternoon.setHours(15, 0, 0, 0);
  const evening = new Date(baseDate);
  evening.setHours(18, 0, 0, 0);
  const night = new Date(baseDate);
  night.setHours(20, 0, 0, 0);

  const mainCats = mainCategories.map((name, idx) => ({ id: idx, name }));
  const subs = [
    ...healthSubCategories.map((name, idx) => ({
      id: idx,
      name,
      mainId: mainCategoryIds.건강,
    })),
    ...educationSubCategories.map((name, idx) => ({
      id: idx,
      name,
      mainId: mainCategoryIds.교육,
    })),
    ...dailySubCategories.map((name, idx) => ({
      id: idx,
      name,
      mainId: mainCategoryIds.일상,
    })),
    ...anniversarySubCategories.map((name, idx) => ({
      id: idx,
      name,
      mainId: mainCategoryIds.기념일,
    })),
    ...meetingSubCategories.map((name, idx) => ({
      id: idx,
      name,
      mainId: mainCategoryIds.모임,
    })),
    ...outingSubCategories.map((name, idx) => ({
      id: idx,
      name,
      mainId: mainCategoryIds.외출,
    })),
  ];

  return {
    id: 1,
    profileId,
    createdAt: baseDate,
    scheduleItems: [
      {
        id: 1,
        scheduleId: 1,
        contentId: 1,
        startAt: morning,
        content: {
          id: 1,
          mainId: mainCategoryIds.건강,
          subId: 0,
          description: "멀티비타민 2알 먹이기",
          main: mainCats[mainCategoryIds.건강],
          sub: subs.find(
            (s) => s.mainId === mainCategoryIds.건강 && s.id === 0
          )!,
        },
      },
      {
        id: 2,
        scheduleId: 1,
        contentId: 2,
        startAt: noon,
        content: {
          id: 2,
          mainId: mainCategoryIds.일상,
          subId: 7,
          description: "점심 사료 100g 급여",
          main: mainCats[mainCategoryIds.일상],
          sub: subs.find(
            (s) => s.mainId === mainCategoryIds.일상 && s.id === 7
          )!,
        },
      },
      {
        id: 3,
        scheduleId: 1,
        contentId: 3,
        startAt: evening,
        content: {
          id: 3,
          mainId: mainCategoryIds.일상,
          subId: 0,
          description: "30분 산책",
          main: mainCats[mainCategoryIds.일상],
          sub: subs.find(
            (s) => s.mainId === mainCategoryIds.일상 && s.id === 0
          )!,
        },
      },
      {
        id: 4,
        scheduleId: 1,
        contentId: 4,
        startAt: afternoon,
        content: {
          id: 4,
          mainId: mainCategoryIds.교육,
          subId: 1,
          description: "추가 일정 1",
          main: mainCats[mainCategoryIds.교육],
          sub: subs.find(
            (s) => s.mainId === mainCategoryIds.교육 && s.id === 1
          )!,
        },
      },
      {
        id: 5,
        scheduleId: 1,
        contentId: 5,
        startAt: night,
        content: {
          id: 5,
          mainId: mainCategoryIds.일상,
          subId: 2,
          description: "추가 일정 2",
          main: mainCats[mainCategoryIds.일상],
          sub: subs.find(
            (s) => s.mainId === mainCategoryIds.일상 && s.id === 2
          )!,
        },
      },
      {
        id: 6,
        scheduleId: 1,
        contentId: 6,
        startAt: morning,
        content: {
          id: 6,
          mainId: mainCategoryIds.건강,
          subId: 1,
          description: "체중 검사",
          main: mainCats[mainCategoryIds.건강],
          sub: subs.find(
            (s) => s.mainId === mainCategoryIds.건강 && s.id === 1
          )!,
        },
      },
      {
        id: 7,
        scheduleId: 1,
        contentId: 7,
        startAt: afternoon,
        content: {
          id: 7,
          mainId: mainCategoryIds.외출,
          subId: 0,
          description: "산책 후 카페 방문",
          main: mainCats[mainCategoryIds.외출],
          sub: subs.find(
            (s) => s.mainId === mainCategoryIds.외출 && s.id === 0
          )!,
        },
      },
      {
        id: 8,
        scheduleId: 1,
        contentId: 8,
        startAt: night,
        content: {
          id: 8,
          mainId: mainCategoryIds.모임,
          subId: 0,
          description: "친구 모임",
          main: mainCats[mainCategoryIds.모임],
          sub: subs.find(
            (s) => s.mainId === mainCategoryIds.모임 && s.id === 0
          )!,
        },
      },
    ],
  };
}
