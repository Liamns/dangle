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
  건강: 0,
  기념일: 1,
  교육: 2,
  모임: 3,
  외출: 4,
  일상: 5,
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
  건강체크: 0,
  "영양제 섭취": 1,
  예방접종: 2,
  체중체크: 3,
};

export const educationSubCategoryIds: Record<EducationSubCategory, number> = {
  "교육 기타": 0,
  "배변 훈련": 1,
  "사회화 훈련": 2,
  "유치원 등원": 3,
};

export const dailySubCategoryIds: Record<DailySubCategory, number> = {
  간식: 0,
  놀이: 1,
  목욕: 2,
  미용실: 3,
  복용약: 4,
  산책: 5,
  식사: 6,
  실외배변: 7,
  "일상 기타": 8,
};

export const anniversarySubCategoryIds: Record<AnniversarySubCategory, number> =
  {
    생일: 0,
  };

export const meetingSubCategoryIds: Record<MeetingSubCategory, number> = {
  동네모임: 0,
  산책모임: 1,
  친구모임: 2,
};

export const outingSubCategoryIds: Record<OutingSubCategory, number> = {
  동물병원: 0,
  애견카페: 1,
  애견호텔: 2,
  여행: 3,
  "외출 기타": 4,
  운동장: 5,
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

// 메인 카테고리 ID와 서브 카테고리 ID로 서브 카테고리 이름을 찾는 함수
export function getSubCategoryNameById(
  mainCategoryId: number,
  subCategoryId: number
): string | null {
  const mainCategory = mainCategories[mainCategoryId];
  if (!mainCategory) return null;

  const subCategories = subCategoriesByMain[mainCategory];
  return subCategories[subCategoryId] || null;
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

// 서브 카테고리에 해당하는 이미지 경로를 반환하는 함수
export function getSubCategoryImagePath(subCategory: SubCategory): string {
  const imageName = subCategoryToImageName[subCategory];
  return `/images/schedule/${imageName}.png`;
}

// 메인 카테고리와 서브 카테고리 ID로 이미지 경로를 반환하는 함수
export function getSubCategoryImagePathById(
  mainCategoryId: number,
  subCategoryId: number
): string | null {
  const subCategoryName = getSubCategoryNameById(mainCategoryId, subCategoryId);
  if (!subCategoryName) return null;

  const imageName = subCategoryToImageName[subCategoryName as SubCategory];
  return imageName ? `/images/schedule/${imageName}.png` : null;
}
