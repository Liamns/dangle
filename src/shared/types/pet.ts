export const petType = ["dog", "cat"] as const;
export type PetType = (typeof petType)[number];

// Unified pet size type
export type PetSize = "small" | "medium" | "large";

// Dog size classification
export function classifyDogSize(weight: number): PetSize {
  if (weight <= 10) return "small";
  if (weight <= 25) return "medium";
  return "large";
}

// 크기 제목을 통합하여 하나의 객체로 관리
export const petSizeTitles: Record<PetSize, string> = {
  small: "작아서 소중해",
  medium: "지금이 제일 완벽해",
  large: "왕크니까 왕귀엽다",
};

// Cat size classification
export function classifyCatSize(weight: number): PetSize {
  if (weight <= 4) return "small";
  if (weight <= 6) return "medium";
  return "large";
}

/**
 * 반려동물의 종류와 무게를 기준으로 크기를 분류합니다.
 * @param petSpec 반려동물 종류 (0: dog, 1: cat)
 * @param weight 반려동물의 무게 (kg)
 * @returns 반려동물 크기 분류 ('small', 'medium', 'large')
 */
export function classifyPetSize(petSpec: number, weight: number): PetSize {
  if (petSpec === 0) {
    return classifyDogSize(weight);
  } else {
    return classifyCatSize(weight);
  }
}

/**
 * 반려동물의 종류와 크기를 기준으로 크기 제목을 반환합니다.
 * @param petSpec 반려동물 종류 (0: dog, 1: cat)
 * @param size 반려동물 크기 ('small', 'medium', 'large')
 * @returns 반려동물 크기 제목
 */
export function getPetSizeTitle(petSpec: number, size: PetSize): string {
  // 통합된 petSizeTitles 사용
  return petSizeTitles[size];
}

// Vaccination types for pets
export const dogVaccines = [
  "혼합예방주사",
  "코로나바이러스성장염",
  "기관·기관지염",
  "광견병",
] as const;
export type DogVaccine = (typeof dogVaccines)[number];

export const catVaccines = [
  "혼합예방주사",
  "고양이백혈병",
  "전염성복막염",
  "관경병",
] as const;
export type CatVaccine = (typeof catVaccines)[number];

// 미접종 옵션 추가
export const noVaccine = "미접종" as const;
export type NoVaccine = typeof noVaccine;

export const allVaccines = [...dogVaccines, ...catVaccines, noVaccine] as const;
export type Vaccine = (typeof allVaccines)[number];

// 폼 필드 경로를 위한 타입 추가
export type VaccinationFieldPath = `vaccinations.${Vaccine}`;

// List of vaccines per species, index 0=dog, 1=cat
export const vaccineListBySpec = [
  [...dogVaccines, noVaccine],
  [...catVaccines, noVaccine],
] as const;
export type VaccineListBySpec = typeof vaccineListBySpec;

// Personality evaluation types
export const personalityTraits = [
  "활발",
  "차분",
  "사교",
  "영리",
  "독립",
] as const;
export type PersonalityTrait = (typeof personalityTraits)[number];

export const personalityTags = [
  "자신감뿜뿜",
  "노는게좋아",
  "의젓해요",
  "든든한룸메",
  "확신의엔프피",
  "눈치백단",
  "혼자가좋아",
  "애교만점",
  "모범생",
  "얌전해요",
  "사람좋아",
  "집순이",
  "독불장군",
  "관종력만렙",
  "혼자놀기달인",
  "이중인격",
  "개인기천재",
  "똥꼬발랄",
  "고집쟁이",
  "예민보스",
  "호기심천국",
] as const;
export type PersonalityTag = (typeof personalityTags)[number];

export interface TagScore {
  trait1: PersonalityTrait;
  trait2: PersonalityTrait;
  score1: number;
  score2: number;
}

export const tagScoreMap: Record<PersonalityTag, TagScore> = {
  자신감뿜뿜: { trait1: "활발", trait2: "독립", score1: 4.0, score2: 3.0 },
  노는게좋아: { trait1: "활발", trait2: "사교", score1: 4.0, score2: 3.0 },
  의젓해요: { trait1: "차분", trait2: "영리", score1: 4.0, score2: 3.0 },
  든든한룸메: { trait1: "차분", trait2: "독립", score1: 4.0, score2: 3.0 },
  확신의엔프피: { trait1: "활발", trait2: "사교", score1: 3.0, score2: 3.0 },
  눈치백단: { trait1: "차분", trait2: "영리", score1: 3.0, score2: 3.0 },
  혼자가좋아: { trait1: "독립", trait2: "영리", score1: 4.0, score2: 3.0 },
  애교만점: { trait1: "사교", trait2: "활발", score1: 3.0, score2: 3.0 },
  모범생: { trait1: "사교", trait2: "영리", score1: 4.0, score2: 3.0 },
  얌전해요: { trait1: "차분", trait2: "독립", score1: 3.0, score2: 3.0 },
  사람좋아: { trait1: "활발", trait2: "사교", score1: 3.0, score2: 3.0 },
  집순이: { trait1: "차분", trait2: "영리", score1: 3.0, score2: 3.0 },
  독불장군: { trait1: "활발", trait2: "독립", score1: 4.0, score2: 3.0 },
  관종력만렙: { trait1: "사교", trait2: "활발", score1: 3.0, score2: 3.0 },
  혼자놀기달인: { trait1: "차분", trait2: "영리", score1: 3.0, score2: 3.0 },
  이중인격: { trait1: "사교", trait2: "독립", score1: 3.0, score2: 3.0 },
  개인기천재: { trait1: "활발", trait2: "영리", score1: 3.0, score2: 3.0 },
  똥꼬발랄: { trait1: "사교", trait2: "활발", score1: 3.0, score2: 3.0 },
  고집쟁이: { trait1: "차분", trait2: "독립", score1: 3.0, score2: 3.0 },
  예민보스: { trait1: "영리", trait2: "독립", score1: 3.0, score2: 3.0 },
  호기심천국: { trait1: "활발", trait2: "독립", score1: 3.0, score2: 3.0 },
};

export interface PersonalityTypeDef {
  primary: PersonalityTrait;
  secondary: PersonalityTrait;
  priority: PersonalityTrait | null;
  tag: string;
}

export const personalityTypeMap: Record<string, PersonalityTypeDef> = {
  "천진난만 안내자": {
    primary: "사교",
    secondary: "차분",
    priority: "사교",
    tag: "guide",
  },
  "영리한 부끄럼쟁이": {
    primary: "영리",
    secondary: "차분",
    priority: "차분",
    tag: "shame",
  },
  "느긋한 모범생": {
    primary: "영리",
    secondary: "독립",
    priority: "영리",
    tag: "model",
  },
  "자유로운 영혼": {
    primary: "활발",
    secondary: "독립",
    priority: "독립",
    tag: "free",
  },
  "열정적인 탐구자": {
    primary: "활발",
    secondary: "사교",
    priority: "활발",
    tag: "investigator",
  },
  "용감한 사냥꾼": {
    primary: "영리",
    secondary: "사교",
    priority: null,
    tag: "hunter",
  },
  "눈치빠른 탐험가": {
    primary: "영리",
    secondary: "독립",
    priority: null,
    tag: "explorer",
  },
  "소심한 흥부자": {
    primary: "영리",
    secondary: "활발",
    priority: null,
    tag: "excited",
  },
};
