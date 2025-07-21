/**
 * 이 파일은 일정 관련 타입 정의를 포함합니다.
 * 메인 카테고리, 서브 카테고리 및 관련 유틸리티 함수를 정의합니다.
 */

// 메인 카테고리 정의
export const mainCategories = [
  "건강",
  "기념일",
  "교육",
  "모임",
  "외출",
  "일상",
] as const;

export type MainCategory = (typeof mainCategories)[number];

// 메인 카테고리 ID 맵핑 (숫자 인덱스용)
export const mainCategoryIds: Record<MainCategory, number> = {
  건강: 1,
  기념일: 2,
  교육: 3,
  모임: 4,
  외출: 5,
  일상: 6,
};

// 서브 카테고리 정의 - 건강관리
export const healthSubCategories = [
  "건강체크",
  "영양제 섭취",
  "예방접종",
  "체중체크",
] as const;

export type HealthSubCategory = (typeof healthSubCategories)[number];

// 서브 카테고리 정의 - 교육관리
export const educationSubCategories = [
  "교육 기타",
  "배변 훈련",
  "사회화 훈련",
  "유치원 등원",
] as const;

export type EducationSubCategory = (typeof educationSubCategories)[number];

// 서브 카테고리 정의 - 일상관리
export const dailySubCategories = [
  "간식",
  "놀이",
  "목욕",
  "미용실",
  "복용약",
  "산책",
  "식사",
  "실외배변",
  "일상 기타",
] as const;

export type DailySubCategory = (typeof dailySubCategories)[number];

// 서브 카테고리 정의 - 기념일관리
export const anniversarySubCategories = ["생일"] as const;

export type AnniversarySubCategory = (typeof anniversarySubCategories)[number];

// 서브 카테고리 정의 - 모임관리
export const meetingSubCategories = [
  "동네모임",
  "산책모임",
  "친구모임",
] as const;

export type MeetingSubCategory = (typeof meetingSubCategories)[number];

// 서브 카테고리 정의 - 외출관리
export const outingSubCategories = [
  "동물병원",
  "애견카페",
  "애견호텔",
  "여행",
  "외출 기타",
  "운동장",
] as const;

export type OutingSubCategory = (typeof outingSubCategories)[number];

// 서브 카테고리 ID 맵핑
export const healthSubCategoryIds: Record<HealthSubCategory, number> = {
  건강체크: 1,
  "영양제 섭취": 2,
  예방접종: 3,
  체중체크: 4,
};

export const educationSubCategoryIds: Record<EducationSubCategory, number> = {
  "교육 기타": 6,
  "배변 훈련": 7,
  "사회화 훈련": 8,
  "유치원 등원": 9,
};

export const dailySubCategoryIds: Record<DailySubCategory, number> = {
  간식: 19,
  놀이: 20,
  목욕: 21,
  미용실: 22,
  복용약: 23,
  산책: 24,
  식사: 25,
  실외배변: 26,
  "일상 기타": 27,
};

export const anniversarySubCategoryIds: Record<AnniversarySubCategory, number> =
  {
    생일: 5,
  };

export const meetingSubCategoryIds: Record<MeetingSubCategory, number> = {
  동네모임: 10,
  산책모임: 11,
  친구모임: 12,
};

export const outingSubCategoryIds: Record<OutingSubCategory, number> = {
  동물병원: 13,
  애견카페: 14,
  애견호텔: 15,
  여행: 16,
  "외출 기타": 17,
  운동장: 18,
};

// 모든 서브 카테고리 타입
export type SubCategory =
  | HealthSubCategory
  | EducationSubCategory
  | DailySubCategory
  | AnniversarySubCategory
  | MeetingSubCategory
  | OutingSubCategory;

// 메인 카테고리별 서브 카테고리 목록 맵핑
export const subCategoriesByMain: Record<MainCategory, readonly SubCategory[]> =
  {
    건강: healthSubCategories,
    기념일: anniversarySubCategories,
    교육: educationSubCategories,
    모임: meetingSubCategories,
    일상: dailySubCategories,
    외출: outingSubCategories,
  };

// 메인 카테고리에 따라 해당하는 서브 카테고리 배열을 반환하는 함수
export function getSubCategoriesByMain(
  mainCategory: MainCategory
): readonly SubCategory[] {
  return subCategoriesByMain[mainCategory];
}

// 메인 카테고리와 서브 카테고리 이름으로 서브 카테고리 ID를 찾는 함수
export function getSubCategoryId(
  mainCategory: MainCategory,
  subCategory: SubCategory
): number {
  switch (mainCategory) {
    case "건강":
      return healthSubCategoryIds[subCategory as HealthSubCategory] ?? -1;
    case "교육":
      return educationSubCategoryIds[subCategory as EducationSubCategory] ?? -1;
    case "일상":
      return dailySubCategoryIds[subCategory as DailySubCategory] ?? -1;
    case "기념일":
      return (
        anniversarySubCategoryIds[subCategory as AnniversarySubCategory] ?? -1
      );
    case "모임":
      return meetingSubCategoryIds[subCategory as MeetingSubCategory] ?? -1;
    case "외출":
      return outingSubCategoryIds[subCategory as OutingSubCategory] ?? -1;
    default:
      return -1;
  }
}

