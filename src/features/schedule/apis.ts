import { ScheduleWithItemsModel } from "@/entities/schedule/model";
import { TestUUID } from "@/shared/consts/strings";
import { getMockSchedules } from "./mocks/scheduleMocks";

/**
 * 특정 profileId에 대한 오늘의 일정을 조회하는 API (모의 데이터 활용)
 */
export async function getTodaySchedules(
  profileId: string = TestUUID[0]
): Promise<ScheduleWithItemsModel[]> {
  try {
    // simulate network delay and return mock data for current date
    return await new Promise<ScheduleWithItemsModel[]>((resolve) => {
      // setTimeout(() => resolve([]), 500);
      setTimeout(() => resolve(getMockSchedules(profileId, new Date())), 500);
    });
  } catch (error) {
    throw error;
  }
}

/**
 * 특정 profileId와 날짜를 기준으로 일정 목록 조회 API
 */
export async function getScheduleByDate(
  profileId: string,
  date: Date
): Promise<ScheduleWithItemsModel[]> {
  // simulate network delay and return mock data for the specified date
  return await new Promise<ScheduleWithItemsModel[]>((resolve) => {
    // setTimeout(() => resolve([]), 500);
    setTimeout(() => resolve(getMockSchedules(profileId, date)), 500);
  });
}
