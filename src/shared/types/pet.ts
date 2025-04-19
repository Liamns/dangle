export const petType = ["dog", "cat"] as const;
export type PetType = (typeof petType)[number];

export type DogSize = "small" | "medium" | "large";

export function classifyDogSize(weight: number): DogSize {
  if (weight <= 10) return "small";
  if (weight <= 25) return "medium";
  return "large";
}

export const dogSizeTitles: Record<DogSize, string> = {
  small: "작아서 소중해",
  medium: "지금이 제일 완벽해",
  large: "왕크니까 왕귀엽다",
};

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

export const allVaccines = [...dogVaccines, ...catVaccines] as const;
export type Vaccine = (typeof allVaccines)[number];

// List of vaccines per species, index 0=dog, 1=cat
export const vaccineListBySpec = [dogVaccines, catVaccines] as const;
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
  "자신감 뿜뿜",
  "노는게 좋아",
  "의젓해요",
  "든든한 룸메",
  "확신의 엔프피",
  "눈치백단",
  "혼자가 좋아",
  "애교만점",
  "모범생",
  "얌전해요",
  "사람 좋아",
  "집순이",
  "독불장군",
  "관종력만렙",
  "혼자놀기달인",
  "이중인격",
  "개인기천재",
  "똥꼬발랄",
  "고집쟁이",
  "예민보스",
  "호기심 천국",
] as const;
export type PersonalityTag = (typeof personalityTags)[number];

export interface TagScore {
  trait1: PersonalityTrait;
  trait2: PersonalityTrait;
  score1: number;
  score2: number;
}

export const tagScoreMap: Record<PersonalityTag, TagScore> = {
  "자신감 뿜뿜": { trait1: "활발", trait2: "독립", score1: 4.4, score2: 5.6 },
  "노는게 좋아": { trait1: "활발", trait2: "사교", score1: 4.5, score2: 5.5 },
  의젓해요: { trait1: "차분", trait2: "영리", score1: 5.7, score2: 4.3 },
  "든든한 룸메": { trait1: "차분", trait2: "독립", score1: 5.7, score2: 4.3 },
  "확신의 엔프피": { trait1: "활발", trait2: "사교", score1: 4.5, score2: 5.5 },
  눈치백단: { trait1: "차분", trait2: "영리", score1: 5.7, score2: 4.3 },
  "혼자가 좋아": { trait1: "독립", trait2: "영리", score1: 5.0, score2: 5.0 },
  애교만점: { trait1: "사교", trait2: "활발", score1: 5.0, score2: 5.0 },
  모범생: { trait1: "사교", trait2: "영리", score1: 5.0, score2: 5.0 },
  얌전해요: { trait1: "차분", trait2: "독립", score1: 5.7, score2: 4.3 },
  "사람 좋아": { trait1: "활발", trait2: "사교", score1: 4.4, score2: 5.6 },
  집순이: { trait1: "차분", trait2: "영리", score1: 5.7, score2: 4.3 },
  독불장군: { trait1: "활발", trait2: "독립", score1: 4.4, score2: 5.6 },
  관종력만렙: { trait1: "사교", trait2: "활발", score1: 5.0, score2: 5.0 },
  혼자놀기달인: { trait1: "차분", trait2: "영리", score1: 5.7, score2: 4.3 },
  이중인격: { trait1: "사교", trait2: "독립", score1: 5.0, score2: 5.0 },
  개인기천재: { trait1: "활발", trait2: "영리", score1: 4.4, score2: 5.6 },
  똥꼬발랄: { trait1: "사교", trait2: "활발", score1: 5.0, score2: 5.0 },
  고집쟁이: { trait1: "차분", trait2: "독립", score1: 5.7, score2: 4.3 },
  예민보스: { trait1: "영리", trait2: "독립", score1: 5.0, score2: 5.0 },
  "호기심 천국": { trait1: "활발", trait2: "독립", score1: 6, score2: 4 },
};

export interface PersonalityTypeDef {
  primary: PersonalityTrait;
  secondary: PersonalityTrait;
  priority: PersonalityTrait | null;
}

export const personalityTypeMap: Record<string, PersonalityTypeDef> = {
  "천진난만 안내자": { primary: "사교", secondary: "차분", priority: "사교" },
  "영리한 부끄럼쟁이": { primary: "영리", secondary: "차분", priority: "차분" },
  "느긋한 모범생": { primary: "영리", secondary: "독립", priority: "영리" },
  "자유로운 영혼": { primary: "활발", secondary: "독립", priority: "독립" },
  "열정적인 탐구자": { primary: "활발", secondary: "사교", priority: "활발" },
  "용감한 사냥꾼": { primary: "영리", secondary: "사교", priority: null },
  "눈치빠른 탐험가": { primary: "영리", secondary: "독립", priority: null },
  "소심한 흥부자": { primary: "영리", secondary: "활발", priority: null },
};
