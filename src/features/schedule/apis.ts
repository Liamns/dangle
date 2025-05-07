import {
  ScheduleWithItemsModel,
  ScheduleItemWithContentModel,
  CategoryMainModel,
  CategorySubModel,
  isToday,
} from "@/entities/schedule/model";
import { TestUUID } from "@/shared/consts/strings";
import {
  mainCategories,
  mainCategoryIds,
  healthSubCategories,
  educationSubCategories,
  dailySubCategories,
  anniversarySubCategories,
  meetingSubCategories,
  outingSubCategories,
  getSubCategoryNameById,
} from "@/shared/types/schedule-category";

/**
 * 특정 profileId에 대한 오늘의 일정을 조회하는 API
 * @param profileId 프로필 ID
 * @returns 오늘 날짜의 일정 목록
 */
export async function getTodaySchedules(
  profileId: string = TestUUID[0]
): Promise<ScheduleWithItemsModel[]> {
  try {
    const data = await new Promise<ScheduleWithItemsModel[]>(
      (resolve, reject) => {
        // reject("Error fetching today's schedules");
        // resolve([]); // 빈 배열로 응답
        setTimeout(() => {
          // 현재 날짜 기준 (2025년 5월 7일)
          const today = new Date(2025, 4, 7); // 월은 0부터 시작하므로 5월은 4

          // 시간 설정
          const morning = new Date(today);
          morning.setHours(8, 0, 0, 0);

          const noon = new Date(today);
          noon.setHours(12, 30, 0, 0);

          const afternoon = new Date(today);
          afternoon.setHours(15, 0, 0, 0);

          const evening = new Date(today);
          evening.setHours(18, 0, 0, 0);

          const night = new Date(today);
          night.setHours(20, 0, 0, 0);

          // 테스트 데이터: 메인 카테고리
          const mainCategoriesData: CategoryMainModel[] = mainCategories.map(
            (name, index) => ({
              id: index,
              name: name,
            })
          );

          // 테스트 데이터: 서브 카테고리
          const subCategoriesData: CategorySubModel[] = [
            // 건강관리 서브 카테고리
            ...healthSubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.건강관리,
            })),

            // 교육관리 서브 카테고리
            ...educationSubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.교육관리,
            })),

            // 일상관리 서브 카테고리
            ...dailySubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.일상관리,
            })),

            // 기념일관리 서브 카테고리
            ...anniversarySubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.기념일관리,
            })),

            // 모임관리 서브 카테고리
            ...meetingSubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.모임관리,
            })),

            // 외출관리 서브 카테고리
            ...outingSubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.외출관리,
            })),
          ];

          // 테스트 일정 데이터
          const schedules: ScheduleWithItemsModel[] = [
            {
              id: 1,
              profileId: profileId,
              createdAt: new Date(2025, 4, 1),
              scheduleItems: [
                {
                  id: 1,
                  scheduleId: 1,
                  contentId: 1,
                  startAt: morning,
                  content: {
                    id: 1,
                    mainId: mainCategoryIds.건강관리,
                    subId: 0, // 영양제 섭취하기
                    description: "멀티비타민 2알 먹이기",
                    main: mainCategoriesData[mainCategoryIds.건강관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.건강관리 && sub.id === 0
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
                    mainId: mainCategoryIds.일상관리,
                    subId: 7, // 식사
                    description: "점심 사료 100g 급여",
                    main: mainCategoriesData[mainCategoryIds.일상관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.일상관리 && sub.id === 7
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
                    mainId: mainCategoryIds.일상관리,
                    subId: 0, // 산책
                    description: "30분 산책",
                    main: mainCategoriesData[mainCategoryIds.일상관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.일상관리 && sub.id === 0
                    )!,
                  },
                },
              ],
            },
            {
              id: 2,
              profileId: profileId,
              createdAt: new Date(2025, 4, 5),
              scheduleItems: [
                {
                  id: 4,
                  scheduleId: 2,
                  contentId: 4,
                  startAt: afternoon,
                  content: {
                    id: 4,
                    mainId: mainCategoryIds.교육관리,
                    subId: 3, // 배변 훈련
                    description: "실내배변 훈련 15분",
                    main: mainCategoriesData[mainCategoryIds.교육관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.교육관리 && sub.id === 3
                    )!,
                  },
                },
                {
                  id: 5,
                  scheduleId: 2,
                  contentId: 5,
                  startAt: night,
                  content: {
                    id: 5,
                    mainId: mainCategoryIds.일상관리,
                    subId: 1, // 놀이
                    description: "인형 장난감 놀이 20분",
                    main: mainCategoriesData[mainCategoryIds.일상관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.일상관리 && sub.id === 1
                    )!,
                  },
                },
              ],
            },
            {
              id: 3,
              profileId: profileId,
              createdAt: new Date(2025, 4, 6),
              scheduleItems: [
                {
                  id: 6,
                  scheduleId: 3,
                  contentId: 6,
                  startAt: morning,
                  content: {
                    id: 6,
                    mainId: mainCategoryIds.건강관리,
                    subId: 1, // 체중체크 하기
                    description: "매주 수요일 체중 체크",
                    main: mainCategoriesData[mainCategoryIds.건강관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.건강관리 && sub.id === 1
                    )!,
                  },
                },
                {
                  id: 7,
                  scheduleId: 3,
                  contentId: 7,
                  startAt: noon,
                  content: {
                    id: 7,
                    mainId: mainCategoryIds.모임관리,
                    subId: 1, // 동네 모임
                    description: "아파트 단지 내 반려견 모임",
                    main: mainCategoriesData[mainCategoryIds.모임관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.모임관리 && sub.id === 1
                    )!,
                  },
                },
              ],
            },
          ];

          // 내일 일정 데이터 (테스트용)
          const tomorrow = new Date(2025, 4, 8);

          const tomorrowMorning = new Date(tomorrow);
          tomorrowMorning.setHours(10, 0, 0, 0);

          const tomorrowSchedule: ScheduleWithItemsModel = {
            id: 4,
            profileId: profileId,
            createdAt: new Date(2025, 4, 6),
            scheduleItems: [
              {
                id: 8,
                scheduleId: 4,
                contentId: 8,
                startAt: tomorrowMorning,
                content: {
                  id: 8,
                  mainId: mainCategoryIds.일상관리,
                  subId: 2, // 미용실 방문
                  description: "월간 미용 예약",
                  main: mainCategoriesData[mainCategoryIds.일상관리],
                  sub: subCategoriesData.find(
                    (sub) =>
                      sub.mainId === mainCategoryIds.일상관리 && sub.id === 2
                  )!,
                },
              },
            ],
          };

          // 어제 일정 데이터 (테스트용)
          const yesterday = new Date(2025, 4, 6);

          const yesterdayEvening = new Date(yesterday);
          yesterdayEvening.setHours(19, 0, 0, 0);

          const yesterdaySchedule: ScheduleWithItemsModel = {
            id: 5,
            profileId: profileId,
            createdAt: new Date(2025, 4, 5),
            scheduleItems: [
              {
                id: 9,
                scheduleId: 5,
                contentId: 9,
                startAt: yesterdayEvening,
                content: {
                  id: 9,
                  mainId: mainCategoryIds.외출관리,
                  subId: 2, // 애견카페
                  description: "친구와 함께 애견카페 방문",
                  main: mainCategoriesData[mainCategoryIds.외출관리],
                  sub: subCategoriesData.find(
                    (sub) =>
                      sub.mainId === mainCategoryIds.외출관리 && sub.id === 2
                  )!,
                },
              },
            ],
          };

          // 다가오는 디데이 일정 (테스트용)
          const dday = new Date(2025, 4, 15); // 2025년 5월 15일

          const ddayNoon = new Date(dday);
          ddayNoon.setHours(12, 0, 0, 0);

          const ddaySchedule: ScheduleWithItemsModel = {
            id: 6,
            profileId: profileId,
            createdAt: new Date(2025, 4, 1),
            scheduleItems: [
              {
                id: 10,
                scheduleId: 6,
                contentId: 10,
                startAt: ddayNoon,
                content: {
                  id: 10,
                  mainId: mainCategoryIds.기념일관리,
                  subId: 1, // 디데이
                  description: "반려동물 입양 1주년 기념일",
                  main: mainCategoriesData[mainCategoryIds.기념일관리],
                  sub: subCategoriesData.find(
                    (sub) =>
                      sub.mainId === mainCategoryIds.기념일관리 && sub.id === 1
                  )!,
                },
              },
            ],
          };

          // 모든 일정을 합침
          const allSchedules = [
            ...schedules,
            tomorrowSchedule,
            yesterdaySchedule,
            ddaySchedule,
          ];

          // 오늘 날짜(2025년 5월 7일)에 해당하는 일정만 필터링
          const todaySchedules = allSchedules.filter((schedule) =>
            schedule.scheduleItems.some((item) => {
              const itemDate = new Date(item.startAt);
              return (
                itemDate.getFullYear() === today.getFullYear() &&
                itemDate.getMonth() === today.getMonth() &&
                itemDate.getDate() === today.getDate()
              );
            })
          );

          resolve(todaySchedules);
        }, 1000);
      }
    );

    return data;
  } catch (e) {
    console.error("Error fetching today's schedules:", e);
    throw e;
  }
}