// 메인 카테고리별 모든 서브 카테고리를 ID와 이름 쌍 배열로 반환하는 함수
export function getAllSubCategoriesByMain(
  mainCategory: MainCategory
): { id: number; name: string }[] {
  const subCategories = subCategoriesByMain[mainCategory];
  return Array.from(subCategories).map((name, index) => ({
    id: index,
    name: name as string,
  }));
}

// 서브 카테고리 영어 이름 매핑 (이미지 아이콘용)
export const subCategoryToImageName: Record<SubCategory, string> = {
  // 건강관리 서브 카테고리
  건강체크: "health-check",
  예방접종: "vaccination",
  "영양제 섭취": "vitamin",
  체중체크: "weight-check",

  // 교육관리 서브 카테고리
  "교육 기타": "other-education",
  "배변 훈련": "potty-training",
  "사회화 훈련": "socialization",
  "유치원 등원": "kindergarten",

  // 일상관리 서브 카테고리
  간식: "snack",
  놀이: "play",
  미용실: "grooming",
  목욕: "bath",
  복용약: "medicine",
  산책: "walk",
  실외배변: "outdoor-potty",
  식사: "meal",
  "일상 기타": "daily-other",

  // 기념일관리 서브 카테고리
  생일: "birthday",

  // 모임관리 서브 카테고리
  동네모임: "neighborhood",
  산책모임: "community",
  친구모임: "friends",

  // 외출관리 서브 카테고리
  동물병원: "animal-hospital",
  애견카페: "pet-cafe",
  애견호텔: "pet-hotel",
  여행: "travel",
  "외출 기타": "outing-other",
  운동장: "dog-park",
};

// 모든 서브 카테고리 ID와 이름을 매핑하는 객체 (ID -> 이름)
export const allSubCategoryNamesById: Record<number, SubCategory> = {
  ...Object.fromEntries(
    Object.entries(healthSubCategoryIds).map(([name, id]) => [
      id,
      name as HealthSubCategory,
    ])
  ),
  ...Object.fromEntries(
    Object.entries(educationSubCategoryIds).map(([name, id]) => [
      id,
      name as EducationSubCategory,
    ])
  ),
  ...Object.fromEntries(
    Object.entries(dailySubCategoryIds).map(([name, id]) => [
      id,
      name as DailySubCategory,
    ])
  ),
  ...Object.fromEntries(
    Object.entries(anniversarySubCategoryIds).map(([name, id]) => [
      id,
      name as AnniversarySubCategory,
    ])
  ),
  ...Object.fromEntries(
    Object.entries(meetingSubCategoryIds).map(([name, id]) => [
      id,
      name as MeetingSubCategory,
    ])
  ),
  ...Object.fromEntries(
    Object.entries(outingSubCategoryIds).map(([name, id]) => [
      id,
      name as OutingSubCategory,
    ])
  ),
};

/**
 * 서브 카테고리 ID만으로 서브 카테고리 이름을 찾는 함수
 * @param subCategoryId - 찾고자 하는 서브 카테고리의 ID
 * @returns 해당하는 서브 카테고리 이름 또는 찾지 못한 경우 null
 */
export function getSubCategoryNameById(
  subCategoryId: number
): SubCategory | null {
  return allSubCategoryNamesById[subCategoryId] ?? null;
}

/**
 *
 * @param subCategory - 서브카테고리의 name
 * @returns 서브 카테고리에 해당하는 이미지 경로를 반환하는 함수
 */
export function getSubCategoryImagePath(subCategory: SubCategory): string {
  const imageName = subCategoryToImageName[subCategory];
  return `/images/schedule/${imageName}.png`;
}

/**
 *
 * @param subCategoryId
 * @returns 메인 카테고리와 서브 카테고리 ID로 이미지 경로를 반환하는 함수
 */
export function getSubCategoryImagePathById(
  mainCategoryId: number,
  subCategoryId: number
): string | null {
  const subCategoryName = getSubCategoryNameById(subCategoryId);
  if (!subCategoryName) return null;

  const imageName = subCategoryToImageName[subCategoryName as SubCategory];
  return imageName ? `/images/schedule/${imageName}.png` : null;
}

// 모든 서브 카테고리 이름을 ID에 매핑하는 객체 (이름 -> ID)
export const allSubCategoryIdsByName: Record<SubCategory, number> = {
  ...healthSubCategoryIds,
  ...educationSubCategoryIds,
  ...dailySubCategoryIds,
  ...anniversarySubCategoryIds,
  ...meetingSubCategoryIds,
  ...outingSubCategoryIds,
};

/**
 * 서브 카테고리 이름으로 ID를 찾는 함수
 * @param subCategoryName - 찾고자 하는 서브 카테고리의 이름
 * @returns 해당하는 서브 카테고리 ID 또는 찾지 못한 경우 null
 */
export function getSubIdByName(subCategoryName: SubCategory): number | null {
  return allSubCategoryIdsByName[subCategoryName] ?? null;
}
