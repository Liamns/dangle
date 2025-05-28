/**
 * 루틴 카테고리(운동, 식단, 미용, 라이프스타일, 기타)
 */
export enum RoutineCategory {
  EXERCISE = "Exercise",
  MEAL = "Meal",
  BEAUTY = "Beauty",
  LIFESTYLE = "LifeStyle",
  OTHER = "Daily",
}

/**
 * 루틴 타입(팁, 주의사항)
 */
export enum RoutineType {
  TIP = "Tips",
  CAUTION = "Caution",
}

/**
 * 루틴 카테고리별 색상 코드 매핑
 */
export const RoutineCategoryColors: Record<RoutineCategory, string> = {
  [RoutineCategory.MEAL]: "#74c297CC",
  [RoutineCategory.OTHER]: "#ffdb6d",
  [RoutineCategory.BEAUTY]: "#ff9ea4CC",
  [RoutineCategory.LIFESTYLE]: "#6ab4ffCC",
  [RoutineCategory.EXERCISE]: "#58d0efCC",
};

/**
 * 루틴 카테고리별 한글명 매핑
 */
export const RoutineCategoryKor: Record<RoutineCategory, string> = {
  [RoutineCategory.MEAL]: "식단",
  [RoutineCategory.OTHER]: "일상 기타",
  [RoutineCategory.BEAUTY]: "미용",
  [RoutineCategory.LIFESTYLE]: "라이프스타일",
  [RoutineCategory.EXERCISE]: "운동",
};

/**
 * 루틴 타입별 한글명 매핑
 */
export const RoutineTypeKor: Record<RoutineType, string> = {
  [RoutineType.TIP]: "꿀팁",
  [RoutineType.CAUTION]: "주의사항",
};