/**
 * 특정 profileId에 대한 모든 일정을 조회하는 API
 * @param profileId 프로필 ID
 * @returns 모든 일정 목록
 */
export async function getAllSchedules(
  profileId: string = TestUUID[0]
): Promise<ScheduleWithItemsModel[]> {
  try {
    const data = await new Promise<ScheduleWithItemsModel[]>(
      (resolve, reject) => {
        setTimeout(() => {
          // 현재 날짜 기준 (2025년 5월 7일)
          const today = new Date(2025, 4, 7); // 월은 0부터 시작하므로 5월은 4

          // 시간 설정
          const morning = new Date(today);
          morning.setHours(8, 0, 0, 0);

          const noon = new Date(today);
          noon.setHours(12, 30, 0, 0);

          const afternoon = new Date(today);
          afternoon.setHours(15, 0, 0, 0);

          const evening = new Date(today);
          evening.setHours(18, 0, 0, 0);

          const night = new Date(today);
          night.setHours(20, 0, 0, 0);

          // 테스트 데이터: 메인 카테고리
          const mainCategoriesData: CategoryMainModel[] = mainCategories.map(
            (name, index) => ({
              id: index,
              name: name,
            })
          );

          // 테스트 데이터: 서브 카테고리
          const subCategoriesData: CategorySubModel[] = [
            // 건강관리 서브 카테고리
            ...healthSubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.건강관리,
            })),

            // 교육관리 서브 카테고리
            ...educationSubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.교육관리,
            })),

            // 일상관리 서브 카테고리
            ...dailySubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.일상관리,
            })),

            // 기념일관리 서브 카테고리
            ...anniversarySubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.기념일관리,
            })),

            // 모임관리 서브 카테고리
            ...meetingSubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.모임관리,
            })),

            // 외출관리 서브 카테고리
            ...outingSubCategories.map((name, index) => ({
              id: index,
              name: name,
              mainId: mainCategoryIds.외출관리,
            })),
          ];

          // 테스트 일정 데이터 - 오늘 (2025년 5월 7일)
          const schedules: ScheduleWithItemsModel[] = [
            {
              id: 1,
              profileId: profileId,
              createdAt: new Date(2025, 4, 1),
              scheduleItems: [
                {
                  id: 1,
                  scheduleId: 1,
                  contentId: 1,
                  startAt: morning,
                  content: {
                    id: 1,
                    mainId: mainCategoryIds.건강관리,
                    subId: 0, // 영양제 섭취하기
                    description: "멀티비타민 2알 먹이기",
                    main: mainCategoriesData[mainCategoryIds.건강관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.건강관리 && sub.id === 0
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
                    mainId: mainCategoryIds.일상관리,
                    subId: 7, // 식사
                    description: "점심 사료 100g 급여",
                    main: mainCategoriesData[mainCategoryIds.일상관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.일상관리 && sub.id === 7
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
                    mainId: mainCategoryIds.일상관리,
                    subId: 0, // 산책
                    description: "30분 산책",
                    main: mainCategoriesData[mainCategoryIds.일상관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.일상관리 && sub.id === 0
                    )!,
                  },
                },
              ],
            },
            {
              id: 2,
              profileId: profileId,
              createdAt: new Date(2025, 4, 5),
              scheduleItems: [
                {
                  id: 4,
                  scheduleId: 2,
                  contentId: 4,
                  startAt: afternoon,
                  content: {
                    id: 4,
                    mainId: mainCategoryIds.교육관리,
                    subId: 3, // 배변 훈련
                    description: "실내배변 훈련 15분",
                    main: mainCategoriesData[mainCategoryIds.교육관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.교육관리 && sub.id === 3
                    )!,
                  },
                },
                {
                  id: 5,
                  scheduleId: 2,
                  contentId: 5,
                  startAt: night,
                  content: {
                    id: 5,
                    mainId: mainCategoryIds.일상관리,
                    subId: 1, // 놀이
                    description: "인형 장난감 놀이 20분",
                    main: mainCategoriesData[mainCategoryIds.일상관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.일상관리 && sub.id === 1
                    )!,
                  },
                },
              ],
            },
            {
              id: 3,
              profileId: profileId,
              createdAt: new Date(2025, 4, 6),
              scheduleItems: [
                {
                  id: 6,
                  scheduleId: 3,
                  contentId: 6,
                  startAt: morning,
                  content: {
                    id: 6,
                    mainId: mainCategoryIds.건강관리,
                    subId: 1, // 체중체크 하기
                    description: "매주 수요일 체중 체크",
                    main: mainCategoriesData[mainCategoryIds.건강관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.건강관리 && sub.id === 1
                    )!,
                  },
                },
                {
                  id: 7,
                  scheduleId: 3,
                  contentId: 7,
                  startAt: noon,
                  content: {
                    id: 7,
                    mainId: mainCategoryIds.모임관리,
                    subId: 1, // 동네 모임
                    description: "아파트 단지 내 반려견 모임",
                    main: mainCategoriesData[mainCategoryIds.모임관리],
                    sub: subCategoriesData.find(
                      (sub) =>
                        sub.mainId === mainCategoryIds.모임관리 && sub.id === 1
                    )!,
                  },
                },
              ],
            },
          ];

          // 내일(5월 8일) 일정 데이터
          const tomorrow = new Date(2025, 4, 8);

          const tomorrowMorning = new Date(tomorrow);
          tomorrowMorning.setHours(10, 0, 0, 0);

          const tomorrowAfternoon = new Date(tomorrow);
          tomorrowAfternoon.setHours(14, 0, 0, 0);

          const tomorrowSchedule: ScheduleWithItemsModel = {
            id: 4,
            profileId: profileId,
            createdAt: new Date(2025, 4, 6),
            scheduleItems: [
              {
                id: 8,
                scheduleId: 4,
                contentId: 8,
                startAt: tomorrowMorning,
                content: {
                  id: 8,
                  mainId: mainCategoryIds.일상관리,
                  subId: 2, // 미용실 방문
                  description: "월간 미용 예약",
                  main: mainCategoriesData[mainCategoryIds.일상관리],
                  sub: subCategoriesData.find(
                    (sub) =>
                      sub.mainId === mainCategoryIds.일상관리 && sub.id === 2
                  )!,
                },
              },
              {
                id: 11,
                scheduleId: 4,
                contentId: 11,
                startAt: tomorrowAfternoon,
                content: {
                  id: 11,
                  mainId: mainCategoryIds.교육관리,
                  subId: 0, // 사회화 훈련
                  description: "다른 반려견과 만남 훈련",
                  main: mainCategoriesData[mainCategoryIds.교육관리],
                  sub: subCategoriesData.find(
                    (sub) =>
                      sub.mainId === mainCategoryIds.교육관리 && sub.id === 0
                  )!,
                },
              },
            ],
          };

          // 어제(5월 6일) 일정 데이터
          const yesterday = new Date(2025, 4, 6);

          const yesterdayEvening = new Date(yesterday);
          yesterdayEvening.setHours(19, 0, 0, 0);

          const yesterdayMorning = new Date(yesterday);
          yesterdayMorning.setHours(9, 0, 0, 0);

          const yesterdaySchedule: ScheduleWithItemsModel = {
            id: 5,
            profileId: profileId,
            createdAt: new Date(2025, 4, 5),
            scheduleItems: [
              {
                id: 9,
                scheduleId: 5,
                contentId: 9,
                startAt: yesterdayEvening,
                content: {
                  id: 9,
                  mainId: mainCategoryIds.외출관리,
                  subId: 2, // 애견카페
                  description: "친구와 함께 애견카페 방문",
                  main: mainCategoriesData[mainCategoryIds.외출관리],
                  sub: subCategoriesData.find(
                    (sub) =>
                      sub.mainId === mainCategoryIds.외출관리 && sub.id === 2
                  )!,
                },
              },
              {
                id: 12,
                scheduleId: 5,
                contentId: 12,
                startAt: yesterdayMorning,
                content: {
                  id: 12,
                  mainId: mainCategoryIds.건강관리,
                  subId: 3, // 건강 체크
                  description: "구토 증상 관찰",
                  main: mainCategoriesData[mainCategoryIds.건강관리],
                  sub: subCategoriesData.find(
                    (sub) =>
                      sub.mainId === mainCategoryIds.건강관리 && sub.id === 3
                  )!,
                },
              },
            ],
          };

          // 다가오는 디데이 일정 (5월 15일)
          const dday = new Date(2025, 4, 15);

          const ddayNoon = new Date(dday);
          ddayNoon.setHours(12, 0, 0, 0);

          const ddaySchedule: ScheduleWithItemsModel = {
            id: 6,
            profileId: profileId,
            createdAt: new Date(2025, 4, 1),
            scheduleItems: [
              {
                id: 10,
                scheduleId: 6,
                contentId: 10,
                startAt: ddayNoon,
                content: {
                  id: 10,
                  mainId: mainCategoryIds.기념일관리,
                  subId: 1, // 디데이
                  description: "반려동물 입양 1주년 기념일",
                  main: mainCategoriesData[mainCategoryIds.기념일관리],
                  sub: subCategoriesData.find(
                    (sub) =>
                      sub.mainId === mainCategoryIds.기념일관리 && sub.id === 1
                  )!,
                },
              },
            ],
          };

          // 생일 일정 (5월 20일)
          const birthday = new Date(2025, 4, 20);

          const birthdayNoon = new Date(birthday);
          birthdayNoon.setHours(12, 0, 0, 0);

          const birthdaySchedule: ScheduleWithItemsModel = {
            id: 7,
            profileId: profileId,
            createdAt: new Date(2025, 4, 1),
            scheduleItems: [
              {
                id: 13,
                scheduleId: 7,
                contentId: 13,
                startAt: birthdayNoon,
                content: {
                  id: 13,
                  mainId: mainCategoryIds.기념일관리,
                  subId: 0, // 생일
                  description: "2번째 생일 파티",
                  main: mainCategoriesData[mainCategoryIds.기념일관리],
                  sub: subCategoriesData.find(
                    (sub) =>
                      sub.mainId === mainCategoryIds.기념일관리 && sub.id === 0
                  )!,
                },
              },
            ],
          };

          // 모든 일정을 합침
          const allSchedules = [
            ...schedules,
            tomorrowSchedule,
            yesterdaySchedule,
            ddaySchedule,
            birthdaySchedule,
          ];

          resolve(allSchedules);
        }, 1000);
      }
    );

    return data;
  } catch (e) {
    console.error("Error fetching all schedules:", e);
    throw e;
  }
}
