// 메인 카테고리 정의
export const mainCategories = [
  "건강관리",
  "교육관리",
  "일상관리",
  "기념일관리",
  "모임관리",
  "외출관리",
] as const;

export type MainCategory = (typeof mainCategories)[number];

// 메인 카테고리 ID 맵핑 (숫자 인덱스용)
export const mainCategoryIds: Record<MainCategory, number> = {
  건강관리: 0,
  교육관리: 1,
  일상관리: 2,
  기념일관리: 3,
  모임관리: 4,
  외출관리: 5,
};

// 서브 카테고리 정의 - 건강관리
export const healthSubCategories = [
  "영양제 섭취",
  "체중체크",
  "예방접종",
  "건강체크",
] as const;

export type HealthSubCategory = (typeof healthSubCategories)[number];

// 서브 카테고리 정의 - 교육관리
export const educationSubCategories = [
  "사회화 훈련",
  "복종 훈련",
  "유치원 등원",
  "배변 훈련",
  "교육 기타",
] as const;

export type EducationSubCategory = (typeof educationSubCategories)[number];

// 서브 카테고리 정의 - 일상관리
export const dailySubCategories = [
  "산책",
  "놀이",
  "미용실",
  "목욕",
  "실외배변",
  "복용약",
  "간식",
  "식사",
  "일상 기타",
] as const;

export type DailySubCategory = (typeof dailySubCategories)[number];

// 서브 카테고리 정의 - 기념일관리
export const anniversarySubCategories = ["생일", "디데이"] as const;

export type AnniversarySubCategory = (typeof anniversarySubCategories)[number];

// 서브 카테고리 정의 - 모임관리
export const meetingSubCategories = [
  "산책모임",
  "동네모임",
  "친구모임",
] as const;

export type MeetingSubCategory = (typeof meetingSubCategories)[number];

// 서브 카테고리 정의 - 외출관리
export const outingSubCategories = [
  "여행",
  "운동장",
  "애견카페",
  "외출 기타",
  "애견호텔",
  "동물병원",
] as const;

export type OutingSubCategory = (typeof outingSubCategories)[number];

// 서브 카테고리 ID 맵핑
export const healthSubCategoryIds: Record<HealthSubCategory, number> = {
  "영양제 섭취": 0,
  체중체크: 1,
  예방접종: 2,
  건강체크: 3,
};

export const educationSubCategoryIds: Record<EducationSubCategory, number> = {
  "사회화 훈련": 0,
  "복종 훈련": 1,
  "유치원 등원": 2,
  "배변 훈련": 3,
  "교육 기타": 4,
};

export const dailySubCategoryIds: Record<DailySubCategory, number> = {
  산책: 0,
  놀이: 1,
  미용실: 2,
  목욕: 3,
  실외배변: 4,
  복용약: 5,
  간식: 6,
  식사: 7,
  "일상 기타": 8,
};

export const anniversarySubCategoryIds: Record<AnniversarySubCategory, number> =
  {
    생일: 0,
    디데이: 1,
  };

export const meetingSubCategoryIds: Record<MeetingSubCategory, number> = {
  산책모임: 0,
  동네모임: 1,
  친구모임: 2,
};

export const outingSubCategoryIds: Record<OutingSubCategory, number> = {
  여행: 0,
  운동장: 1,
  애견카페: 2,
  "외출 기타": 3,
  애견호텔: 4,
  동물병원: 5,
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
export const subCategoriesByMain: Record<MainCategory, readonly string[]> = {
  건강관리: healthSubCategories,
  교육관리: educationSubCategories,
  일상관리: dailySubCategories,
  기념일관리: anniversarySubCategories,
  모임관리: meetingSubCategories,
  외출관리: outingSubCategories,
};

// 메인 카테고리에 따라 해당하는 서브 카테고리 배열을 반환하는 함수
export function getSubCategoriesByMain(
  mainCategory: MainCategory
): readonly string[] {
  return subCategoriesByMain[mainCategory];
}

// 메인 카테고리와 서브 카테고리 이름으로 서브 카테고리 ID를 찾는 함수
export function getSubCategoryId(
  mainCategory: MainCategory,
  subCategory: string
): number {
  switch (mainCategory) {
    case "건강관리":
      return healthSubCategoryIds[subCategory as HealthSubCategory] ?? -1;
    case "교육관리":
      return educationSubCategoryIds[subCategory as EducationSubCategory] ?? -1;
    case "일상관리":
      return dailySubCategoryIds[subCategory as DailySubCategory] ?? -1;
    case "기념일관리":
      return (
        anniversarySubCategoryIds[subCategory as AnniversarySubCategory] ?? -1
      );
    case "모임관리":
      return meetingSubCategoryIds[subCategory as MeetingSubCategory] ?? -1;
    case "외출관리":
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
  "영양제 섭취": "vitamin",
  체중체크: "weight-check",
  예방접종: "vaccination",
  건강체크: "health-check",

  // 교육관리 서브 카테고리
  "사회화 훈련": "socialization",
  "복종 훈련": "obedience",
  "유치원 등원": "kindergarten",
  "배변 훈련": "potty-training",
  "교육 기타": "other-education",

  // 일상관리 서브 카테고리
  산책: "walk",
  놀이: "play",
  미용실: "grooming",
  목욕: "bath",
  실외배변: "outdoor-potty",
  복용약: "medicine",
  간식: "snack",
  식사: "meal",
  "일상 기타": "daily-other",

  // 기념일관리 서브 카테고리
  생일: "birthday",
  디데이: "dday",

  // 모임관리 서브 카테고리
  산책모임: "community",
  동네모임: "neighborhood",
  친구모임: "friends",

  // 외출관리 서브 카테고리
  여행: "travel",
  운동장: "dog-park",
  애견카페: "pet-cafe",
  "외출 기타": "outing-other",
  애견호텔: "pet-hotel",
  동물병원: "animal-hospital",
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
